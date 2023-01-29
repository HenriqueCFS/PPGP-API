import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export default class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      let data = { name, email, password };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        data = { ...data, password: hashedPassword };
      }
      const user = await prisma.user.update({
        where: { id },
        data,
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).send("Sucessfully logged out");
    });
  }
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.delete({ where: { id } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaginatedUsers(
    page: number,
    pageSize: number,
    keyword: string
  ): Promise<User[]> {
    try {
      const users = await prisma.user.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        where: {
          OR: [
            { name: { contains: keyword } },
            { email: { contains: keyword } },
          ],
        },
      });
      return users;
    } catch (error) {
      throw new Error(`Error getting paginated users: ${error.message}`);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid)
        return res.status(401).json({ message: "Invalid password" });
      const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, {
        expiresIn: process.env.SESSION_DURATION,
      });
      res.status(200).json({ message: "Logged in", token });
    } catch (error) {
      next(error);
    }
  }
}
