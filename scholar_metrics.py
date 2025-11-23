import json
import time
import sys
from scholarly import scholarly, ProxyGenerator

SCHOLAR_ID = "_i8vIAEAAAAJ"


def fetch_scholar_metrics(max_attempts=5):
    print("== scholar_metrics.py starting ==", flush=True)

    # 1) Proxy setup
    try:
        print("Setting up ProxyGenerator.FreeProxies() ...", flush=True)
        pg = ProxyGenerator()
        if not pg.FreeProxies():
            print("WARNING: FreeProxies() returned False; continuing without proxy.", flush=True)
        else:
            scholarly.use_proxy(pg)
            print("Proxy enabled.", flush=True)
    except Exception as e:
        print(f"ERROR during proxy setup: {e}", flush=True)

    # 2) Try multiple times to get author
    author = None
    last_err = None

    for attempt in range(1, max_attempts + 1):
        try:
            print(f"[Attempt {attempt}] Fetching author by id {SCHOLAR_ID} ...", flush=True)
            author = scholarly.search_author_id(SCHOLAR_ID)
            author = scholarly.fill(author, sections=['indices'])
            print(f"[Attempt {attempt}] Author fetched successfully.", flush=True)
            break
        except Exception as e:
            last_err = e
            print(f"[Attempt {attempt}] ERROR while talking to Scholar: {e}", flush=True)
            time.sleep(5)

    if author is None:
        print("FATAL: Could not fetch author info after retries.", flush=True)
        if last_err:
            print(f"Last error: {last_err}", flush=True)
        # Exit non-zero so you SEE the failure clearly in the logs
        sys.exit(1)

    # 3) Extract metrics
    metrics = {
        "citations": str(author.get("citedby", "0")),
        "h_index": str(author.get("hindex", "0")),
        "i10_index": str(author.get("i10index", "0")),
    }
    print("Extracted metrics:", metrics, flush=True)

    # 4) Write file
    try:
        with open("rg_stats.json", "w") as f:
            json.dump(metrics, f, indent=2)
        print("rg_stats.json written successfully.", flush=True)
    except Exception as e:
        print(f"FATAL: Failed to write rg_stats.json: {e}", flush=True)
        sys.exit(1)

    print("== scholar_metrics.py finished OK ==", flush=True)


if __name__ == "__main__":
    fetch_scholar_metrics()
