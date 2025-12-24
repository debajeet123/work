import os, json, requests, sys, time

AUTHOR_ID = "_i8vIAEAAAAJ"
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def fetch_metrics():
    if not SERPAPI_KEY:
        sys.exit("ERROR: SERPAPI_KEY not set")

    url = "https://serpapi.com/search"

    for i in range(5):
        try:
            r = requests.get(url, params={
                "engine": "google_scholar_author",
                "author_id": AUTHOR_ID,
                "api_key": SERPAPI_KEY
            }, timeout=30)
            r.raise_for_status()

            t = r.json()["cited_by"]["table"]

            metrics = {
                "h_index": int(t[1]["h_index"]["all"]),
                "citations": int(t[0]["citations"]["all"]),
                "i10_index": int(t[2]["i10_index"]["all"]),
                "updated_at": int(time.time())
            }

            with open("rg_stats.json", "w") as f:
                json.dump(metrics, f, indent=2)

            print("✔ Updated", metrics)
            return

        except Exception as e:
            print(f"Retry {i+1}: {e}")
            time.sleep(5)

    sys.exit("FATAL: Fetch failed")

if __name__ == "__main__":
    fetch_metrics()
