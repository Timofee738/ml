from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

posts = [
    {"id": 101, "title": "Основы брейк-данса", "content": "Как научиться делать фризы и топ-рок с нуля"},
    {"id": 102, "title": "Лучшие кроссовки для танцев", "content": "Обзор обуви для брейка и уличных танцев"},
    {"id": 103, "title": "Рецепт блинов", "content": "Как приготовить вкусные блины на молоке"},
    {"id": 104, "title": "История хип-хопа", "content": "Откуда пошел брейкинг и диджеинг в Нью-Йорке"}
]

documents = [f"{p['title']} {p['content']}" for p in posts]

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(documents)

post_sim = cosine_similarity(tfidf_matrix)

def suggest_post(post_id, top_n=2):
    idx = next(i for i, p in enumerate(posts) if p['id'] == post_id)
    sim_scores = sorted(list(enumerate(post_sim[idx])), key=lambda x: x[1], reverse=True)

    recommendations = []
    for i, score in sim_scores[1:top_n+1]:
        recommendations.append({"title": posts[i]['title'], "similarity": round(float(score), 2)})

    return recommendations

print(suggest_post(104))