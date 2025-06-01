import json
from scholarly import scholarly

# Replace with your actual Google Scholar ID
scholar_id = "https://scholar.google.com/citations?user=_i8vIAEAAAAJ&hl=en"

# Retrieve the author's profile
author = scholarly.search_author_id(scholar_id)
author = scholarly.fill(author, sections=["publications"])

# Extract publication details
publications = []
for pub in author.get("publications", []):
    pub_filled = scholarly.fill(pub)
    bib = pub_filled.get("bib", {})
    publications.append({
        "title": bib.get("title"),
        "authors": bib.get("author"),
        "year": bib.get("pub_year"),
        "journal": bib.get("venue"),
        "volume": bib.get("volume"),
        "issue": bib.get("issue"),
        "pages": bib.get("pages"),
        "abstract": bib.get("abstract"),
        "url": pub_filled.get("pub_url")
    })

# Save to JSON file
with open("publications.json", "w", encoding="utf-8") as f:
    json.dump(publications, f, ensure_ascii=False, indent=4)
