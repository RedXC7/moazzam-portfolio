import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.generativeai import GenerativeModel, configure
from pydantic import BaseModel


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is not set")

configure(api_key=GOOGLE_API_KEY)

SYSTEM_PROMPT = """
You are Muhammad Moazzam's portfolio assistant.

Your job is to answer naturally and helpfully about:
- videography
- photography
- video and photo editing
- digital marketing
- agentic AI development
- booking process
- pricing approach
- location availability
- portfolio background

Important rules:
- Be concise, direct, and professional.
- Do not invent unavailable portfolio work, clients, pricing numbers, or guarantees.
- If something depends on project scope, say that clearly.
- For booking, quotations, or serious inquiries, direct the user to: muhammad.moazzam635@gmail.com
- Physical videography and photography availability is currently in Karachi, Pakistan.
- Remote planning, editing, consultation, and AI-related discussions can still be handled remotely.
- If the user asks something unrelated to Muhammad Moazzam's services or background, still answer helpfully as a general AI assistant, but keep the tone professional and do not pretend to have personal real-world experiences.
""".strip()

model = GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=SYSTEM_PROMPT,
)

app = FastAPI(title="Moazzam Portfolio Gemini Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    answer: str


@app.get("/")
async def root():
    return {"message": "Moazzam Portfolio Gemini Assistant API"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        response = model.generate_content(query)
        answer = (response.text or "").strip()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gemini request failed: {exc}") from exc

    if not answer:
        answer = (
            "I could not generate a useful response just now. "
            "Please try again, or email muhammad.moazzam635@gmail.com for project-specific inquiries."
        )

    return QueryResponse(answer=answer)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)