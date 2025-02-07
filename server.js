// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/verify/epfo", async (req, res) => {
  try {
    const { uan } = req.body;
    const response = await axios.get(
      `https://production.deepvue.tech/v1/verification/epfo/uan-to-employment-history`,
      {
        params: {
          uan_number: uan,
          generate_pdf: true,
        },
        headers: {
          Authorization: `Bearer ${process.env.DEEPVUE_ACCESS_TOKEN}`,
          "x-api-key": process.env.DEEPVUE_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      status: "failed",
      message: error.response?.data?.message || "Verification failed",
    });
  }
});

// server.js
app.post("/api/verify/dl", async (req, res) => {
  try {
    const { dl_number, dob } = req.body;
    const response = await axios.post(
      `https://production.deepvue.tech/v1/verification/post-driving-license`,
      null,
      {
        params: { dl_number, dob },
        headers: {
          Authorization: `Bearer ${process.env.DEEPVUE_ACCESS_TOKEN}`,
          "x-api-key": process.env.DEEPVUE_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.get("/api/verify/dl/:requestId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://production.deepvue.tech/v1/verification/get-driving-license`,
      {
        params: { request_id: req.params.requestId },
        headers: {
          Authorization: `Bearer ${process.env.DEEPVUE_ACCESS_TOKEN}`,
          "x-api-key": process.env.DEEPVUE_API_KEY,
        },
      }
    );
    res.json(response.data[0]);
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
