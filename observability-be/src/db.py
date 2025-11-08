import os
from clickhouse_connect import get_client
from dotenv import load_dotenv

load_dotenv()

def _get_client():
    """
    Always returns a new ClickHouse client per call.
    This avoids concurrency errors in async servers like FastAPI.
    """
    return get_client(
        host=os.getenv("CLICKHOUSE_HOST", "localhost"),
        port=int(os.getenv("CLICKHOUSE_PORT", 8123)),
        username=os.getenv("CLICKHOUSE_USER", "default"),
        password=os.getenv("CLICKHOUSE_PASSWORD", ""),
        database=os.getenv("CLICKHOUSE_DATABASE", "default"),
    )
