import requests
import json

# Test login with the user we just registered
data = {
    "email": "test@example.com",
    "password": "testpass123"
}

try:
    response = requests.post(
        "http://127.0.0.1:8000/users/login",
        json=data,  # Send as JSON
        headers={"Content-Type": "application/json"},
        timeout=5
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
except requests.exceptions.ConnectionError:
    print("❌ Connection Error: Backend not running on http://127.0.0.1:8000")
except Exception as e:
    print(f"Error: {type(e).__name__}: {str(e)}")
