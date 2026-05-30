import spacy
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class AnalyzerService:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            # Fallback if model is not loaded
            self.nlp = None

    def analyze(self, text):
        if not text:
            return {"error": "No text to analyze"}
            
        # Basic cleaning
        clean_text = self.clean_text(text)
        
        # Extract skills
        skills = self.extract_skills(clean_text)
        
        # Section detection
        sections = self.detect_sections(text)
        
        # Placeholder for complex scoring
        ats_score = self.calculate_ats_score(skills, sections, text)
        
        return {
            "ats_score": ats_score,
            "skills": list(skills),
            "sections": sections,
            "missing_skills": ["Docker", "Kubernetes", "AWS"],  # Dummy data for now
            "suggestions": [
                "Include more action verbs in your experience section",
                "Add measurable achievements with percentages",
                "Ensure your contact information is clearly visible"
            ],
            "job_match": {
                "Software Engineer": 85,
                "Data Scientist": 45,
                "DevOps": 60
            }
        }

    def clean_text(self, text):
        text = text.lower()
        text = re.sub(r'\s+', ' ', text)
        return text

    def extract_skills(self, text):
        # In a real app, use a predefined skill database or more advanced NER
        common_skills = {"python", "javascript", "react", "node", "flask", "mongodb", "sql", "java", "c++", "aws", "docker", "kubernetes", "typescript", "tailwind", "css", "html"}
        found_skills = set()
        for skill in common_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text):
                found_skills.add(skill)
        return found_skills

    def detect_sections(self, text):
        sections = {
            "Education": False,
            "Experience": False,
            "Skills": False,
            "Projects": False,
            "Certifications": False
        }
        for section in sections.keys():
            if re.search(r'\b' + re.escape(section) + r'\b', text, re.IGNORECASE):
                sections[section] = True
        return sections

    def calculate_ats_score(self, skills, sections, text):
        score = 0
        # Sections weight
        section_score = sum(1 for present in sections.values() if present) / len(sections) * 20
        score += section_score
        
        # Skills weight
        skills_count = len(skills)
        skills_score = min(skills_count * 5, 40) # Max 40% for skills
        score += skills_score
        
        # Length/Keyword density weight (dummy)
        word_count = len(text.split())
        if 200 < word_count < 600:
            score += 20
        else:
            score += 10
            
        # Formatting (dummy)
        score += 20
        
        return int(score)
