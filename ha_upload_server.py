#!/usr/bin/env python3
"""
Prosty serwer do uploadu wideo na Home Assistant.
Uruchom na serwerze HA: python3 /config/ha_upload_server.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import json
import subprocess

UPLOAD_DIR = "/media/multimedia"
PORT = 8765

class UploadHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body)
            
            filename = data.get('filename', '_DOMYSLNY_.mp4')
            video_data = data.get('data', '')
            
            # Decode base64
            import base64
            video_bytes = base64.b64decode(video_data)
            
            # Save file
            filepath = os.path.join(UPLOAD_DIR, filename)
            with open(filepath, 'wb') as f:
                f.write(video_bytes)
            
            # Restart video (toggle switch)
            subprocess.run(['ha', 'service', 'call', 'switch.turn_off', '--data', '{"entity_id": "switch.video"}'], capture_output=True)
            import time
            time.sleep(1)
            subprocess.run(['ha', 'service', 'call', 'switch.turn_on', '--data', '{"entity_id": "switch.video"}'], capture_output=True)
            
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'path': filepath}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

if __name__ == '__main__':
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    server = HTTPServer(('0.0.0.0', PORT), UploadHandler)
    print(f"Upload server running on port {PORT}")
    server.serve_forever()

