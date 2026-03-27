import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("../dataset/data.csv")

X = data[['temperature', 'vibration', 'pressure']]
y = data['failure']

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model trained successfully!")