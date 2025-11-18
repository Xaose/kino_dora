import sys
from pathlib import Path
from ftfy import fix_encoding


def fix_file(path: Path):
    text = path.read_text(encoding="utf-8")
    fixed = fix_encoding(text)
    if fixed != text:
        path.write_text(fixed, encoding="utf-8")
        print(f"Fixed encoding in {path}")


def process_path(path: Path):
    if path.is_dir():
        for sub in path.rglob("*"):
            if sub.is_file() and sub.suffix in {".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".md"}:
                fix_file(sub)
    else:
        fix_file(path)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/fix_encoding.py <file> [<file> ...]")
        sys.exit(1)

    for arg in sys.argv[1:]:
        process_path(Path(arg))

