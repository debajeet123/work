from scholarly import scholarly, ProxyGenerator
import json
import time

SCHOLAR_ID = "_i8vIAEAAAAJ"

def fetch_scholar_metrics():
    # Use free rotating proxies
    pg = ProxyGenerator()
    pg.FreeProxies()
    scholarly.use_proxy(pg)

    # Retry up to 5 times to avoid rate limiting
    for attempt in range(5):
        try:
            print(f"Attempt {attempt+1}...")
            author = scholarly.search_author_id(SCHOLAR_ID)
            author = scholarly.fill(author, sections=['indices'])

            metrics = {
                "citations": str(author.get("citedby", "0")),
                "h_index": str(author.get("hindex", "0")),
                "i10_index": str(author.get("i10index", "0"))
            }

            with open("rg_stats.json", "w") as f:
                json.dump(metrics, f, indent=2)

            print("✔ Updated Google Scholar metrics:", metrics)
            return
        except Exception as e:
            print("Error:", e)
            time.sleep(5)

    raise Exception("Failed to fetch metrics after retries.")


if __name__ == "__main__":
    fetch_scholar_metrics()
