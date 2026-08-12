#!/usr/bin/env python3
"""NFC 贴片网址批量生成 · lilwukong《五百个冬天》（静态方案）

为每一张实体专辑的 NFC 贴片生成带独立编号的写入网址。
网址不含任何密钥，可以放心交给贴片卖家代写。

用法（在本项目根目录执行）：
    python tools/generate_tags.py              # 默认 500 张
    python tools/generate_tags.py 300          # 发行 300 张
    python tools/generate_tags.py 500 https://你的域名/lilwukong-500-winters/

输出：
    tags/nfc-urls.txt   一行一个写入网址，第 1 行 = No. 0001，依次类推
"""

import sys
from pathlib import Path

DEFAULT_COUNT = 500
DEFAULT_BASE_URL = "https://nohmorejpills-ux.github.io/lilwukong-500-winters/"


def main() -> None:
    count = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_COUNT
    base_url = (sys.argv[2] if len(sys.argv) > 2 else DEFAULT_BASE_URL).strip()
    if not base_url.endswith("/"):
        base_url += "/"

    root = Path(__file__).resolve().parent.parent
    out_dir = root / "tags"
    out_dir.mkdir(exist_ok=True)
    urls_path = out_dir / "nfc-urls.txt"

    with urls_path.open("w", encoding="utf-8") as f:
        for album_no in range(1, count + 1):
            f.write(f"{base_url}?nfc=official&no={album_no:04d}\n")

    sample = f"{base_url}?nfc=official&no=0001"
    print(f"已生成 {count} 条贴片网址：{urls_path}")
    print(f"示例：{sample}（约 {len(sample)} 字节，NTAG213 的 144 字节容量可写）")
    print("第 1 行 = No. 0001，写贴片时按行号与专辑编号一一对应")


if __name__ == "__main__":
    main()
