import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "careerboost-secret-key-12345")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/careerboost_ai")
    UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
    ALLOWED_EXTENSIONS = {"pdf", "docx"}
    JWT_EXPIRATION_DELTA = 86400  # 1 day in seconds
