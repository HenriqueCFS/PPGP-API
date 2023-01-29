import express from "express";
import MessageController from "../Controllers/MessageController";

const router = express.Router();

router.post("/", async (req: any, res: any) => {
  try {
    const { content, receiverId } = req.body;
    const senderId = req.user.id;
    const message = await MessageController.createMessage(
      content,
      senderId,
      receiverId
    );
    // return res.status(201).json(message);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req: any, res: any) => {
  try {
    const messages = await MessageController.getMessages(req);
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const message = await MessageController.getMessage(id);
    if (!message) return res.status(404).send("Message not found");
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const message = await MessageController.updateMessage(
      req,
      res,
      id,
      content
    );
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const message = await MessageController.deleteMessage(req, res, id);
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
