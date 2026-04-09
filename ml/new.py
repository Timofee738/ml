from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# 1. Загружаем модель (она скачается один раз при первом запуске)
# Эта модель хорошо понимает русский язык и очень легкая
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

posts = [
    {"id": 1, "text": "Основы брейк-данса и фризы"},
    {"id": 2, "text": "Как научиться танцевать на улице"},
    {"id": 3, "text": "Рецепт блинов на молоке"}
]

# 2. Превращаем тексты в смысловые векторы
sentences = [p['text'] for p in posts]
embeddings = model.encode(sentences)

# 3. Считаем сходство
# Сравним первый пост (брейк) со всеми остальными
sim_matrix = cosine_similarity([embeddings[0]], embeddings)

# Результат будет гораздо выше нуля, так как модель понимает,
# что "брейк-данс" и "танцевать" связаны по смыслу!
print(sim_matrix)