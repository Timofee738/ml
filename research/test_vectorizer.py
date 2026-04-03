from sklearn.feature_extraction.text import TfidfVectorizer

texts = [
    "Купи дешево биткоин прямо сейчас по ссылке",
    "Привет, как дела? Пойдем гулять?",
    "Срочно! Твой аккаунт взломан, введи пароль",
    "Завтра будет отличная погода для пробежки"
]

vectorizer = TfidfVectorizer()

tfidf = vectorizer.fit_transform(texts)

print('Словарь:', vectorizer.get_feature_names_out())

print("Первое предложение в цифрах:\n", tfidf.toarray()[0])