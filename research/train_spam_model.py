import os

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

DATASET_URL = "https://raw.githubusercontent.com/justmarkham/pycon-2016-tutorial/master/data/sms.tsv"
MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "app", "ml", "spam_model.pkl")
)


def train_and_save_model() -> None:
    df = pd.read_csv(DATASET_URL, sep="\t", header=None, names=["label", "message"])
    df["label"] = df["label"].map({"ham": 0, "spam": 1})

    x_train, x_test, y_train, y_test = train_test_split(
        df["message"],
        df["label"],
        test_size=0.2,
        random_state=42,
    )

    model = Pipeline(
        [
            ("vectorizer", TfidfVectorizer()),
            ("classifier", MultinomialNB()),
        ]
    )

    print("training model...")
    model.fit(x_train, y_train)

    predictions = model.predict(x_test)
    print(classification_report(y_test, predictions))

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"model saved to {MODEL_PATH}")


if __name__ == "__main__":
    train_and_save_model()

