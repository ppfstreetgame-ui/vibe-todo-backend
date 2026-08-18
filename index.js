import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import todosRouter from "./routers/todos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI || !MONGO_URI.startsWith("mongodb+srv://")) {
  console.error("MONGO_URI가 Atlas 주소(mongodb+srv://)가 아닙니다. .env를 확인하세요.");
  process.exit(1);
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`연결성공: ${mongoose.connection.host} / db=${mongoose.connection.name}`);

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get("/health", (req, res) => {
      res.json({ ok: true, db: mongoose.connection.name, host: mongoose.connection.host });
    });

    app.use("/todos", todosRouter);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
    process.exit(1);
  }
}

start();
