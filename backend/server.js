const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/predict", (req, res) => {
  const { temperature, vibration, pressure } = req.body;

  let result;

  // 🔥 SIMPLE & RELIABLE LOGIC
  if (
    temperature > 110 ||
    vibration > 1.2 ||
    pressure > 70
  ) {
    result = "Failure ⚠️";
  } else {
    result = "Healthy ✅";
  }

  console.log("DATA:", req.body);
  console.log("RESULT:", result);

  res.json({ prediction: result });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});