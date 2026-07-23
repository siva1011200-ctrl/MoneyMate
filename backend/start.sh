#!/bin/bash

# Render deployment start script
# Uses PORT environment variable provided by Render

python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
