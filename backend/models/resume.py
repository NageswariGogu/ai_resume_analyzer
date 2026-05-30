import datetime
import json
import os
from bson import ObjectId

class ResumeModel:
    def __init__(self, db):
        self.db = db
        self.collection = db.resumes if db is not None else None
        self.mock_file = "resumes_db.json"
        if db is None and not os.path.exists(self.mock_file):
            with open(self.mock_file, "w") as f:
                json.dump([], f)

    def save_analysis(self, user_id, resume_text, analysis_results):
        resume_data = {
            "userId": user_id, # Keep as string for simple fallback
            "resumeText": resume_text,
            "atsScore": analysis_results.get("ats_score"),
            "extractedSkills": list(analysis_results.get("skills", [])),
            "missingSkills": analysis_results.get("missing_skills"),
            "suggestions": analysis_results.get("suggestions"),
            "sections": analysis_results.get("sections"),
            "jobMatch": analysis_results.get("job_match"),
            "createdAt": datetime.datetime.utcnow().isoformat()
        }
        
        if self.collection is not None:
            try:
                db_data = resume_data.copy()
                db_data["userId"] = ObjectId(user_id) if user_id else None
                db_data["createdAt"] = datetime.datetime.utcnow()
                return self.collection.insert_one(db_data)
            except Exception:
                pass

        # Mock implementation
        resumes = self._read_mock()
        resume_data['_id'] = str(ObjectId())
        resumes.append(resume_data)
        self._write_mock(resumes)
        return type('obj', (object,), {'inserted_id': resume_data['_id']})

    def get_user_history(self, user_id):
        if self.collection is not None:
            try:
                return list(self.collection.find({"userId": ObjectId(user_id)}).sort("createdAt", -1))
            except Exception:
                pass
        
        resumes = self._read_mock()
        return [r for r in resumes if r['userId'] == user_id]

    def _read_mock(self):
        try:
            with open(self.mock_file, "r") as f:
                return json.load(f)
        except:
            return []

    def _write_mock(self, data):
        with open(self.mock_file, "w") as f:
            json.dump(data, f)
