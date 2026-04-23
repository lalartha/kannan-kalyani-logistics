"""
Kannan Kalyani - Local Dev Server
Run: python serve.py  OR  npm run dev
Then open: http://localhost:3000
"""
import http.server
import socketserver
import webbrowser
import os
import sys

# Fix Windows encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

PORT = 3001
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, format, *args):
        status = args[1] if len(args) > 1 else '?'
        if status not in ('304', '200'):
            print(f"  [{status}] {self.path}")

print("=" * 50)
print("  KANNAN KALYANI - Dev Server")
print("=" * 50)
print(f"  URL:  http://localhost:{PORT}")
print(f"  Dir:  {DIRECTORY}")
print("  Press Ctrl+C to stop")
print()

webbrowser.open(f"http://localhost:{PORT}")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
