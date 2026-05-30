import json
import os
import datetime
from flask_bcrypt import generate_password_hash, check_password_hash
from bson import ObjectId

class UserModel:
    def __init__(self, db):
        self.db = db
        self.collection = db.users if db else None
        self.mock_file = "users_db.json"
        if not db and not os.path.exists(self.mock_file):
            with open(self.mock_file, "w") as f:
                json.dump([], f)

    def create_user(self, name, email, password):
        hashed_password = generate_password_hash(password).decode('utf-8')
        user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "createdAt": datetime.datetime.utcnow().isoformat()
        }
        
        if self.collection is not None:
            try:
                if self.collection.find_one({"email": email}):
                    return None
                return self.collection.insert_one(user)
            except Exception:
                pass # Fallback to mock

        # Mock implementation
        users = self._read_mock()
        if any(u['email'] == email for u in users):
            return None
        user['_id'] = str(ObjectId())
        users.append(user)
        self._write_mock(users)
        return type('obj', (object,), {'inserted_id': user['_id']})

    def find_by_email(self, email):
        if self.collection is not None:
            try:
                return self.collection.find_one({"email": email})
            except Exception:
                pass
        
        users = self._read_mock()
        return next((u for u in users if u['email'] == email), None)

    def find_by_id(self, user_id):
        if self.collection is not None:
            try:
                return self.collection.find_one({"_id": ObjectId(user_id)})
            except Exception:
                pass
        
        users = self._read_mock()
        return next((u for u in users if u['_id'] == user_id), None)

    def _read_mock(self):
        try:
            with open(self.mock_file, "r") as f:
                return json.load(f)
        except:
            return []

    def _write_mock(self, data):
        with open(self.mock_file, "w") as f:
            json.dump(data, f)

    @staticmethod
    def verify_password(plain_password, hashed_password):
        return check_password_hash(hashed_password, plain_password)
