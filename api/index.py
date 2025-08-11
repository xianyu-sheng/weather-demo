from http.server import BaseHTTPRequestHandler
import json, urllib.parse, urllib.request

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        city  = query.get("city", ["beijing"])[0]

        url = f"https://wttr.in/{city}?format=j1"
        try:
            data = urllib.request.urlopen(url, timeout=5).read().decode()
            js   = json.loads(data)
        except Exception as e:
            js = {"error": str(e)}

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(js).encode())