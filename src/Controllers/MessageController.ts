import { prisma } from "../utils/prisma";
import { Message } from "@prisma/client";

export class MessageController {
  async createMessage(content: string, senderId: string, receiverId: string) {
    try {
      if (senderId == receiverId) {
        throw new Error("Cannot send message to yourself");
      }
      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId,
        },
      });
      return message;
    } catch (error) {
      console.log(error);
      throw new Error(`Error creating message: ${error.message}`);
    }
  }

  async getMessages(req): Promise<Message[]> {
    try {
      const messages = await prisma.message.findMany({
        where: { OR: [{ senderId: req.user.id }, { receiverId: req.user.id }] },
      });
      return messages;
    } catch (error) {
      throw new Error(`Error getting messages: ${error.message}`);
    }
  }

  async getMessage(id: string): Promise<Message> {
    try {
      const message = await prisma.message.findFirst({
        where: {
          id,
        },
      });
      return message;
    } catch (error) {
      throw new Error(`Error getting message: ${error.message}`);
    }
  }

  async updateMessage(req, res, id: string, content: string): Promise<Message> {
    try {
      const message = await prisma.message.findFirst({ where: { id } });
      if (!message) {
        return res.status(404).send("No message found");
      }
      if (message.senderId != req.user.id) {
        return res.status(401).send("You cannot edit this message");
      }
      const updatedMessage = await prisma.message.update({
        where: { id },
        data: { content },
      });
      return updatedMessage;
    } catch (error) {
      throw new Error(`Error updating message: ${error.message}`);
    }
  }

  async deleteMessage(req, res, id: string): Promise<Message> {
    try {
      const message = await prisma.message.findFirst({ where: { id } });
      if (message.senderId != req.user.id) {
        return res.status(401).send("You cannot edit this message");
      }
      const updatedMessage = await prisma.message.delete({
        where: { id },
      });
      return updatedMessage;
    } catch (error) {
      throw new Error(`Error deleting message: ${error.message}`);
    }
  }
}

export default new MessageController();
