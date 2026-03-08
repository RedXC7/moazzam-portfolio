import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Moazzam Portfolio AI Assistant")

# Add CORS middleware
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

FAQ_RESPONSES = [
    {
        "patterns": [
            "what services",
            "services offer",
            "what do you do",
            "what can you do",
            "book you",
            "hire you",
        ],
        "answer": "I offer professional videography, photography, video and photo editing, digital marketing, and agentic AI development. All services are paid. To book or request a quote, email muhammad.moazzam635@gmail.com with your project details.",
    },
    {
        "patterns": [
            "experience",
            "style",
            "portfolio",
            "tell me more about yourself",
            "about you",
        ],
        "answer": "My work combines technical skill, scientific curiosity, and visual storytelling. I manage my own social media presence at @mox.shots, have hands-on filming experience, and use custom AI tools to improve creative workflow and efficiency.",
    },
    {
        "patterns": [
            "videography",
            "photography",
            "shoots",
            "events",
            "portraits",
            "brand content",
        ],
        "answer": "I take on events, portraits, brand content, short cinematic reels, and other visual storytelling projects. I am comfortable on film sets as well as solo shoots, with a focus on strong composition and compelling visuals.",
    },
    {
        "patterns": [
            "travel",
            "location",
            "available for shoots",
            "outside city",
        ],
        "answer": "Yes, I can travel for projects depending on the scope. Email muhammad.moazzam635@gmail.com with the location, type of shoot, and duration so I can quote accurately.",
    },
    {
        "patterns": [
            "edit",
            "raw files",
            "post production",
            "video editing",
            "photo editing",
        ],
        "answer": "I can edit both footage I capture and raw files you provide. That includes creative video editing, photo editing, and post-production work tailored to your project goals.",
    },
    {
        "patterns": [
            "digital marketing",
            "social media",
            "content strategy",
            "marketing",
        ],
        "answer": "My digital marketing work focuses on social media strategy, content creation, posting structure, and audience-focused planning. Packages can be tailored around your business goals.",
    },
    {
        "patterns": [
            "agentic ai",
            "ai development",
            "custom ai",
            "automation",
            "assistant",
        ],
        "answer": "I build custom AI assistants and workflow automations that help creative businesses reduce repetitive work, generate ideas faster, and improve consistency across production and outreach.",
    },
    {
        "patterns": [
            "price",
            "pricing",
            "cost",
            "rate",
            "rates",
            "charge",
            "quote",
        ],
        "answer": "Pricing depends on the project's scope, deliverables, duration, and complexity. The best way to get an accurate quote is to email muhammad.moazzam635@gmail.com with the details of what you need.",
    },
    {
        "patterns": [
            "process",
            "how do we work",
            "workflow",
            "start a project",
            "working with you",
        ],
        "answer": "The process is straightforward: first you email your project idea, then we discuss scope, timeline, and budget, after that I send a quotation, and once approved the work begins.",
    },
    {
        "patterns": [
            "contact",
            "email",
            "reach you",
            "instagram",
        ],
        "answer": "You can reach me at muhammad.moazzam635@gmail.com, and you can also view more work and updates through my social presence at @mox.shots.",
    },
]


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", value.lower())).strip()


def find_answer(query: str) -> str:
    normalized_query = normalize_text(query)

    for item in FAQ_RESPONSES:
        if any(pattern in normalized_query for pattern in item["patterns"]):
            return item["answer"]

    return (
        "Thanks for reaching out. I can help with videography, photography, editing, digital marketing, and agentic AI development. "
        "For anything specific, email muhammad.moazzam635@gmail.com with your project details and I can respond with the right next steps."
    )

@app.post("/api/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    return QueryResponse(answer=find_answer(request.query))

@app.get("/")
async def root():
    return {"message": "Moazzam Portfolio AI Assistant API"}


@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
