import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import todosRouter from "./routers/todos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI || !MONGO_URI.startsWith("mongodb+srv://")) {
  console.error("MONGO_URI가 Atlas 주소(mongodb+srv://)가 아닙니다. .env를 확인하세요.");
  process.exit(1);
}

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.json({
      ok: connected,
      db: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
    });
  });

  app.use("/todos", todosRouter);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log(`연결성공: ${mongoose.connection.host} / db=${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
  }
}

start();
