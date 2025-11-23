from scholarly import scholarly, ProxyGenerator
import json, time

SCHOLAR_ID = "_i8vIAEAAAAJ"

def fetch_scholar_metrics():
    pg = ProxyGenerator()
    pg.FreeProxies()  # THIS IS THE FIX
    scholarly.use_proxy(pg)

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
            time.sleep(3)

    raise Exception("FAILED: Could not fetch Google Scholar metrics.")


if __name__ == "__main__":
    fetch_scholar_metrics()
