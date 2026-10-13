# Local preview server that tells the browser never to keep old copies,
# so every refresh shows the latest files.
import http.server, functools

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

http.server.ThreadingHTTPServer(("", 8080), NoCache).serve_forever()
