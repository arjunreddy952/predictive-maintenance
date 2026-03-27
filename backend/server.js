const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/predict", (req, res) => {
    const inputPath = path.join(__dirname, "input.json");

    fs.writeFileSync(inputPath, JSON.stringify(req.body));

    exec("python ../ml-model/predict.py", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.json({ error: "Error running model" });
        }

        const result = stdout.trim() === "1"
            ? "Failure ⚠️"
            : "Healthy ✅";

        res.json({ prediction: result });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000 🚀");
});