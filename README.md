# MRI Diffusion System

基于扩散模型的多模态脑 MRI 生成系统。以单模态图像为输入，结合面向脑 MRI 场景适配的 SelfRDB 模型与前后端分离架构，实现预处理、跨模态生成（T1→T2）、结果恢复、可视化对比与下载输出的一体化流程，可服务于医学影像教学演示、科研验证与模态补全等应用场景。

## 目录结构

```text
mri-diffusion-system/
├── BackEnd/                         # Flask 后端 API
│   ├── app.py                       # 主入口，模型加载与推理服务
│   ├── static/uploads/              # 上传的源图像（运行时）
│   ├── static/results/              # 生成的 T2 结果（运行时）
│   └── logs/                        # 推理耗时指标日志（运行时）
├── FrontEnd/mri-diffusion-system    # React + TypeScript 前端
│   ├── src/
│   │   ├── LandingApp.tsx           # Landing 页主组件
│   │   ├── components/              # Landing 组件（Hero/Features/Guide 等）
│   │   ├── components/demo/         # Demo 工作台组件
│   │   ├── services/demoApi.ts      # API 封装层
│   │   ├── types/demo.ts            # 类型定义
│   │   ├── constants/               # 路由与站点配置
│   │   └── hooks/                   # 自定义 Hook
│   └── dist/                        # 生产构建产物
├── SelfRDB/                         # SelfRDB 扩散模型
│   ├── main.py                      # BridgeRunner (LightningModule)
│   ├── diffusion.py                 # DiffusionBridge 扩散调度器
│   ├── backbones/ncsnpp.py          # NCSN++ 生成器
│   ├── backbones/discriminator.py   # 判别器（仅训练使用）
│   └── config.yaml                  # 模型超参数
├── brats_t1_t2/                     # 模型 checkpoint（需自行放置）
├── t1_selected_40/                  # 示例 T1 切片（.npy 格式）
├── scripts/                         # 辅助脚本
│   ├── start_backend.sh             # 后端快速启动
│   ├── run_quality_eval.py          # 生成质量评估工具
│   └── reports/                     # 历史评估报告
├── deploy.sh                        # 一键部署脚本
├── gunicorn_config.py               # 生产 WSGI 配置
├── nginx.conf                       # Nginx 反代配置
├── mri-diffusion.service            # systemd 服务单元
├── requirements.txt                 # CPU Python 依赖
├── requirements-gpu.txt             # GPU Python 依赖 (CUDA 11.8)
└── CLAUDE.md                        # 代码库指南
```

## 硬件要求

| 场景 | vCPU | 内存 | GPU | 磁盘 | 单次推理耗时 |
|------|------|------|-----|------|-------------|
| GPU 推理 | 4 | 8 GiB | 1× NVIDIA A10/T4 | 20 GiB | ~2-5 秒 |
| **CPU 推理（低配）** | **2** | **4 GiB** | 无 | **20 GiB** | **~50-90 秒** |
| CPU 推理（推荐） | 8 | 16 GiB | 无 | 20 GiB | 1-3 分钟 |

> CPU 推理使用 PyTorch 2.0.1，模型 NCSN++ 256×256，10 步扩散 × 2 次递归 = 20 次正向传播。

## 快速部署（CPU / 2vCPU 4GiB）

### 1) 系统依赖

```bash
sudo apt update && sudo apt install -y git curl build-essential \
  python3.10 python3.10-venv python3.10-dev \
  libgl1 libglib2.0-0 libsm6 libxext6 libxrender1 \
  libopenblas-dev libomp-dev nginx

# Node.js 20+（前端构建）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2) Swap 与内核参数（低配服务器必需）

```bash
# 4 GiB swap 作为 OOM 安全网
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# mmap 相关内核参数
sudo sysctl -w vm.max_map_count=262144
echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
```

### 3) Python 虚拟环境与依赖

```bash
cd mri-diffusion-system
python3.10 -m venv .venv && source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install gunicorn
```

### 4) 放置模型 Checkpoint

```bash
mkdir -p brats_t1_t2
cp /path/to/model.ckpt brats_t1_t2/brats_t1_t2.ckpt
```

### 5) 配置环境变量

```bash
cat > .env << 'EOF'
SELFRDB_FORCE_CPU=1
OMP_NUM_THREADS=2
TORCH_THREADS=2
MKL_NUM_THREADS=2
OPENBLAS_NUM_THREADS=2
OMP_WAIT_POLICY=PASSIVE
CUDA_VISIBLE_DEVICES=""
SELFRDB_CONFIG=/root/Project/mri-diffusion-system/SelfRDB/config.yaml
SELFRDB_CHECKPOINT=/root/Project/mri-diffusion-system/brats_t1_t2/brats_t1_t2.ckpt
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=0
GUNICORN_WORKERS=1
GUNICORN_TIMEOUT=900
EOF
```

### 6) 后端部署（Systemd）

```bash
# 安装 systemd 服务
sudo cp mri-diffusion.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now mri-diffusion

