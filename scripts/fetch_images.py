from pathlib import Path
import requests

BASE_DIR = Path(__file__).resolve().parents[1]
OUT_AI = BASE_DIR / "api" / "data" / "images" / "ai"
OUT_HUMAN = BASE_DIR / "api" / "data" / "images" / "human"
OUT_AI.mkdir(parents=True, exist_ok=True)
OUT_HUMAN.mkdir(parents=True, exist_ok=True)

AI_URLS_FILE = BASE_DIR / "scripts" / "ai_urls.txt"
HUMAN_URLS_FILE = BASE_DIR / "scripts" / "human_urls.txt"


def download_from_list(url_file: Path, out_dir: Path, prefix: str):
    if not url_file.exists():
        print(f"{url_file} not found, skipping.")
        return
    with url_file.open() as f:
        for idx, line in enumerate(f, start=1):
            url = line.strip()
            if not url:
                continue
            ext = ".jpg"
            if ".png" in url:
                ext = ".png"
            out_path = out_dir / f"{prefix}_{idx:04d}{ext}"
            if out_path.exists():
                print(f"exists, skipping {out_path}")
                continue
            try:
                print(f"downloading {url} -> {out_path}")
                r = requests.get(url, timeout=15)
                r.raise_for_status()
                out_path.write_bytes(r.content)
            except Exception as e:
                print(f"failed {url}: {e}")


if __name__ == "__main__":
    download_from_list(AI_URLS_FILE, OUT_AI, "ai")
    download_from_list(HUMAN_URLS_FILE, OUT_HUMAN, "human")
    print("done.")
