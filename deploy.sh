#!/usr/bin/env bash
# MRI Diffusion System — One-click deployment script
# Usage:
#   CPU:  bash deploy.sh --cpu  --checkpoint /path/to/model.ckpt
#   GPU:  bash deploy.sh --gpu  --checkpoint /path/to/model.ckpt
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# ---------- defaults ----------
MODE=""
CHECKPOINT=""
PORT="5000"
INSTALL_DIR="$ROOT_DIR"
VENV_DIR=""

show_help() {
  cat <<EOF
Usage: bash deploy.sh --cpu|--gpu --checkpoint PATH [OPTIONS]

Required:
  --cpu                  Install CPU-only PyTorch
  --gpu                  Install CUDA 11.8 PyTorch
  --checkpoint PATH      Path to your SelfRDB .ckpt file

Options:
  --port PORT            Backend port (default: 5000)
  --install-dir DIR      Installation directory (default: project root)
  --no-frontend          Skip frontend build (API-only mode)
  --help                 Show this message
EOF
  exit 0
}

# ---------- parse args ----------
BUILD_FRONTEND=1
while [[ $# -gt 0 ]]; do
  case "$1" in
    --cpu) MODE="cpu"; shift ;;
    --gpu) MODE="gpu"; shift ;;
    --checkpoint) CHECKPOINT="$2"; shift 2 ;;
    --port) PORT="$2"; shift 2 ;;
    --install-dir) INSTALL_DIR="$2"; shift 2 ;;
    --no-frontend) BUILD_FRONTEND=0; shift ;;
    --help) show_help ;;
    *) echo "Unknown option: $1"; show_help ;;
  esac
done

if [[ -z "$MODE" ]]; then
  echo "[ERROR] Must specify --cpu or --gpu" >&2
  show_help
fi

if [[ -z "$CHECKPOINT" ]]; then
  echo "[ERROR] Must specify --checkpoint" >&2
  show_help
fi

if [[ ! -f "$CHECKPOINT" ]]; then
  echo "[ERROR] Checkpoint not found: $CHECKPOINT" >&2
  exit 1
fi

# ---------- install ----------
echo "==> Installing dependencies (mode: $MODE)"

if [[ "$MODE" == "cpu" ]]; then
  REQ_FILE="$ROOT_DIR/requirements.txt"
else
  REQ_FILE="$ROOT_DIR/requirements-gpu.txt"
fi

if [[ ! -f "$REQ_FILE" ]]; then
  echo "[ERROR] Requirements file not found: $REQ_FILE" >&2
  exit 1
fi

# Create venv if needed
if [[ -z "$VENV_DIR" ]]; then
  VENV_DIR="$INSTALL_DIR/.venv"
fi

if [[ ! -f "$VENV_DIR/bin/python" ]]; then
  echo "==> Creating virtual environment at $VENV_DIR"
  python3 -m venv "$VENV_DIR"
fi

echo "==> Installing Python packages..."
"$VENV_DIR/bin/pip" install --upgrade pip -q
"$VENV_DIR/bin/pip" install -r "$REQ_FILE"

# gunicorn (production WSGI server)
"$VENV_DIR/bin/pip" install gunicorn -q

# ---------- symlink checkpoint ----------
CKPT_DIR="$ROOT_DIR/brats_t1_t2"
mkdir -p "$CKPT_DIR"
CKPT_LINK="$CKPT_DIR/$(basename "$CHECKPOINT")"
if [[ ! -f "$CKPT_LINK" ]]; then
  ln -sf "$(realpath "$CHECKPOINT")" "$CKPT_LINK"
  echo "==> Checkpoint linked: $CKPT_LINK"
fi

export SELFRDB_CHECKPOINT="$CKPT_LINK"

# ---------- verify backend ----------
echo "==> Testing backend import..."
"$VENV_DIR/bin/python" -c "from SelfRDB.backbones.ncsnpp import NCSNpp; print('  NCSNpp import OK')" || {
  echo "[ERROR] Model import failed. Check your environment." >&2
  exit 1
}

"$VENV_DIR/bin/python" -c "
import torch
print(f'  PyTorch {torch.__version__}')
print(f'  CUDA available: {torch.cuda.is_available()}')
if torch.cuda.is_available():
    print(f'  GPU: {torch.cuda.get_device_name(0)}')
"

# ---------- frontend ----------
if [[ "$BUILD_FRONTEND" -eq 1 ]]; then
  echo "==> Building frontend..."

  FE_DIR="$ROOT_DIR/FrontEnd/mri-diffusion-system"
  if [[ -f "$FE_DIR/package.json" ]]; then
    cd "$FE_DIR"
    npm install --silent
    VITE_API_BASE_URL="http://127.0.0.1:$PORT" npm run build
    cd "$ROOT_DIR"
    echo "  Frontend built: $FE_DIR/dist/"
  else
    echo "  [SKIP] Frontend directory not found, API-only mode"
  fi
fi

# ---------- summary ----------
echo ""
echo "============================================"
echo " Deployment complete!"
echo "============================================"
echo ""
echo "Start backend (dev mode):"
echo "  cd $ROOT_DIR"
echo "  export SELFRDB_CHECKPOINT=$CKPT_LINK"
echo "  $VENV_DIR/bin/python BackEnd/app.py"
echo ""
echo "Start backend (production):"
echo "  cd $ROOT_DIR"
echo "  $VENV_DIR/bin/gunicorn -c gunicorn_config.py BackEnd.app:app"
echo ""
if [[ "$BUILD_FRONTEND" -eq 1 ]]; then
  echo "Start frontend:"
  echo "  cd $ROOT_DIR/FrontEnd/mri-diffusion-system"
  echo "  npm run preview -- --host 0.0.0.0 --port 5173"
  echo ""
fi
echo "Health check:"
echo "  curl http://127.0.0.1:$PORT/api/health"
echo ""
