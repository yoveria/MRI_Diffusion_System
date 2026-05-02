#!/usr/bin/env python
import argparse
import json
import mimetypes
import os
import time
import urllib.error
import urllib.request
import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional, Tuple

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff", ".webp"}
NPY_EXTENSION = ".npy"


@dataclass
class HttpResponse:
    status_code: int
    headers: Dict[str, str]
    body: bytes

    def text(self) -> str:
        return self.body.decode("utf-8", errors="replace")

    def json(self) -> Dict:
        return json.loads(self.text())


def _ms(seconds: float) -> float:
    return round(seconds * 1000.0, 3)


def _pct(num: int, den: int) -> float:
    if den <= 0:
        return 0.0
    return round((num / den) * 100.0, 2)


def _safe_mean(values: List[float]) -> Optional[float]:
    if not values:
        return None
    return round(float(sum(values) / len(values)), 3)


def _safe_percentile(values: List[float], p: float) -> Optional[float]:
    if not values:
        return None
    if p <= 0:
        return round(float(min(values)), 3)
    if p >= 100:
        return round(float(max(values)), 3)

    sorted_values = sorted(float(v) for v in values)
    rank = (len(sorted_values) - 1) * (p / 100.0)
    low_idx = int(rank)
    high_idx = min(low_idx + 1, len(sorted_values) - 1)
    weight = rank - low_idx
    interpolated = sorted_values[low_idx] * (1.0 - weight) + sorted_values[high_idx] * weight
    return round(float(interpolated), 3)


def _build_upload_payload(case_path: str) -> Tuple[str, bytes, str]:
    ext = os.path.splitext(case_path)[1].lower()
    if ext == NPY_EXTENSION:
        with open(case_path, "rb") as f:
            return os.path.basename(case_path), f.read(), "application/x-npy"

    with open(case_path, "rb") as f:
        raw = f.read()
    mime = mimetypes.guess_type(case_path)[0] or "application/octet-stream"
    return os.path.basename(case_path), raw, mime


def _build_multipart_body(
    files: Optional[List[Tuple[str, str, bytes, str]]] = None,
    fields: Optional[List[Tuple[str, str]]] = None,
) -> Tuple[bytes, str]:
    boundary = f"----CodexBoundary{uuid.uuid4().hex}"
    chunks: List[bytes] = []
    crlf = b"\r\n"

    if fields:
        for key, value in fields:
            chunks.append(f"--{boundary}".encode("utf-8"))
            chunks.append(f'Content-Disposition: form-data; name="{key}"'.encode("utf-8"))
            chunks.append(b"")
            chunks.append(value.encode("utf-8"))

    if files:
        for field_name, filename, content, content_type in files:
            chunks.append(f"--{boundary}".encode("utf-8"))
            chunks.append(
                f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"'.encode("utf-8")
            )
            chunks.append(f"Content-Type: {content_type}".encode("utf-8"))
            chunks.append(b"")
            chunks.append(content)

    chunks.append(f"--{boundary}--".encode("utf-8"))
    chunks.append(b"")
    body = crlf.join(chunks)
    content_type = f"multipart/form-data; boundary={boundary}"
    return body, content_type


def _request(
    method: str,
    url: str,
    timeout_s: float,
    body: Optional[bytes] = None,
    headers: Optional[Dict[str, str]] = None,
) -> HttpResponse:
    req = urllib.request.Request(url=url, method=method)
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    data = body
    try:
        with urllib.request.urlopen(req, data=data, timeout=timeout_s) as resp:
            return HttpResponse(
                status_code=int(resp.status),
                headers={k.lower(): v for k, v in dict(resp.headers).items()},
                body=resp.read(),
            )
    except urllib.error.HTTPError as err:
        return HttpResponse(
            status_code=int(err.code),
            headers={k.lower(): v for k, v in dict(err.headers).items()},
            body=err.read() if err.fp else b"",
        )


def http_get(url: str, timeout_s: float) -> HttpResponse:
    return _request(method="GET", url=url, timeout_s=timeout_s)


def http_post_multipart(
    url: str,
    timeout_s: float,
    files: Optional[List[Tuple[str, str, bytes, str]]] = None,
    fields: Optional[List[Tuple[str, str]]] = None,
) -> HttpResponse:
    body, content_type = _build_multipart_body(files=files, fields=fields)
    return _request(
        method="POST",
        url=url,
        timeout_s=timeout_s,
        body=body,
        headers={"Content-Type": content_type, "Content-Length": str(len(body))},
    )


