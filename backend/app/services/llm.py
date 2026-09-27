import httpx
from typing import List, Dict, Any, Tuple
from app.core.config import settings
from app.models.schemas import SourceCitation

class LLMServiceError(Exception):
    pass

SYSTEM_PROMPT = """You are StudyMate, a helpful, precise academic study assistant.
Your task is to answer the student's question based strictly and exclusively on the provided Context excerpts from the uploaded document.

Guidelines:
1. Grounding: Rely ONLY on the information present in the Context. Do NOT use outside knowledge or extrapolate facts.
2. Missing Information: If the context does not contain sufficient information to answer the question, or if the question is unrelated to the context, you MUST respond with:
"I couldn't find this information in the uploaded document."
3. Clarity: Structure your answer clearly using clean formatting, bullet points, or code snippets where appropriate.
4. Honesty: Never hallucinate facts, formulas, or page citations.
"""

def format_context_prompt(chunks: List[Dict[str, Any]]) -> str:
    parts = []
    for idx, c in enumerate(chunks, 1):
        page = c.get("page", 1)
        filename = c.get("filename", "document.pdf")
        content = c.get("content", "").strip()
        parts.append(f"--- Excerpt {idx} (File: {filename}, Page: {page}) ---\n{content}")
    return "\n\n".join(parts)

async def generate_grounded_answer(
    question: str,
    chunks: List[Dict[str, Any]]
) -> Tuple[str, List[SourceCitation]]:
    """
    Calls OpenRouter LLM with retrieved context and returns (answer, sources).
    """
    if not chunks:
        return (
            "I couldn't find this information in the uploaded document.",
            []
        )

    if not settings.OPENROUTER_API_KEY:
        raise LLMServiceError(
            "OPENROUTER_API_KEY is not configured. Please set your OpenRouter API key in backend/.env to generate answers."
        )

    context_str = format_context_prompt(chunks)
    user_prompt = f"Context:\n{context_str}\n\nQuestion: {question}\n\nAnswer:"

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY.strip()}",
        "HTTP-Referer": "https://studymate.local",
        "X-Title": "StudyMate",
        "Content-Type": "application/json"
    }

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.1,
        "max_tokens": 1000
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload
            )

        if response.status_code != 200:
            error_detail = response.text
            raise LLMServiceError(f"OpenRouter API error ({response.status_code}): {error_detail}")

        data = response.json()
        choices = data.get("choices", [])
        if not choices:
            raise LLMServiceError("OpenRouter returned no answer choices.")

        answer = choices[0].get("message", {}).get("content", "").strip()

    except httpx.TimeoutException:
        raise LLMServiceError("Request to OpenRouter timed out. Please try again.")
    except httpx.RequestError as e:
        raise LLMServiceError(f"Network error communicating with OpenRouter: {str(e)}")

    # Deduplicate sources and build citations
    sources: List[SourceCitation] = []
    seen = set()
    
    # If the answer explicitly states not found, don't return misleading sources
    if "couldn't find this information" in answer.lower():
        return answer, []

    for c in chunks:
        key = (c.get("filename", ""), c.get("page", 1), c.get("content", "")[:100])
        if key not in seen:
            seen.add(key)
            # Create a clean excerpt (up to 300 chars)
            raw_content = c.get("content", "").strip()
            excerpt = raw_content[:300] + ("..." if len(raw_content) > 300 else "")
            sources.append(
                SourceCitation(
                    filename=c.get("filename", "document.pdf"),
                    page=c.get("page", 1),
                    content=excerpt
                )
            )

    return answer, sources
