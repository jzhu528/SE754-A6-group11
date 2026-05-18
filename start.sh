#!/bin/bash
echo "Starting Java OOP Quiz..."

# Start backend
cd backend && node server.js &
BACKEND_PID=$!
echo "Backend running at http://localhost:3001 (PID $BACKEND_PID)"

# Start frontend
cd ../frontend && npm run dev &
FRONTEND_PID=$!
echo "Frontend running at http://localhost:3000 (PID $FRONTEND_PID)"

echo ""
echo "Open http://localhost:3000 in your browser."
echo "Press Ctrl+C to stop both servers."

wait
