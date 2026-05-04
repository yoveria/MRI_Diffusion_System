#!/usr/bin/env bash
# Start MRI Diffusion System backend.
# Usage: bash auto.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export SELFRDB_CONFIG="${SELFRDB_CONFIG:-$ROOT_DIR/SelfRDB/config.yaml}"
export SELFRDB_CHECKPOINT="${SELFRDB_CHECKPOINT:-$ROOT_DIR/brats_t1_t2/brats_t1_t2.ckpt}"
export FLASK_HOST="${FLASK_HOST:-0.0.0.0}"
export FLASK_PORT="${FLASK_PORT:-5000}"
export FLASK_DEBUG="${FLASK_DEBUG:-0}"

echo "SELFRDB_CONFIG   = $SELFRDB_CONFIG"
echo "SELFRDB_CHECKPOINT = $SELFRDB_CHECKPOINT"
echo "Flask: $FLASK_HOST:$FLASK_PORT (debug=$FLASK_DEBUG)"

if [[ ! -f "$SELFRDB_CONFIG" ]]; then
  echo "[ERROR] Config not found: $SELFRDB_CONFIG" >&2
  exit 1
fi

if [[ ! -f "$SELFRDB_CHECKPOINT" ]]; then
  echo "[ERROR] Checkpoint not found: $SELFRDB_CHECKPOINT" >&2
  echo "Set SELFRDB_CHECKPOINT to your .ckpt file path." >&2
  exit 1
fi

cd "$ROOT_DIR"
exec python BackEnd/app.py
