# MRI Diffusion System

基于扩散模型的多模态脑 MRI 生成系统。以单模态图像（T1/T2）为输入，结合 SelfRDB 模型实现跨模态生成、结果恢复与可视化对比。

## 目录结构

```text
mri-diffusion-system/
├── BackEnd/                        # Flask 后端 API
├── FrontEnd/mri-diffusion-system   # React 前端
├── SelfRDB/                        # SelfRDB 扩散模型
├── brats_t1_t2/                    # 模型 checkpoint（需自行放置）
├── scripts/start_backend.sh        # 后端启动脚本
├── deploy.sh                       # 一键部署脚本
├── gunicorn_config.py              # 生产级 WSGI 配置
├── nginx.conf                      # Nginx 反代配置模板
└── mri-diffusion.service           # systemd 服务单元
```

## 前置条件

- **Checkpoint 文件**: 需自行准备 `.ckpt` 模型文件，放置于 `brats_t1_t2/` 目录或通过环境变量指定路径

### 硬件要求

| 场景 | CPU | 内存 | GPU | 磁盘 |
|------|-----|------|-----|------|
| GPU 推理 | 4 vCPU | 8 GiB | 1× NVIDIA (建议 A10/T4) | 20 GiB |
| CPU 推理 | 8 vCPU | 16 GiB | 无 | 20 GiB |

> **注意**: CPU 推理单张图片约 1-3 分钟，仅适合低频使用或演示场景。生产环境建议使用 GPU。

## 快速部署（推荐）

```bash
# CPU 服务器
bash deploy.sh --cpu --checkpoint /path/to/model.ckpt

# GPU 服务器
bash deploy.sh --gpu --checkpoint /path/to/model.ckpt --port 5000
```

脚本会自动完成：Python 虚拟环境创建、依赖安装、checkpoint 链接、前端构建。完成后按输出提示启动服务。

---

## 手动部署

### 1. 系统依赖

```bash
sudo apt update
sudo apt install -y git curl build-essential \
  libgl1 libglib2.0-0 libsm6 libxext6 libxrender1
```

### 2. 安装 Python 3.9+

```bash
# 方式 A: Miniconda（推荐）
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
bash ~/miniconda.sh -b -p $HOME/miniconda3
eval "$($HOME/miniconda3/bin/conda shell.bash hook)"
conda init bash
# 重新打开终端后:
conda create -n selfrdb python=3.9 -y
conda activate selfrdb

# 方式 B: venv（无 conda）
sudo apt install -y python3.9 python3.9-venv
python3.9 -m venv .venv
source .venv/bin/activate
```

### 3. 安装 Python 依赖

```bash
# CPU 服务器
pip install -r requirements.txt

# GPU 服务器 (CUDA 11.8)
pip install -r requirements-gpu.txt

# 可选：生产级 WSGI 服务器
pip install gunicorn
```

### 4. 放置 checkpoint

```bash
mkdir -p brats_t1_t2
cp /path/to/your/model.ckpt brats_t1_t2/brats_t1_t2.ckpt
```

### 5. 验证环境

```bash
# GPU 服务器验证
python -c "import torch; print('CUDA:', torch.cuda.is_available())"

# CPU 服务器验证
python -c "
from SelfRDB.backbones.ncsnpp import NCSNpp
print('SelfRDB import OK (CPU mode)')
"
```

### 6. 启动后端

```bash
export SELFRDB_CONFIG=$PWD/SelfRDB/config.yaml
export SELFRDB_CHECKPOINT=$PWD/brats_t1_t2/brats_t1_t2.ckpt
export FLASK_HOST=0.0.0.0
export FLASK_PORT=5000
python BackEnd/app.py
```

健康检查：

```bash
curl http://127.0.0.1:5000/api/health
# {"ok":true,"selfrdb_ready":true,"device":"cuda",...}
```

### 7. 构建并启动前端

需要 Node.js 20+。

```bash
cd FrontEnd/mri-diffusion-system
npm install

# 创建生产环境变量（替换为你的服务器 IP）
echo "VITE_API_BASE_URL=http://YOUR_SERVER_IP:5000" > .env.production

npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

浏览器访问 `http://YOUR_SERVER_IP:5173`

---

## 生产环境部署

### Gunicorn（WSGI 服务器）

```bash
gunicorn -c gunicorn_config.py BackEnd.app:app
```

环境变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `GUNICORN_WORKERS` | `1` | Worker 数（模型大，建议保持 1） |
| `GUNICORN_TIMEOUT` | `300` | 请求超时秒数（CPU 推理需较长时间） |

### Nginx 反代

1. 将 `nginx.conf` 复制到 `/etc/nginx/sites-available/mri-diffusion`
2. 修改 `server_name` 和 `root` 路径
3. 创建软链接并重载：

```bash
ln -s /etc/nginx/sites-available/mri-diffusion /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Systemd 服务

1. 修改 `mri-diffusion.service` 中的路径为实际部署路径
2. 复制并启动：

```bash
cp mri-diffusion.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now mri-diffusion
```

---

## 环境变量参考

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `SELFRDB_CONFIG` | `SelfRDB/config.yaml` | 模型配置文件路径 |
| `SELFRDB_CHECKPOINT` | 自动发现 | Checkpoint 文件路径 |
| `SELFRDB_FORCE_CPU` | `0` | 强制使用 CPU（即使有 GPU） |
| `FLASK_HOST` | `0.0.0.0` | Flask 监听地址 |
| `FLASK_PORT` | `5000` | Flask 监听端口 |
| `FLASK_DEBUG` | `0` | Flask 调试模式 |
| `TORCH_THREADS` | `2` | CPU 推理时的线程数 |

---

## 网络配置

在云服务器安全组中开放以下端口：

| 端口 | 协议 | 用途 |
|------|------|------|
| 5000 | TCP | Flask API |
| 5173 | TCP | Vite 前端预览（仅开发/调试） |
| 80/443 | TCP | Nginx（生产环境） |

---

## 常见问题

**Q: 启动时报 `nvcc not found`？**

v1.1+ 已修复此问题。CUDA 自定义算子编译失败时会自动回退到纯 PyTorch CPU 实现。如遇到此错误请更新代码。

**Q: CPU 推理太慢？**

- 设置 `TORCH_THREADS=4`（或等于 CPU 核数）
- 设置 `OMP_NUM_THREADS=4`
- 考虑使用 GPU 服务器

**Q: 内存不足（OOM）？**

- CPU 模式已跳过 optimizer 状态加载，内存需求降低约 50%
- 如仍 OOM，需要至少 8 GiB 内存的服务器

**Q: Checkpoint 加载失败？**

确保 checkpoint 与 `SelfRDB/config.yaml` 中的模型配置匹配（`generator_params`、`diffusion_params` 等）。不同配置下训练的 checkpoint 可能不兼容。
