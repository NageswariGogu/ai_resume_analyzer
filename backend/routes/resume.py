import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from backend.routes.auth import token_required
from backend.services.text_extractor import TextExtractor
from backend.services.analyzer import AnalyzerService
from backend.models.resume import ResumeModel

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/upload", methods=["POST"])
@token_required
def upload_resume(current_user):
    if "file" not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400
    
    if file:
        filename = secure_filename(file.filename)
        extension = filename.rsplit(".", 1)[1].lower()
        if extension not in current_app.config["ALLOWED_EXTENSIONS"]:
            return jsonify({"message": "Unsupported file format"}), 400
            
        file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)
        
        # Extract text
        text = TextExtractor.extract_text(file_path, extension)
        
        # Analyze
        analyzer = AnalyzerService()
        analysis_results = analyzer.analyze(text)
        
        # Save to DB
        resume_model = ResumeModel(current_app.db)
        result = resume_model.save_analysis(str(current_user["_id"]), text, analysis_results)
        
        return jsonify({
            "message": "Resume uploaded and analyzed successfully",
            "resume_id": str(result.inserted_id),
            "analysis": analysis_results
        }), 201

@resume_bp.route("/history", methods=["GET"])
@token_required
def get_history(current_user):
    resume_model = ResumeModel(current_app.db)
    history = resume_model.get_user_history(str(current_user["_id"]))
    
    # Convert ObjectIds to strings
    for item in history:
        item["_id"] = str(item["_id"])
        item["userId"] = str(item["userId"])
        
    return jsonify(history), 200

@resume_bp.route("/analyze-text", methods=["POST"])
@token_required
def analyze_text(current_user):
    data = request.get_json()
    if not data or not data.get("text"):
        return jsonify({"message": "No text provided"}), 400
        
    analyzer = AnalyzerService()
    analysis_results = analyzer.analyze(data["text"])
    
    return jsonify(analysis_results), 200
