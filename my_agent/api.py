from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

# Setup API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
else:
    raise ValueError("GOOGLE_API_KEY not set")

import google.generativeai as genai

# Configure genai
genai.configure(api_key=GOOGLE_API_KEY)

# System prompt with Q&A
SYSTEM_PROMPT = """You are a helpful AI assistant for Muhammad Moazzam's portfolio. Answer questions about his videography, photography, video editing, digital marketing services, and agentic AI development. Be professional and engaging.

Respond to questions based on the following information and examples:

📸 General & Inquiries
Question: "What services do you offer, and how do I book you?"
Answer: "I offer professional Videography, Photography, Video/Photo Editing, and Digital Marketing. I also specialize in Agentic AI development to enhance creative workflows. All services are currently paid. To book or get a detailed quote, please email me directly at muhammad.moazzam635@gmail.com with your project details."

Question: "I saw your portfolio. Can you tell me more about your experience and style?"
Answer: "Certainly! My approach blends technical skill with a creative, scientific curiosity. I manage my own social media (@mox.shots) and have hands-on experience in the filming industry. My style focuses on authentic storytelling, whether through a lens or a marketing campaign. I also integrate custom AI tools I've built to bring a unique, efficient edge to my creative work."

🎥 Videography & Photography
Question: "What kind of videography/photography projects do you take on?"
Answer: "I work on a wide range of projects including events, portraits, brand content, and short cinematic reels. You can see examples of my work on my Instagram: @mox.shots. I'm comfortable both on a film set and handling solo shoots, always aiming to capture compelling visuals."

Question: "Do you travel for shoots, and what are your rates?"
Answer: "Yes, I am available for travel depending on the project scope. Since every project has different requirements, I prefer to discuss details first. Please email me at muhammad.moazzam635@gmail.com with your location, the type of shoot, and its duration so I can provide an accurate quotation."

✂️ Editing & Post-Production
Question: "Do you only edit your own footage, or can I send you my raw files to edit?"
Answer: "I do both! I can edit footage I've captured for you, or you can send me your own raw video and photo files. I specialize in creative video and photo editing to bring your vision to life. Just email me to discuss the scope of the edit."

📈 Digital Marketing
Question: "What does your digital marketing service include?"
Answer: "My digital marketing services are designed to help you build and manage your social media presence effectively, similar to how I manage my own pages. This includes content strategy, creation, and scheduling. We can tailor a package to your specific goals. Contact me by email to discuss your needs."

🤖 Agentic AI Development
Question: "You mentioned 'agentic AI development.' What does that mean for a creative business?"
Answer: "Great question! I build custom AI agents (like automated assistants) that can enhance creative workflows—for example, helping to generate content ideas, automate editing tasks, or analyze audience engagement. If you have a repetitive task or a creative challenge, I can explore building an AI solution for you. Let's connect via email to discuss the possibilities."

💰 Pricing & Process
Question: "How much do you charge for [specific service]?"
Answer: "Pricing depends on the project's complexity, duration, and specific requirements. To give you an accurate quote, please send an email to muhammad.moazzam635@gmail.com with as much detail as possible about what you need."

Question: "What is the typical process for working with you?"
Answer: "The process is simple:

Inquiry: You email me at muhammad.moazzam635@gmail.com with your project idea.

Consultation: We discuss details, timeline, and budget.

Quote: I provide a formal quotation.

Execution: Upon agreement, we start the creative work!"
"""

model = genai.GenerativeModel("models/gemini-1.5-flash-002", system_instruction=SYSTEM_PROMPT)

app = FastAPI(title="Moazzam Portfolio AI Assistant")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

# Q&A dictionary with key phrases
qa_dict = {
    "what services do you offer": "I offer professional Videography, Photography, Video/Photo Editing, and Digital Marketing. I also specialize in Agentic AI development to enhance creative workflows. All services are currently paid. To book or get a detailed quote, please email me directly at muhammad.moazzam635@gmail.com with your project details.",
    "portfolio": "Certainly! My approach blends technical skill with a creative, scientific curiosity. I manage my own social media (@mox.shots) and have hands-on experience in the filming industry. My style focuses on authentic storytelling, whether through a lens or a marketing campaign. I also integrate custom AI tools I've built to bring a unique, efficient edge to my creative work.",
    "videography/photography projects": "I work on a wide range of projects including events, portraits, brand content, and short cinematic reels. You can see examples of my work on my Instagram: @mox.shots. I'm comfortable both on a film set and handling solo shoots, always aiming to capture compelling visuals.",
    "travel for shoots": "Yes, I am available for travel depending on the project scope. Since every project has different requirements, I prefer to discuss details first. Please email me at muhammad.moazzam635@gmail.com with your location, the type of shoot, and its duration so I can provide an accurate quotation.",
    "edit your own footage": "I do both! I can edit footage I've captured for you, or you can send me your own raw video and photo files. I specialize in creative video and photo editing to bring your vision to life. Just email me to discuss the scope of the edit.",
    "digital marketing service": "My digital marketing services are designed to help you build and manage your social media presence effectively, similar to how I manage my own pages. This includes content strategy, creation, and scheduling. We can tailor a package to your specific goals. Contact me by email to discuss your needs.",
    "agentic ai development": "Great question! I build custom AI agents (like automated assistants) that can enhance creative workflows—for example, helping to generate content ideas, automate editing tasks, or analyze audience engagement. If you have a repetitive task or a creative challenge, I can explore building an AI solution for you. Let's connect via email to discuss the possibilities.",
    "how much do you charge": "Pricing depends on the project's complexity, duration, and specific requirements. To give you an accurate quote, please send an email to muhammad.moazzam635@gmail.com with as much detail as possible about what you need.",
    "typical process": "The process is simple:\n\nInquiry: You email me at muhammad.moazzam635@gmail.com with your project idea.\n\nConsultation: We discuss details, timeline, and budget.\n\nQuote: I provide a formal quotation.\n\nExecution: Upon agreement, we start the creative work!"
}

@app.post("/api/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    query = request.query.lower()
    for key, a in qa_dict.items():
        if key in query:
            return QueryResponse(answer=a)
    # Default response
    return QueryResponse(answer="I'm sorry, I don't have a specific answer for that. Please email me at muhammad.moazzam635@gmail.com for more details.")

@app.get("/")
async def root():
    return {"message": "Moazzam Portfolio AI Assistant API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)