import joblib

model = joblib.load('../app/ml/spam_model.pkl')

test_phrases = [
    "Hey, do you want to go to the cinema tonight?",
    "WINNER! You won 1000 dollars, click the link to claim your prize now!!!"
]

results = model.predict(test_phrases)

for phrase, res in zip(test_phrases, results):
    label = 'SPAM' if res == 1 else 'Ok'
    print(f'text: {phrase} -> result: {label}')