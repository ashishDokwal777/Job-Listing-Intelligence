#!/usr/bin/env bash
set -o errexit

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
