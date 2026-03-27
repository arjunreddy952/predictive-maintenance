const axios = require("axios");

setInterval(async () => {
    const data = {
        temperature: Math.floor(Math.random() * 50) + 80,
        vibration: (Math.random() * 1.5).toFixed(2),
        pressure: Math.floor(Math.random() * 30) + 30
    };

    try {
        const res = await axios.post("http://localhost:3000/predict", data);
        console.log("Data:", data);
        console.log("Prediction:", res.data.prediction);
        console.log("---------------------------");
    } catch (err) {
        console.error("Error:", err.message);
    }
}, 3000);