import sys
from pathlib import Path


PREFIX = set("РСÐÑ")
SEPARATORS = set(" \t\r\n.,!?:;\"'()[]{}«»—-")


def decode_segment(segment: str) -> str:
    return segment.encode("cp1251", errors="ignore").decode("utf-8", errors="ignore")


def is_separator(char: str) -> bool:
    return char == "" or char in SEPARATORS


def fix_file(path: Path):
    text = path.read_text(encoding="utf-8")
    chars = []
    i = 0
    length = len(text)

    while i < length:
        ch = text[i]
        if (
            ch in PREFIX
            and i + 1 < length
            and text[i + 1] not in PREFIX
        ):
            j = i + 2
            pair_count = 1
            while (
                j + 1 <= length - 1
                and text[j] in PREFIX
                and text[j + 1] not in PREFIX
            ):
                pair_count += 1
                j += 2

            prev_char = text[i - 1] if i > 0 else ""
            next_char = text[j] if j < length else ""

            if pair_count >= 2 or (is_separator(prev_char) and is_separator(next_char)):
                chars.append(decode_segment(text[i:j]))
                i = j
                continue

        chars.append(ch)
        i += 1

    new_text = "".join(chars)

    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        print(f"Fixed mojibake in {path}")


def process_path(path: Path):
    if path.is_dir():
        for sub in path.rglob("*"):
            if sub.is_file() and sub.suffix in {".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".md"}:
                fix_file(sub)
    elif path.is_file():
        fix_file(path)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/fix_mojibake.py <path> [<path> ...]")
        sys.exit(1)

    for arg in sys.argv[1:]:
        process_path(Path(arg))