# 查看启动日志
sudo journalctl -u mri-diffusion -f
```

### 7) 前端构建与 Nginx 配置

```bash
# 构建
cd FrontEnd/mri-diffusion-system
NODE_OPTIONS="--max-old-space-size=512" npm install
echo "" > .env.production   # 同源部署，空 API URL
NODE_OPTIONS="--max-old-space-size=512" npm run build

# 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/mri-diffusion
sudo ln -sf /etc/nginx/sites-available/mri-diffusion /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 8) 开放端口（阿里云安全组）

在 ECS 控制台安全组中添加入方向规则：TCP **80** (HTTP) 和 **443** (HTTPS，可选)。

### 9) 验证部署

```bash
# 健康检查
curl http://127.0.0.1/api/health
# {"ok":true,"selfrdb_ready":true,"device":"cpu","image_size":256,...}

# 推理测试（普通图片）
curl -X POST -F "image=@test.png" http://127.0.0.1:5000/api/generate

# 推理测试（.npy 切片）
curl -X POST -F "image=@t1_selected_40/slice_1845.npy" http://127.0.0.1:5000/api/generate

# 公网访问
curl http://<公网IP>/api/health
```

浏览器访问 `http://<公网IP>` 即可使用完整前端（Landing 页 + Demo 工作台）。

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查，返回模型状态与设备信息 |
| POST | `/api/generate` | 图片生成（multipart/form-data，字段名 `image`），支持 PNG/JPG/NPY |

### 响应示例

```json
{
  "request_id": "uuid",
  "success": true,
  "result_url": "/static/results/uuid.png",
  "message": "Generated by SelfRDB diffusion bridge",
  "timing": {
    "preprocess_ms": 127.18,
    "model_infer_ms": 83794.27,
    "postprocess_ms": 0.39,
    "save_output_ms": 2.05,
    "inference_total_ms": 83923.90,
    "save_input_ms": 1.15,
    "request_total_ms": 84082.60
  }
}
```

## 常用管理命令

```bash
# 服务管理
sudo systemctl status mri-diffusion      # 查看状态
sudo systemctl restart mri-diffusion     # 重启
sudo journalctl -u mri-diffusion -f      # 查看日志

# Nginx
sudo nginx -t                            # 测试配置
sudo systemctl reload nginx              # 重载

# 内存监控
free -h                                  # 内存/swap 概览
ps aux --sort=-%mem | head -5            # 进程内存排序
sudo dmesg | grep -i oom                 # OOM 事件查询
```

## 镜像效果评估

项目包含生成质量评估工具，可批量测试 T1→T2 转换的保真度：

```bash
python scripts/run_quality_eval.py --t1-dir t1_selected_40 --output-dir results/
```

评估指标包括 MSE、PSNR、SSIM 以及 CSF/WM 对比度反转验证。

## 关键优化说明

当前分支 (`fix/deployment-cpu-support`) 针对低配 CPU 服务器做了以下关键调整：

- **判别器删除**：加载后立即释放判别器，节省约数百 MB 内存
- **推理锁**：拒绝并发请求返回 HTTP 503，防止 OOM
- **超时调整**：Gunicorn/Nginx/Axios 超时均设为 900s，适配慢速 CPU
- **线程限制**：OpenMP/MKL/Torch 线程数限制为 2，匹配 vCPU 数量
- **OOMScoreAdjust=-500**：降低被 OOM killer 选中概率
