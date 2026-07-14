# Debajeet Barman Personal Website

This repository contains the code for a simple personal webpage highlighting the work of **Debajeet Barman**, a geophysicist. The project combines a static HTML page with custom CSS and several Python scripts used to create supporting assets.

## Contents

- `index.html` – main webpage with information, images and navigation tabs
- `globe.css` – stylesheet used by the page
- `publications.json` – list of publications generated from Google Scholar
- Python utilities:
  - `generate_background.py` – create starry background images
  - `pubcreate.py` – fetch publication data from Scholar
  - `3dmodel.py` – experiments in generating 3‑D objects using the `pythonocc` library

Images referenced by the page (e.g. `profile.jpg`, `desert.jpg`) are included in the repo.

## Usage

Open `index.html` directly in a web browser to view the site. The Python scripts are optional helpers:

```bash
python generate_background.py    # writes a background PNG
python pubcreate.py               # updates publications.json
```

The scripts require Python 3 along with the `numpy`, `Pillow`, and `scholarly` packages. `3dmodel.py` additionally needs `pythonocc`.

## License

No specific license is provided; use the code at your own discretion.

