import joblib
import json
import os

current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, "model.pkl")

model = joblib.load(model_path)

input_path = os.path.join(current_dir, "../backend/input.json")

with open(input_path) as f:
    data = json.load(f)

prediction = model.predict([[data["temperature"], data["vibration"], data["pressure"]]])

print(int(prediction[0]))