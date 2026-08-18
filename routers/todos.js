import { Router } from "express";
import Todo from "../models/Todo.js";

const router = Router();

// GET /todos - 할일 목록 조회
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "할일 조회에 실패했습니다." });
  }
});

// POST /todos - 할일 생성
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title은 필수입니다." });
    }

    const todo = await Todo.create({ title: title.trim() });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "할일 생성에 실패했습니다." });
  }
});

// PUT /todos/:id - 할일 수정
router.put("/:id", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title은 필수입니다." });
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: title.trim() },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ error: "할일을 찾을 수 없습니다." });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "할일 수정에 실패했습니다." });
  }
});

// DELETE /todos/:id - 할일 삭제
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "할일을 찾을 수 없습니다." });
    }

    res.json({ message: "할일이 삭제되었습니다.", todo });
  } catch (error) {
    res.status(500).json({ error: "할일 삭제에 실패했습니다." });
  }
});

export default router;
