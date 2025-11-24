from scholarly import scholarly
import json, time, sys

SCHOLAR_ID = "_i8vIAEAAAAJ"

def fetch_scholar_metrics():
    print("== scholar_metrics.py starting ==", flush=True)
    print("Using direct connection (no proxy).", flush=True)

    last_err = None

    for attempt in range(1, 6):
        try:
            print(f"[Attempt {attempt}] Searching for author...", flush=True)
            author = scholarly.search_author_id(SCHOLAR_ID)

            print(f"[Attempt {attempt}] Filling author indices...", flush=True)
            author = scholarly.fill(author, sections=["indices"])

            metrics = {
                "citations": str(author.get("citedby", "0")),
                "h_index": str(author.get("hindex", "0")),
                "i10_index": str(author.get("i10index", "0"))
            }

            with open("rg_stats.json", "w") as f:
                json.dump(metrics, f, indent=2)

            print("✔ Updated metrics:", metrics, flush=True)
            print("== scholar_metrics.py finished OK ==", flush=True)
            return

        except Exception as e:
            print(f"[Attempt {attempt}] ERROR: {e}", flush=True)
            last_err = e
            time.sleep(5)

    print("FATAL: Could not fetch Google Scholar metrics.", flush=True)
    print("Last error:", last_err, flush=True)
    sys.exit(1)


if __name__ == "__main__":
    fetch_scholar_metrics()