def _collect_case_files(dataset_dir: str) -> List[str]:
    if not os.path.isdir(dataset_dir):
        raise FileNotFoundError(f"Dataset dir not found: {dataset_dir}")

    files: List[str] = []
    for name in sorted(os.listdir(dataset_dir)):
        path = os.path.join(dataset_dir, name)
        if not os.path.isfile(path):
            continue
        ext = os.path.splitext(name)[1].lower()
        if ext in IMAGE_EXTENSIONS or ext == NPY_EXTENSION:
            files.append(path)
    if not files:
        raise RuntimeError(f"No supported files in dataset dir: {dataset_dir}")
    return files


def _is_health_ok(payload: Dict) -> bool:
    return bool(payload.get("ok")) and bool(payload.get("selfrdb_ready"))


def run_functional_tests(
    base_url: str,
    sample_case_path: str,
    timeout_s: float,
) -> Dict:
    tests: List[Dict] = []

    def record(name: str, passed: bool, detail: str) -> None:
        tests.append({"name": name, "passed": passed, "detail": detail})

    # 1) /api/health returns 200 and ready.
    try:
        resp = http_get(f"{base_url}/api/health", timeout_s=timeout_s)
        if resp.status_code == 200:
            payload = resp.json()
            record("health_ready", _is_health_ok(payload), f"status={resp.status_code}, payload_ok={payload.get('ok')}")
        else:
            record("health_ready", False, f"status={resp.status_code}")
    except Exception as exc:  # pylint: disable=broad-except
        record("health_ready", False, f"error={exc}")

    # 2) /api/health includes required fields.
    try:
        resp = http_get(f"{base_url}/api/health", timeout_s=timeout_s)
        payload = resp.json() if resp.status_code == 200 else {}
        required = {"ok", "selfrdb_ready", "device", "image_size"}
        missing = sorted(list(required - set(payload.keys())))
        record("health_required_fields", len(missing) == 0, f"missing={missing}")
    except Exception as exc:  # pylint: disable=broad-except
        record("health_required_fields", False, f"error={exc}")

    # 3) POST /api/generate with missing file.
    try:
        resp = http_post_multipart(f"{base_url}/api/generate", timeout_s=timeout_s)
        record("generate_missing_file", resp.status_code == 400, f"status={resp.status_code}")
    except Exception as exc:  # pylint: disable=broad-except
        record("generate_missing_file", False, f"error={exc}")

    # 4) POST /api/generate with invalid file.
    try:
        files = [("image", "invalid.txt", b"not-an-image", "text/plain")]
        resp = http_post_multipart(f"{base_url}/api/generate", files=files, timeout_s=timeout_s)
        record("generate_invalid_file", resp.status_code >= 400, f"status={resp.status_code}")
    except Exception as exc:  # pylint: disable=broad-except
        record("generate_invalid_file", False, f"error={exc}")

    # 5) GET /api/generate should not be accepted.
    try:
        resp = http_get(f"{base_url}/api/generate", timeout_s=timeout_s)
        record("generate_method_guard", resp.status_code in (400, 405), f"status={resp.status_code}")
    except Exception as exc:  # pylint: disable=broad-except
        record("generate_method_guard", False, f"error={exc}")

    # 6) Valid generation should succeed.
    result_url: Optional[str] = None
    try:
        upload_name, upload_bytes, upload_type = _build_upload_payload(sample_case_path)
        files = [("image", upload_name, upload_bytes, upload_type)]
        resp = http_post_multipart(f"{base_url}/api/generate", files=files, timeout_s=timeout_s)
        payload = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
        ok = resp.status_code == 200 and bool(payload.get("success")) and bool(payload.get("result_url"))
        if ok:
            result_url = str(payload["result_url"])
        record("generate_valid_case", ok, f"status={resp.status_code}")
    except Exception as exc:  # pylint: disable=broad-except
        record("generate_valid_case", False, f"error={exc}")

    # 7) Generated result URL should be downloadable.
    if result_url:
        try:
            resp = http_get(result_url, timeout_s=timeout_s)
            content_type = resp.headers.get("content-type", "")
            ok = resp.status_code == 200 and ("image" in content_type or len(resp.body) > 0)
            record("result_url_accessible", ok, f"status={resp.status_code}, content_type={content_type}")
        except Exception as exc:  # pylint: disable=broad-except
            record("result_url_accessible", False, f"error={exc}")
    else:
        record("result_url_accessible", False, "skipped because generate_valid_case failed")

    passed = sum(1 for t in tests if t["passed"])
    total = len(tests)
    return {
        "cases": tests,
        "summary": {
            "passed": passed,
            "total": total,
            "pass_rate_pct": _pct(passed, total),
        },
    }


