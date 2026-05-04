# 质量评测落地说明

## 你需要准备的材料
- 推理服务：后端 `BackEnd/app.py` 正在运行（默认 `http://127.0.0.1:5000`）。
- 用例集目录：`D:\Desktop\mri-diffusion-system\t1_selected_40`（已支持 `.npy` 自动转 PNG 上传）。

## 目录放置要求
- 用例集目录建议放在仓库根目录下：`t1_selected_40/`
- 评测脚本：`scripts/run_quality_eval.py`
- 报告输出目录：`scripts/reports/`
- 后端请求耗时日志：`BackEnd/logs/generate_metrics.jsonl`

## 执行命令
```powershell
python scripts/run_quality_eval.py --dataset-dir D:\Desktop\mri-diffusion-system\t1_selected_40 --verify-result-url
```

## 输出结果
- `scripts/reports/quality_report_YYYYMMDD_HHMMSS.json`
- `scripts/reports/quality_report_YYYYMMDD_HHMMSS.md`

报告包含 5 个核心指标：
1. 功能测试通过率
2. 接口状态（UP/DEGRADED/DOWN）
3. 生成成功率
4. 平均推理耗时（后端）
5. 端到端返回耗时
