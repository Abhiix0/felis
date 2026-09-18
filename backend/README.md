# FELIS Backend API

FastAPI asynchronous backend for the FELIS Personal Execution OS.

## Local Setup

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt -r requirements-dev.txt

# Run migrations
alembic upgrade head

# Start API dev server
uvicorn app.main:app --reload --port 8000
```

## Running Tests

```bash
pytest tests/ -v
```
