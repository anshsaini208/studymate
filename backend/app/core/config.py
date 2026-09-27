import os
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openrouter/free"
    FRONTEND_URL: str = "http://localhost:5173"
    TOP_K: int = 5
    SIMILARITY_THRESHOLD: float = 0.0
    MAX_FILE_SIZE_MB: int = 10
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 150
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"

    @field_validator("OPENROUTER_API_KEY", mode="before")
    @classmethod
    def clean_api_key(cls, v: str) -> str:
        if isinstance(v, str):
            # Strip surrounding quotes and whitespace
            return v.strip().strip('"').strip("'")
        return v

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @classmethod
    def load(cls):
        # If .env file exists locally, BaseSettings will pick it up via model_config.
        # In cloud environments, variables provided in os.environ take standard precedence.
        return cls()

settings = Settings()
