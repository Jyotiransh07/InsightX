import sys
import os

# Add the backend directory to the Python path so all imports resolve correctly
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, backend_dir)

from main import app  # noqa: F401  — Vercel picks up `app` from this module
