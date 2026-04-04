import os

import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), "spam_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"spam model not found at {MODEL_PATH}. "
        "train it first with `python research/train_spam_model.py`."
    )

model = joblib.load(MODEL_PATH)


def predict_spam_score(text: str) -> float:
    probabilities = model.predict_proba([text])[0]
    return float(probabilities[1])


def predict_spam(text: str, threshold: float = 0.5) -> bool:
    return predict_spam_score(text) >= threshold
