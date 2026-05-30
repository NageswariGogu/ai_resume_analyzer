import jwt
import datetime
from flask import Blueprint, request, jsonify, current_app
from backend.models.user import UserModel
from functools import wraps

auth_bp = Blueprint("auth", __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        
        try:
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            user_model = UserModel(current_app.db)
            current_user = user_model.find_by_id(data["user_id"])
        except Exception as e:
            return jsonify({"message": "Token is invalid", "error": str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({"message": "Missing fields"}), 400
    
    user_model = UserModel(current_app.db)
    result = user_model.create_user(data["name"], data["email"], data["password"])
    
    if not result:
        return jsonify({"message": "User already exists"}), 409
        
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Missing credentials"}), 400
    
    user_model = UserModel(current_app.db)
    user = user_model.find_by_email(data["email"])
    
    if not user or not UserModel.verify_password(data["password"], user["password"]):
        return jsonify({"message": "Invalid email or password"}), 401
    
    token = jwt.encode({
        "user_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=current_app.config["JWT_EXPIRATION_DELTA"])
    }, current_app.config["SECRET_KEY"], algorithm="HS256")
    
    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }), 200

@auth_bp.route("/profile", methods=["GET"])
@token_required
def get_profile(current_user):
    return jsonify({
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "createdAt": current_user["createdAt"]
    }), 200