def run_interface_status_checks(
    base_url: str,
    probes: int,
    interval_s: float,
    timeout_s: float,
    degraded_threshold_ms: float,
) -> Dict:
    records: List[Dict] = []
    for i in range(probes):
        start = time.perf_counter()
        status = "down"
        http_status = None
        detail = ""
        try:
            resp = http_get(f"{base_url}/api/health", timeout_s=timeout_s)
            http_status = resp.status_code
            latency_ms = _ms(time.perf_counter() - start)
            if resp.status_code != 200:
                status = "down"
                detail = f"http_status={resp.status_code}"
            else:
                payload = resp.json()
                if not _is_health_ok(payload) or latency_ms > degraded_threshold_ms:
                    status = "degraded"
                    detail = f"ok={payload.get('ok')}, latency_ms={latency_ms}"
                else:
                    status = "up"
                    detail = f"latency_ms={latency_ms}"
        except Exception as exc:  # pylint: disable=broad-except
            latency_ms = _ms(time.perf_counter() - start)
            status = "down"
            detail = str(exc)

        records.append(
            {
                "probe_index": i + 1,
                "status": status,
                "http_status": http_status,
                "latency_ms": latency_ms,
                "detail": detail,
            }
        )
        if i < probes - 1 and interval_s > 0:
            time.sleep(interval_s)

    up = sum(1 for r in records if r["status"] == "up")
    degraded = sum(1 for r in records if r["status"] == "degraded")
    down = sum(1 for r in records if r["status"] == "down")
    success_latencies = [r["latency_ms"] for r in records if r["status"] in ("up", "degraded")]

    return {
        "probes": records,
        "summary": {
            "total": len(records),
            "up": up,
            "degraded": degraded,
            "down": down,
            "availability_up_pct": _pct(up, len(records)),
            "availability_non_down_pct": _pct(up + degraded, len(records)),
            "avg_latency_ms": _safe_mean(success_latencies),
            "p95_latency_ms": _safe_percentile(success_latencies, 95),
            "degraded_threshold_ms": degraded_threshold_ms,
        },
    }


def run_generation_benchmark(
    base_url: str,
    case_paths: List[str],
    timeout_s: float,
    verify_result_url: bool,
) -> Dict:
    total = len(case_paths)
    success = 0
    failures: List[Dict] = []

    e2e_ms_list: List[float] = []
    backend_request_ms_list: List[float] = []
    backend_infer_total_ms_list: List[float] = []
    backend_model_infer_ms_list: List[float] = []

    for idx, case_path in enumerate(case_paths, start=1):
        case_name = os.path.basename(case_path)
        try:
            upload_name, upload_bytes, upload_type = _build_upload_payload(case_path)
            req_start = time.perf_counter()
            resp = http_post_multipart(
                url=f"{base_url}/api/generate",
                files=[("image", upload_name, upload_bytes, upload_type)],
                timeout_s=timeout_s,
            )
            e2e_ms = _ms(time.perf_counter() - req_start)

            if resp.status_code != 200:
                failures.append({"index": idx, "case": case_name, "reason": f"http_status={resp.status_code}"})
                continue

            payload = resp.json()
            if not payload.get("success") or not payload.get("result_url"):
                failures.append({"index": idx, "case": case_name, "reason": "invalid_success_payload"})
                continue

            if verify_result_url:
                file_resp = http_get(str(payload["result_url"]), timeout_s=timeout_s)
                if file_resp.status_code != 200:
                    failures.append({"index": idx, "case": case_name, "reason": f"result_url_status={file_resp.status_code}"})
                    continue

            success += 1
            e2e_ms_list.append(e2e_ms)

            timing = payload.get("timing") or {}
            req_ms = timing.get("request_total_ms")
            infer_total_ms = timing.get("inference_total_ms")
            model_ms = timing.get("model_infer_ms")

            if isinstance(req_ms, (int, float)):
                backend_request_ms_list.append(float(req_ms))
            if isinstance(infer_total_ms, (int, float)):
                backend_infer_total_ms_list.append(float(infer_total_ms))
            if isinstance(model_ms, (int, float)):
                backend_model_infer_ms_list.append(float(model_ms))
        except Exception as exc:  # pylint: disable=broad-except
            failures.append({"index": idx, "case": case_name, "reason": str(exc)})

    return {
        "summary": {
            "total_cases": total,
            "success_cases": success,
            "failed_cases": total - success,
            "success_rate_pct": _pct(success, total),
            "avg_e2e_return_ms": _safe_mean(e2e_ms_list),
            "p50_e2e_return_ms": _safe_percentile(e2e_ms_list, 50),
            "p95_e2e_return_ms": _safe_percentile(e2e_ms_list, 95),
            "avg_backend_request_total_ms": _safe_mean(backend_request_ms_list),
            "avg_backend_inference_total_ms": _safe_mean(backend_infer_total_ms_list),
            "avg_backend_model_infer_ms": _safe_mean(backend_model_infer_ms_list),
        },
        "failures": failures[:20],
    }


