from langfuse import Langfuse
from app.config import settings
from functools import lru_cache
from typing import Optional


@lru_cache()
def get_langfuse_client() -> Optional[Langfuse]:
    """
    Get or create Langfuse client singleton.
    Uses lru_cache to ensure only one instance is created.
    Returns None if credentials are not configured.
    """
    # Check if credentials are configured
    if not settings.langfuse_public_key or not settings.langfuse_secret_key:
        print("Warning: Langfuse credentials not configured. Using mock data.")
        return None
    
    try:
        return Langfuse(
            public_key=settings.langfuse_public_key,
            secret_key=settings.langfuse_secret_key,
            host=settings.langfuse_host,
        )
    except Exception as e:
        print(f"Error initializing Langfuse client: {e}")
        return None


def get_langfuse() -> Optional[Langfuse]:
    """Dependency for FastAPI routes to get Langfuse client."""
    return get_langfuse_client()
