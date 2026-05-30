import requests
import json

try:
    data = {
        "name": "Debug User",
        "email": "debug_unique_123@example.com",
        "password": "password123"
    }
    response = requests.post("http://127.0.0.1:5000/api/auth/register", 
                             json=data, 
                             timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
