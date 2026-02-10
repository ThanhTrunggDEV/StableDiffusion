#!/bin/bash

echo "Starting Stable Diffusion Image Generator..."
echo ""

# Check if virtual environment exists
if [ ! -f "venv/bin/activate" ]; then
    echo "Error: Virtual environment not found"
    echo "Please run setup.sh first"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Start the Flask application
echo "Server starting at http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo ""
python app.py
