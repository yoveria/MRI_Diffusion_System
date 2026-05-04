# Gunicorn config for MRI Diffusion System
# Usage: gunicorn -c gunicorn_config.py BackEnd.app:app
#
# On CPU servers, reduce workers to 1 (model is memory-heavy).
# On GPU servers, keep workers=1 (CUDA is single-process only).

import os

_port = os.getenv("FLASK_PORT", "5000")
bind = f"0.0.0.0:{_port}"

workers = int(os.getenv("GUNICORN_WORKERS", "1"))
worker_class = "sync"

# CPU inference is slow; set generous timeouts
timeout = int(os.getenv("GUNICORN_TIMEOUT", "900"))
graceful_timeout = 30

# Don't preload — avoids forking after CUDA context init
preload_app = False

accesslog = "-"
errorlog = "-"
loglevel = os.getenv("GUNICORN_LOGLEVEL", "info")
