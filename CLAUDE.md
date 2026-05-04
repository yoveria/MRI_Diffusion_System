# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Backend — dev mode (Flask built-in server)
python BackEnd/app.py

# Backend — production (Gunicorn, 1 sync worker)
gunicorn -c gunicorn_config.py BackEnd.app:app

# Frontend — dev server
cd FrontEnd/mri-diffusion-system && npm run dev

# Frontend — production build
cd FrontEnd/mri-diffusion-system && npm run build

# One-click deploy
bash deploy.sh --cpu --checkpoint /path/to/model.ckpt
```

There are no tests or linters in this repository.

## Architecture

**Backend** (`BackEnd/app.py`) — Flask server on port 5000. Two API routes:

- `GET /api/health` — returns model status, device, checkpoint path
- `POST /api/generate` — accepts multipart image upload, runs inference, returns result URL
- `GET /static/<path>` — serves uploaded images and generated results from `BackEnd/static/`

On startup, `app.py` instantiates a global `SelfRDBService` singleton that loads the model checkpoint and holds it in memory for the lifetime of the process.

**Model loading** (`SelfRDBService._load()` in `app.py`) — Builds a `BridgeRunner` (LightningModule) from `SelfRDB/main.py`, which constructs three sub-networks:

- `self.generator` — `NCSNpp` (NCSN++ backbone, 256×256, ch_mult=[1,1,2,2,4,4])
- `self.discriminator` — `Discriminator_large` (used only in training, sits idle during inference)
- `self.diffusion` — `DiffusionBridge` (forward/reverse diffusion scheduler, 10 steps, 2 recursions)

Inference calls `self.model.diffusion.sample_x0(y, self.model.generator)` — only the generator and diffusion bridge are used.

**Preprocessing** (`_preprocess`) — converts image to grayscale float32, pads or resizes to 256×256, normalizes to [-1, 1].

**Postprocessing** (`_postprocess`) — denormalizes to [0, 255], reverses padding/resize, saves as uint8 PNG.

**Frontend** — React 19 + TypeScript + Tailwind CSS + Vite + react-router-dom. Two-page SPA:

- **Landing 页**（首页）: `LandingHero` → `LandingFeatures` → `LandingGuide` → `LandingScenarios` → `LandingReliability`
- **Demo 工作台**（/demo）: `DemoUploader` → `DemoControlPanel` → `DemoWorkbench`（含 ImagePane / ComparePane / StatusBar / DownloadAction）
- 路由定义在 `src/constants/routes.ts`，通过 `pushState` 管理
- API 服务层在 `src/services/demoApi.ts`（axios 封装，超时 900s）
- 类型定义在 `src/types/demo.ts`

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SELFRDB_CONFIG` | `SelfRDB/config.yaml` | Path to model config YAML |
| `SELFRDB_CHECKPOINT` | auto-discovered | Path to `.ckpt` file |
| `SELFRDB_FORCE_CPU` | `0` | Force CPU even if CUDA available |
| `OMP_NUM_THREADS` / `TORCH_THREADS` | `2` | Thread count for CPU inference |
| `FLASK_HOST` | `0.0.0.0` | Flask bind address |
| `FLASK_PORT` | `5000` | Flask bind port |
| `FLASK_DEBUG` | `0` | Flask debug mode |
| `GUNICORN_WORKERS` | `1` | Must be 1 (model is memory-heavy) |
| `GUNICORN_TIMEOUT` | `300` | Request timeout in seconds |

On CPU with no CUDA, the code auto-detects and falls back to `torch.device("cpu")`.

## Key Gotchas

- **Config placeholder resolution**: `SelfRDB/config.yaml` uses OmegaConf-style `${data.image_size}` placeholders in `generator_params.image_size`. `_resolve_model_cfg()` in `app.py` handles this manually — if you change the config structure, update that method.

- **Checkpoint discovery**: When `SELFRDB_CHECKPOINT` is unset, `_discover_checkpoint()` globs for `*.ckpt` files under `SelfRDB/logs/` and the project root, picking the most recently modified. It won't find checkpoints placed elsewhere.

- **strict=False fallback**: If `load_state_dict(strict=True)` fails, the code silently falls back to `strict=False`. Mismatched keys produce garbage output with no error — always verify your checkpoint matches the `generator_params` in config.yaml.

- **Model stays in memory**: The `BridgeRunner` instance is a global singleton. Every `POST /api/generate` reuses the same loaded model. Do not use `preload_app = True` in Gunicorn — it would fork after CUDA context init and double memory.

- **The discriminator is loaded but never used during inference** — it occupies several hundred MB of RAM that could be freed. If deploying on a memory-constrained machine (<8 GiB), delete it after loading: `del self.model.discriminator`.

- **Custom CUDA ops** in `SelfRDB/backbones/op/` (`fused_bias_act`, `upfirdn2d`) are compiled by ninja on first import. On CPU-only systems, the code automatically falls back to pure PyTorch implementations.


要求：
Claude解释、计划时使用中文
git提交时的注释尽量使用中文，且格式精准