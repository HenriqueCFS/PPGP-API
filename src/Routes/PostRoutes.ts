import PostController from "../Controllers/PostController";
import express from "express";

var router = express.Router();

router.post("/", async (request, reply) => {
  const { title, content, authorId } = request.body as {
    title: string;
    content: string;
    published: boolean;
    authorId: string;
  };
  try {
    const post = await PostController.createPost(title, content, authorId);
    reply.status(201).send(post);
  } catch (error) {
    reply.status(400).send({ message: error.message });
  }
});

router.get("/", async (request, reply) => {
  try {
    const posts = await PostController.getPosts();
    reply.send(posts);
  } catch (error) {
    reply.status(400).send({ message: error.message });
  }
});

router.get("/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const post = await PostController.getPost(id);
    if (post) {
      reply.send(post);
    } else {
      reply.status(404).send({ message: "Post not found" });
    }
  } catch (error) {
    reply.status(400).send({ message: error.message });
  }
});

router.put("/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const { title, content, published } = request.body as {
    title: string;
    content: string;
    published: boolean;
  };
  try {
    const post = await PostController.updatePost(id, title, content, published);
    if (post) {
      reply.send(post);
    } else {
      reply.status(404).send({ message: "Post not found" });
    }
  } catch (error) {
    reply.status(400).send({ message: error.message });
  }
});

router.delete("/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const post = await PostController.deletePost(id);
    if (post) {
      reply.send({ message: "Post deleted" });
    } else {
      reply.status(404).send({ message: "Post not found" });
    }
  } catch (error) {
    reply.status(400).send({ message: error.message });
  }
});

export default router;
