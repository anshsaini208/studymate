import io
from typing import List, Dict, Any
from pypdf import PdfReader

class PDFExtractionError(Exception):
    pass

def extract_pages_from_pdf(
    file_bytes: bytes,
    filename: str,
    document_id: str
) -> List[Dict[str, Any]]:
    """
    Extracts text page-by-page from PDF bytes.
    Preserves document_id, filename, 1-indexed page number, and text.
    Raises PDFExtractionError if the PDF is corrupt or contains no extractable text.
    """
    if not file_bytes:
        raise PDFExtractionError("Uploaded file is empty.")

    try:
        reader = PdfReader(io.BytesIO(file_bytes))
    except Exception as e:
        raise PDFExtractionError(f"Failed to read PDF file: {str(e)}")

    if not reader.pages:
        raise PDFExtractionError("PDF file contains no pages.")

    pages_data = []
    total_text_length = 0

    for idx, page in enumerate(reader.pages):
        page_num = idx + 1
        try:
            raw_text = page.extract_text() or ""
        except Exception:
            raw_text = ""

        # Normalize whitespace while preserving line structure
        cleaned_text = raw_text.strip()
        total_text_length += len(cleaned_text)

        if cleaned_text:
            pages_data.append({
                "document_id": document_id,
                "filename": filename,
                "page": page_num,
                "text": cleaned_text
            })

    if total_text_length == 0 or not pages_data:
        raise PDFExtractionError(
            "PDF contains no extractable text. Scanned or image-only PDFs without OCR are not supported in MVP."
        )

    return pages_data
