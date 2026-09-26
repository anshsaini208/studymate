from typing import List, Dict, Any
from app.core.config import settings

class RecursiveTextSplitter:
    def __init__(
        self,
        chunk_size: int = settings.CHUNK_SIZE,
        chunk_overlap: int = settings.CHUNK_OVERLAP,
        separators: List[str] = None
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or ["\n\n", "\n", ". ", " ", ""]

    def _split_text(self, text: str, separators: List[str]) -> List[str]:
        final_chunks: List[str] = []
        separator = separators[-1]
        new_separators = []

        for i, _s in enumerate(separators):
            if _s == "":
                separator = _s
                break
            if _s in text:
                separator = _s
                new_separators = separators[i + 1:]
                break

        splits = text.split(separator) if separator else list(text)

        good_splits: List[str] = []
        for s in splits:
            if not s:
                continue
            if len(s) < self.chunk_size:
                good_splits.append(s)
            else:
                if new_separators:
                    other_splits = self._split_text(s, new_separators)
                    good_splits.extend(other_splits)
                else:
                    good_splits.append(s)

        # Merge splits with chunk_overlap
        return self._merge_splits(good_splits, separator)

    def _merge_splits(self, splits: List[str], separator: str) -> List[str]:
        docs: List[str] = []
        current_doc: List[str] = []
        total = 0

        for d in splits:
            _len = len(d)
            sep_len = len(separator) if current_doc else 0
            if total + _len + sep_len > self.chunk_size:
                if total > 0:
                    merged = separator.join(current_doc).strip()
                    if merged:
                        docs.append(merged)
                    
                    # Keep overlap from the end of current_doc
                    while total > self.chunk_overlap and current_doc:
                        popped = current_doc.pop(0)
                        total -= len(popped) + (len(separator) if current_doc else 0)
                
                current_doc.append(d)
                total += _len + (len(separator) if len(current_doc) > 1 else 0)
            else:
                current_doc.append(d)
                total += _len + sep_len

        if current_doc:
            merged = separator.join(current_doc).strip()
            if merged:
                docs.append(merged)

        return docs

    def split_page(self, page_dict: Dict[str, Any]) -> List[Dict[str, Any]]:
        text = page_dict.get("text", "").strip()
        if not text:
            return []

        chunks_text = self._split_text(text, self.separators)
        chunks = []
        for chunk in chunks_text:
            cleaned = chunk.strip()
            if cleaned:
                chunks.append({
                    "document_id": page_dict["document_id"],
                    "filename": page_dict["filename"],
                    "page": page_dict["page"],
                    "content": cleaned
                })
        return chunks

def chunk_pages(
    pages: List[Dict[str, Any]],
    chunk_size: int = settings.CHUNK_SIZE,
    chunk_overlap: int = settings.CHUNK_OVERLAP
) -> List[Dict[str, Any]]:
    """
    Splits page-aware text into chunks preserving page metadata.
    """
    splitter = RecursiveTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    all_chunks = []
    for page in pages:
        chunks = splitter.split_page(page)
        all_chunks.extend(chunks)
    return all_chunks
