from flask import Flask
import os
from flask_cors import CORS
from backend.config import Config
from pymongo import MongoClient

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, origins=[
        "http://localhost:5173",
        "https://sssresumeanalyzer.netlify.app",
        "https://ssairesumeanalyzer.netlify.app"
    ])
    
    # Initialize MongoDB
    try:
        client = MongoClient(app.config["MONGO_URI"], serverSelectionTimeoutMS=2000)
        client.admin.command('ping') # Check connection
        app.db = client.get_default_database()
    except Exception as e:
        print(f"MongoDB connection failed: {e}. Falling back to local storage.")
        app.db = None
    
    # Ensure upload folder exists
    if not os.path.exists(app.config["UPLOAD_FOLDER"]):
        os.makedirs(app.config["UPLOAD_FOLDER"])
    
    # Register blueprints 
    from backend.routes.auth import auth_bp
    from backend.routes.resume import resume_bp
    from backend.routes.advanced import advanced_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(resume_bp, url_prefix="/api/resume")
    app.register_blueprint(advanced_bp, url_prefix="/api/advanced")
    
    @app.route("/")
    def index():
        return {"message": "Welcome to CareerBoost AI API"}
        
    return app

# Create the application instance for Gunicorn
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
