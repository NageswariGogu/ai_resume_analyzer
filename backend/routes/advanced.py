import random
from flask import Blueprint, request, jsonify, current_app
from backend.routes.auth import token_required

advanced_bp = Blueprint("advanced", __name__)

# Skill MCQ data
SKILL_MCQS = {
    "python": [
        {"question": "What is the difference between list and tuple?", "options": ["Lists are mutable, tuples are immutable", "Lists are immutable, tuples are mutable", "Both are mutable", "Both are immutable"], "answer": 0},
        {"question": "What does PEP 8 refer to?", "options": ["Web framework", "Style guide", "Package manager", "Database"], "answer": 1}
    ],
    "javascript": [
        {"question": "What is 'hoisting'?", "options": ["Lifting weights", "Moving declarations to top", "A way to loop", "Object creation"], "answer": 1},
        {"question": "What is a closure?", "options": ["Closing a file", "Function with its lexical environment", "End of a loop", "Private variable"], "answer": 1}
    ],
    "react": [
        {"question": "What is the Virtual DOM?", "options": ["A direct copy of DOM", "In-memory representation of UI", "A browser extension", "Server-side rendering"], "answer": 1},
        {"question": "What hook is used for side effects?", "options": ["useState", "useEffect", "useContext", "useMemo"], "answer": 1}
    ]
}

@advanced_bp.route("/fake-skill/quiz", methods=["POST"])
@token_required
def get_skill_quiz(current_user):
    data = request.get_json()
    skills = data.get("skills", [])
    
    if not skills:
        return jsonify({"message": "No skills provided"}), 400
        
    quiz = []
    for skill in skills:
        skill_lower = skill.lower()
        if skill_lower in SKILL_MCQS:
            q = random.choice(SKILL_MCQS[skill_lower])
            quiz.append({
                "skill": skill,
                "question": q["question"],
                "options": q["options"]
            })
            
    return jsonify(quiz), 200

@advanced_bp.route("/job-match", methods=["POST"])
@token_required
def match_job(current_user):
    data = request.get_json()
    resume_text = data.get("resume_text")
    job_description = data.get("job_description")
    
    if not resume_text or not job_description:
        return jsonify({"message": "Missing resume or job description"}), 400
        
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
    match_percentage = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0] * 100
    
    return jsonify({
        "match_percentage": round(match_percentage, 2),
        "missing_keywords": ["CI/CD", "Testing", "Documentation"], # Placeholder
    }), 200

@advanced_bp.route("/chatbot", methods=["POST"])
@token_required
def chatbot(current_user):
    data = request.get_json()
    message = data.get("message")
    
    if not message:
        return jsonify({"message": "No message provided"}), 400
        
    # Simple rule-based chatbot for demo
    responses = {
        "hello": "Hello! I am your CareerBoost AI assistant. How can I help you improve your resume today?",
        "ats": "ATS (Applicant Tracking System) is a software used by employers to filter candidates. To optimize for it, use relevant keywords and standard formatting.",
        "skills": "You should focus on adding both hard skills (like Python, React) and soft skills (like Leadership, Communication) to your resume.",
        "thank you": "You're welcome! Feel free to ask more questions."
    }
    
    response = "That's an interesting question. I'd recommend tailoring your resume specifically for the job role you're applying for."
    for key in responses:
        if key in message.lower():
            response = responses[key]
            break
            
    return jsonify({"response": response}), 200
