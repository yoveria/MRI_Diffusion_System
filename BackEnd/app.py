import glob
import os
import sys
import uuid

import cv2
import numpy as np
import threading
import torch
import yaml
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
SELFRDB_DIR = os.path.join(PROJECT_ROOT, "SelfRDB")

if SELFRDB_DIR not in sys.path:
    sys.path.insert(0, SELFRDB_DIR)

from main import BridgeRunner  # noqa: E402

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")
RESULT_FOLDER = os.path.join(BASE_DIR, "static", "results")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)


class SelfRDBService:
    def __init__(self):
        self.config_path = os.getenv("SELFRDB_CONFIG", os.path.join(SELFRDB_DIR, "config.yaml"))
        self.checkpoint_path = os.getenv("SELFRDB_CHECKPOINT", self._discover_checkpoint())

        if os.getenv("SELFRDB_FORCE_CPU", "").lower() in {"1", "true", "yes"}:
            self.device = torch.device("cpu")
            cpu_threads = os.getenv("OMP_NUM_THREADS") or os.getenv("TORCH_THREADS", "2")
            torch.set_num_threads(int(cpu_threads))
        elif torch.cuda.is_available():
            self.device = torch.device("cuda")
        else:
            self.device = torch.device("cpu")
            cpu_threads = os.getenv("OMP_NUM_THREADS") or os.getenv("TORCH_THREADS", "2")
            torch.set_num_threads(int(cpu_threads))

        self.image_size = None
        self.norm = True
        self.source_modality = None
        self.target_modality = None
        self.model = None
        self.error = None
        self._load()

    def _discover_checkpoint(self):
        patterns = [
            os.path.join(SELFRDB_DIR, "logs", "**", "*.ckpt"),
            os.path.join(PROJECT_ROOT, "**", "*.ckpt"),
        ]
        candidates = []
        for pattern in patterns:
            candidates.extend(glob.glob(pattern, recursive=True))

        # Remove duplicates and known cache directories.
        candidates = [
            path for path in sorted(set(candidates))
            if "__pycache__" not in path and ".git" not in path
        ]
        if not candidates:
            return None
        return max(candidates, key=os.path.getmtime)

    def _load(self):
        try:
            if not os.path.exists(self.config_path):
                raise FileNotFoundError(f"SelfRDB config not found: {self.config_path}")

            with open(self.config_path, "r", encoding="utf-8") as f:
                config = yaml.safe_load(f)

            if not self.checkpoint_path or not os.path.exists(self.checkpoint_path):
                raise FileNotFoundError(
                    "SelfRDB checkpoint not found. Set SELFRDB_CHECKPOINT or place a .ckpt in the project."
                )

            self.image_size = int(config["data"]["image_size"])
            self.norm = bool(config["data"].get("norm", True))
            self.source_modality = config["data"].get("source_modality")
            self.target_modality = config["data"].get("target_modality")
            model_cfg = self._resolve_model_cfg(config)

            # Load checkpoint manually to skip optimizer states (saves ~2x model memory on CPU)
            ckpt = torch.load(self.checkpoint_path, map_location="cpu", weights_only=False)
            hp = dict(ckpt.get("hyper_parameters", {}))
            hp.update(model_cfg)
            try:
                self.model = BridgeRunner(**hp)
                self.model.load_state_dict(ckpt["state_dict"], strict=True)
            except Exception:
                self.model = BridgeRunner(**hp)
                self.model.load_state_dict(ckpt["state_dict"], strict=False)
            self.model.to(self.device)
            self.model.eval()

            # 释放判别器内存（约占模型参数的 30%）—— 推理只需生成器
            if hasattr(self.model, "discriminator"):
                del self.model.discriminator
            import gc as _gc
            _gc.collect()

            self.error = None
            print(f"[SelfRDB] Loaded checkpoint: {self.checkpoint_path}")
        except Exception as exc:  # pylint: disable=broad-except
            self.error = str(exc)
            self.model = None
            print(f"[SelfRDB] Failed to initialize: {self.error}")

    def _resolve_model_cfg(self, config):
        model_cfg = dict(config.get("model", {}))
        data_cfg = config.get("data", {})
        gen_cfg = dict(model_cfg.get("generator_params", {}))

        # Resolve common OmegaConf placeholder from config.yaml:
        # generator_params.image_size: ${data.image_size}
        image_size = gen_cfg.get("image_size")
        if isinstance(image_size, str) and image_size.strip() == "${data.image_size}":
            gen_cfg["image_size"] = int(data_cfg["image_size"])

        model_cfg["generator_params"] = gen_cfg
        return model_cfg

    def _preprocess(self, image):
        original_h, original_w = image.shape[:2]
        resized = False

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        gray = gray.astype(np.float32) / 255.0

        if original_h > self.image_size or original_w > self.image_size:
            gray = cv2.resize(gray, (self.image_size, self.image_size), interpolation=cv2.INTER_AREA)
            resized = True
            pad_info = None
        else:
            pad_h = self.image_size - original_h
            pad_w = self.image_size - original_w
            pad_top = pad_h // 2
            pad_bottom = pad_h - pad_top
            pad_left = pad_w // 2
            pad_right = pad_w - pad_left
            gray = np.pad(gray, ((pad_top, pad_bottom), (pad_left, pad_right)), mode="constant")
            pad_info = (pad_top, pad_bottom, pad_left, pad_right)

        if self.norm:
            gray = (gray - 0.5) / 0.5

        tensor = torch.from_numpy(gray).unsqueeze(0).unsqueeze(0).to(self.device)
        meta = {
            "original_h": original_h,
            "original_w": original_w,
            "resized": resized,
            "pad_info": pad_info,
        }
        return tensor, meta

    def _postprocess(self, pred, meta):
        out = pred.detach().cpu().squeeze().numpy()

        if self.norm:
            out = (out + 1.0) / 2.0

        out = np.clip(out, 0.0, 1.0)

        if meta["resized"]:
            out = cv2.resize(out, (meta["original_w"], meta["original_h"]), interpolation=cv2.INTER_CUBIC)
        else:
            pad_top, pad_bottom, pad_left, pad_right = meta["pad_info"]
            h_end = out.shape[0] - pad_bottom if pad_bottom > 0 else out.shape[0]
            w_end = out.shape[1] - pad_right if pad_right > 0 else out.shape[1]
            out = out[pad_top:h_end, pad_left:w_end]

        out = (out * 255.0).astype(np.uint8)
        return out

    @torch.inference_mode()
    def infer(self, input_path, output_path):
        if self.model is None:
            raise RuntimeError(self.error or "SelfRDB model is not initialized.")

        image = cv2.imread(input_path, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Invalid image file.")

        y, meta = self._preprocess(image)
        pred = self.model.diffusion.sample_x0(y, self.model.generator)
        output = self._postprocess(pred, meta)
        cv2.imwrite(output_path, output)

        import gc as _gc
        _gc.collect()


selfrdb_service = SelfRDBService()

_inference_lock = threading.Lock()


@app.route("/api/health", methods=["GET"])
def health():
    if selfrdb_service.model is None:
        return jsonify({"ok": False, "selfrdb_ready": False, "error": selfrdb_service.error}), 500
    return jsonify(
        {
            "ok": True,
            "selfrdb_ready": True,
            "checkpoint": selfrdb_service.checkpoint_path,
            "device": str(selfrdb_service.device),
            "source_modality": selfrdb_service.source_modality,
            "target_modality": selfrdb_service.target_modality,
            "image_size": selfrdb_service.image_size,
        }
    )


@app.route("/api/generate", methods=["POST"])
def generate_mri():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    if selfrdb_service.model is None:
        return jsonify({"error": "SelfRDB is not ready", "detail": selfrdb_service.error}), 500

    if not _inference_lock.acquire(blocking=False):
        return jsonify({"error": "服务器繁忙，请稍后重试。"}), 503

    try:
        file = request.files["image"]
        file_extension = os.path.splitext(file.filename)[1] or ".png"
        file_id = str(uuid.uuid4())
        input_filename = f"{file_id}{file_extension}"
        result_filename = f"{file_id}.png"

        input_path = os.path.join(UPLOAD_FOLDER, input_filename)
        result_path = os.path.join(RESULT_FOLDER, result_filename)
        file.save(input_path)

        try:
            selfrdb_service.infer(input_path, result_path)
        except Exception as exc:  # pylint: disable=broad-except
            return jsonify({"error": "SelfRDB inference failed", "detail": str(exc)}), 500
    finally:
        _inference_lock.release()

    return jsonify(
        {
            "success": True,
            "result_url": f"/static/results/{result_filename}",
            "message": "Generated by SelfRDB diffusion bridge",
        }
    )


@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory(os.path.join(BASE_DIR, "static"), path)


if __name__ == "__main__":
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0").lower() in {"1", "true", "yes"}
    app.run(host=host, debug=debug, port=port)
