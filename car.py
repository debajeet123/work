#!/usr/bin/env python3
"""
Script to scan a directory of iPhone photos for gas receipts,
extract key information (date, total amount, gas station if possible),
and update a CSV history file with parsed entries.

Dependencies:
    - Python 3.x
    - Pillow (`pip install pillow`)
    - pytesseract (`pip install pytesseract`)
    - Tesseract OCR engine installed on your system:
        * macOS (Homebrew): `brew install tesseract`
        * Ubuntu/Debian: `sudo apt-get install tesseract-ocr`
        * Windows: download installer from https://github.com/tesseract-ocr/tesseract

Usage:
    1. Adjust `PHOTO_DIR` to point to the folder where your iPhone photos are stored.
    2. Adjust `HISTORY_CSV` if you’d like a different path or filename for your history.
    3. Run: `python3 scan_gas_receipts.py`
"""

import os
import re
import csv
from datetime import datetime
from PIL import Image
import pytesseract

# === Configuration ===
# Directory containing iPhone photos (JPEG/PNG etc.)
PHOTO_DIR = "/path/to/iphone/photos"  # <-- Change this to your local directory
# Path to the CSV history file to maintain parsed receipts
HISTORY_CSV = "gas_history.csv"

# Keywords to help identify a gas receipt (case-insensitive)
RECEIPT_KEYWORDS = [
    r"\bgas\b",
    r"\bfuel\b",
    r"\bpump\b",
    r"\bgal\b",        # short for gallon
    r"\btotal\b",
]

# Regex patterns
DATE_PATTERNS = [
    # Matches MM/DD/YYYY or M/D/YYYY or MM/DD/YY
    r"(?P<date>\b(0?[1-9]|1[0-2])/(0?[1-9]|[12]\d|3[01])/(?:\d{2}|\d{4})\b)",
    # Matches Month Day, Year (e.g., January 5, 2025 or Jan 5, 2025)
    r"(?P<date>\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+\d{4}\b)",
]

AMOUNT_PATTERN = r"\$\s*(?P<amount>\d{1,3}(?:,\d{3})*(?:\.\d{2})?)"  # Matches $xx.xx or $x,xxx.xx

# CSV header
CSV_HEADER = ["filename", "date", "amount", "station_name"]


def load_processed_filenames(csv_path):
    """
    Load the set of filenames already processed in the history CSV.
    This prevents reprocessing the same image multiple times.
    """
    processed = set()
    if not os.path.isfile(csv_path):
        return processed

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            processed.add(row["filename"])
    return processed


def append_to_history(csv_path, rows):
    """
    Append parsed rows to the history CSV file.
    Creates the file with header if it doesn't exist.
    Each row should be a dict matching CSV_HEADER.
    """
    file_exists = os.path.isfile(csv_path)
    with open(csv_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADER)
        if not file_exists:
            writer.writeheader()
        for row in rows:
            writer.writerow(row)


def extract_text_from_image(image_path):
    """
    Perform OCR on the image at image_path and return the extracted text.
    """
    try:
        img = Image.open(image_path)
    except Exception as e:
        print(f"[ERROR] Cannot open image {image_path}: {e}")
        return ""

    # You can adjust Tesseract config if needed (e.g., language)
    text = pytesseract.image_to_string(img)
    return text


def find_date(text):
    """
    Search the OCR text for any date matching DATE_PATTERNS.
    Returns the first matched date string, or None if not found.
    """
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return match.group("date")
    return None


def find_amount(text):
    """
    Search the OCR text for a dollar amount matching AMOUNT_PATTERN.
    Returns the first matched amount string (without $ sign), or None if not found.
    """
    match = re.search(AMOUNT_PATTERN, text)
    if match:
        return match.group("amount")
    return None


def looks_like_gas_receipt(text):
    """
    Heuristic: does the OCR text contain at least one gas-related keyword?
    If yes, we treat it as a candidate gas receipt.
    """
    for kw in RECEIPT_KEYWORDS:
        if re.search(kw, text, flags=re.IGNORECASE):
            return True
    return False


def parse_station_name(text):
    """
    Attempt to parse a gas station name from the top lines of the receipt.
    This is heuristic: often station name appears near the top in larger font.
    We'll pick the first line (of the first few) that has at least one uppercase word
    and is longer than 3 characters.
    """
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    # Look at first 5 lines for a plausible station name
    for line in lines[:5]:
        # Skip lines that clearly contain numbers or addresses
        if re.search(r"\d", line):
            continue
        # Heuristic: a line with at least one uppercase word (>=2 letters) and >3 chars
        if re.search(r"\b[A-Z]{2,}\b", line):
            return line
    return ""


def normalize_date_str(date_str):
    """
    Given a date string from the receipt, try to normalize it to YYYY-MM-DD.
    Supports MM/DD/YY(YY) or 'Month D, YYYY' formats.
    """
    date_str = date_str.strip()
    for fmt in ("%m/%d/%Y", "%m/%d/%y", "%B %d, %Y", "%b %d, %Y"):
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    # If parsing fails, return original
    return date_str


def scan_photos_and_update_history(photo_dir, history_csv):
    """
    Main function: scans photo_dir for image files, runs OCR, filters gas receipts,
    extracts date, amount, station_name, and appends entries to history_csv.
    """
    # Load already processed filenames
    processed_files = load_processed_filenames(history_csv)

    new_rows = []
    for root, _, files in os.walk(photo_dir):
        for fname in files:
            if fname.lower().endswith((".jpg", ".jpeg", ".png", ".tiff", ".bmp", ".heic")):
                full_path = os.path.join(root, fname)
                rel_filename = os.path.relpath(full_path, photo_dir)

                if rel_filename in processed_files:
                    continue  # Skip if already processed

                print(f"[INFO] Processing image: {rel_filename}")
                text = extract_text_from_image(full_path)
                if not text.strip():
                    print(f"  [WARN] No text found in {rel_filename}, skipping.")
                    continue

                # Check if it looks like a gas receipt
                if not looks_like_gas_receipt(text):
                    print(f"  [INFO] No gas-related keywords found in {rel_filename}, skipping.")
                    continue

                # Find date and amount
                date_raw = find_date(text)
                amount_raw = find_amount(text)
                if not date_raw or not amount_raw:
                    print(f"  [WARN] Could not find date or amount in {rel_filename}, skipping.")
                    continue

                date_norm = normalize_date_str(date_raw)
                station_name = parse_station_name(text)

                row = {
                    "filename": rel_filename,
                    "date": date_norm,
                    "amount": amount_raw,
                    "station_name": station_name,
                }
                print(f"  [FOUND] Date: {date_norm}, Amount: ${amount_raw}, Station: {station_name}")
                new_rows.append(row)

    if new_rows:
        append_to_history(history_csv, new_rows)
        print(f"[SUCCESS] Appended {len(new_rows)} new entries to {history_csv}")
    else:
        print("[INFO] No new gas receipts found.")


if __name__ == "__main__":
    scan_photos_and_update_history(PHOTO_DIR, HISTORY_CSV)