def _to_markdown(report: Dict) -> str:
    fn = report["functional"]["summary"]
    hs = report["interface_status"]["summary"]
    gb = report["generation"]["summary"]

    lines = [
        "# MRI Diffusion System Quality Report",
        "",
        f"- Time: {report['meta']['run_time']}",
        f"- Base URL: {report['meta']['base_url']}",
        f"- Dataset: {report['meta']['dataset_dir']}",
        "",
        "## 1) 功能测试通过率",
        f"- Passed: {fn['passed']}/{fn['total']}",
        f"- Pass Rate: {fn['pass_rate_pct']}%",
        "",
        "## 2) 接口状态",
        f"- Probe Count: {hs['total']}",
        f"- Up/Degraded/Down: {hs['up']}/{hs['degraded']}/{hs['down']}",
        f"- Availability (UP): {hs['availability_up_pct']}%",
        f"- Availability (Non-DOWN): {hs['availability_non_down_pct']}%",
        f"- Avg Latency: {hs['avg_latency_ms']} ms",
        f"- P95 Latency: {hs['p95_latency_ms']} ms",
        "",
        "## 3) 生成成功率",
        f"- Success Cases: {gb['success_cases']}/{gb['total_cases']}",
        f"- Success Rate: {gb['success_rate_pct']}%",
        "",
        "## 4) 平均推理耗时（后端）",
        f"- Avg Backend Inference Total: {gb['avg_backend_inference_total_ms']} ms",
        f"- Avg Backend Model Inference: {gb['avg_backend_model_infer_ms']} ms",
        "",
        "## 5) 端到端返回耗时",
        f"- Avg E2E Return: {gb['avg_e2e_return_ms']} ms",
        f"- P50 E2E Return: {gb['p50_e2e_return_ms']} ms",
        f"- P95 E2E Return: {gb['p95_e2e_return_ms']} ms",
    ]
    return "\n".join(lines) + "\n"


def main() -> None:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    default_dataset = os.path.join(repo_root, "t1_selected_40")
    default_output_dir = os.path.join(repo_root, "scripts", "reports")

    parser = argparse.ArgumentParser(description="Evaluate MRI diffusion service quality metrics.")
    parser.add_argument("--base-url", default="http://127.0.0.1:5000", help="Service base URL.")
    parser.add_argument("--dataset-dir", default=default_dataset, help="Dataset directory.")
    parser.add_argument("--output-dir", default=default_output_dir, help="Output report directory.")
    parser.add_argument("--request-timeout", type=float, default=180.0, help="HTTP timeout (seconds).")
    parser.add_argument("--health-probes", type=int, default=12, help="Number of health probes.")
    parser.add_argument("--health-interval", type=float, default=2.0, help="Interval between health probes (seconds).")
    parser.add_argument("--degraded-threshold-ms", type=float, default=1000.0, help="Health latency threshold for DEGRADED.")
    parser.add_argument("--verify-result-url", action="store_true", help="Verify each result_url is downloadable.")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    case_paths = _collect_case_files(args.dataset_dir)
    sample_case_path = case_paths[0]

    started_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    run_start = time.perf_counter()

    functional = run_functional_tests(
        base_url=args.base_url.rstrip("/"),
        sample_case_path=sample_case_path,
        timeout_s=args.request_timeout,
    )
    interface_status = run_interface_status_checks(
        base_url=args.base_url.rstrip("/"),
        probes=args.health_probes,
        interval_s=args.health_interval,
        timeout_s=args.request_timeout,
        degraded_threshold_ms=args.degraded_threshold_ms,
    )
    generation = run_generation_benchmark(
        base_url=args.base_url.rstrip("/"),
        case_paths=case_paths,
        timeout_s=args.request_timeout,
        verify_result_url=args.verify_result_url,
    )

    report = {
        "meta": {
            "run_time": started_at,
            "elapsed_ms": _ms(time.perf_counter() - run_start),
            "base_url": args.base_url.rstrip("/"),
            "dataset_dir": os.path.abspath(args.dataset_dir),
            "case_count": len(case_paths),
        },
        "functional": functional,
        "interface_status": interface_status,
        "generation": generation,
    }

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_path = os.path.join(args.output_dir, f"quality_report_{timestamp}.json")
    md_path = os.path.join(args.output_dir, f"quality_report_{timestamp}.md")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(_to_markdown(report))

    print(f"[DONE] report_json={json_path}")
    print(f"[DONE] report_md={md_path}")
    print(f"[SUMMARY] functional_pass_rate={functional['summary']['pass_rate_pct']}%")
    print(f"[SUMMARY] generation_success_rate={generation['summary']['success_rate_pct']}%")
    print(f"[SUMMARY] avg_model_infer_ms={generation['summary']['avg_backend_model_infer_ms']}")
    print(f"[SUMMARY] avg_e2e_return_ms={generation['summary']['avg_e2e_return_ms']}")


if __name__ == "__main__":
    main()
