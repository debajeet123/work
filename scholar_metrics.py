import os
import json
import requests
import sys
import time

AUTHOR_ID = "_i8vIAEAAAAJ"
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def fetch_metrics():
    if not SERPAPI_KEY:
        print("ERROR: SERPAPI_KEY not set.")
        sys.exit(1)

    url = "https://serpapi.com/search"

    for attempt in range(1, 6):
        try:
            print(f"[Attempt {attempt}] Calling SerpAPI...", flush=True)
            params = {
                "engine": "google_scholar_author",
                "author_id": AUTHOR_ID,
                "api_key": SERPAPI_KEY
            }
            r = requests.get(url, params=params, timeout=30)
            r.raise_for_status()
            data = r.json()

            table = data["cited_by"]["table"]
            citations = table[0]["citations"]["all"]
            h_index = table[1]["h_index"]["all"]
            i10_index = table[2]["i10_index"]["all"]

            metrics = {
    "h_index": int(h_index),
    "citations": int(citations),
    "i10_index": int(i10_index),
    "updated_at": int(time.time())
}


            with open("rg_stats.json", "w") as f:
                json.dump(metrics, f, indent=2)

            print("✔ Updated:", metrics)
            return

        except Exception as e:
            print(f"[Attempt {attempt}] ERROR: {e}", flush=True)
            time.sleep(5)

    print("FATAL: Could not fetch metrics.")
    sys.exit(1)

if __name__ == "__main__":
    print("== scholar_metrics.py starting ==")
    fetch_metrics()
    print("== scholar_metrics.py finished ==")
