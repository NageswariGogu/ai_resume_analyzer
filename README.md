# CareerBoost AI – Smart Resume Analyzer

A professional AI-powered platform to analyze resume quality, calculate ATS scores, detect skill gaps, and provide intelligent career suggestions.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React
- **Backend**: Python Flask, MongoDB, spaCy, NLTK, PyPDF2, python-docx, Scikit-learn
- **Auth**: JWT Authentication, Bcrypt hashing

## Features
1. **ATS Scoring**: Advanced algorithm matching resumes against industry standards.
2. **Skill Gap Detection**: Identifies missing technical and soft skills.
3. **AI Career Assistant**: Interactive chatbot for personalized resume tips.
4. **Dashboard Analytics**: Visualizes progress and ATS trends over time.
5. **JD Matching**: Compares resume text with specific job descriptions.
6. **Fake Skill Detector**: (Backend ready) MCQ generator for claimed skills.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB instance (Local or Atlas)

### Backend Setup
1. Navigate to `backend/`
2. Create a `.env` file:
   ```env
   SECRET_KEY=your_secret_key
   MONGO_URI=mongodb://localhost:27017/careerboost_ai
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```
4. Run the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `/backend`: Flask API, Models, NLP Services
- `/frontend`: React Pages, Components, Analytics
- `/uploads`: Temporary storage for uploaded resumes
