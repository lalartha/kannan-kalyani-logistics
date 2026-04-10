import os

out = "index.html"
files = [
    "src/base_top.html",
    "src/icons.jsx",
    "src/ui.jsx",
    "src/data.jsx",
    "src/pages_main.jsx",
    "src/pages_admin_app.jsx",
    "src/pages_logistics.jsx",
    "src/base_bottom.html"
]

with open(out, 'w', encoding='utf-8') as f:
    for file in files:
        with open(file, 'r', encoding='utf-8') as src:
            f.write(src.read() + "\n")

print(f"Built {out} successfully.")
