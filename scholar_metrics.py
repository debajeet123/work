from scholarly import scholarly
import json

SCHOLAR_ID = "_i8vIAEAAAAJ"   # Debajeet Barman

def fetch_scholar_metrics():
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

if __name__ == "__main__":
    fetch_scholar_metrics()
