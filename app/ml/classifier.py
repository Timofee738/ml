import os

import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), "spam_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"spam model not found at {MODEL_PATH}. "
        "train it first with `python research/train_spam_model.py`."
    )

model = joblib.load(MODEL_PATH)


def predict_spam(text: str) -> bool:
    prediction = model.predict([text])[0]
    return bool(prediction)
