from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import time

def start_test_server():
    # Create a simple test server on port 8000
    server_address = ('127.0.0.1', 8000)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Starting test server on {server_address}")
    httpd.serve_forever()

if __name__ == "__main__":
    start_test_server()