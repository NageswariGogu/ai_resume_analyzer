import os
import PyPDF2
import docx

class TextExtractor:
    @staticmethod
    def extract_from_pdf(file_path):
        text = ""
        try:
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error extracting PDF: {e}")
        return text

    @staticmethod
    def extract_from_docx(file_path):
        text = ""
        try:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error extracting DOCX: {e}")
        return text

    @classmethod
    def extract_text(cls, file_path, extension):
        if extension == "pdf":
            return cls.extract_from_pdf(file_path)
        elif extension == "docx":
            return cls.extract_from_docx(file_path)
        return ""
