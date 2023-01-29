import { prisma } from "../utils/prisma";
import { Post } from "@prisma/client";

export class PostController {
  async createPost(
    title: string,
    content: string,
    authorId: string
  ): Promise<Post> {
    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          author: {
            connect: { id: authorId },
          },
        },
      });
      return post;
    } catch (error) {
      throw new Error(`Error creating post: ${error.message}`);
    }
  }

  async getPosts(): Promise<Post[]> {
    try {
      const posts = await prisma.post.findMany();
      return posts;
    } catch (error) {
      throw new Error(`Error getting posts: ${error.message}`);
    }
  }

  async getPost(id: string): Promise<Post> {
    try {
      const post = await prisma.post.findFirst({
        where: {
          id,
        },
      });
      return post;
    } catch (error) {
      throw new Error(`Error getting post: ${error.message}`);
    }
  }

  async updatePost(
    id: string,
    title: string,
    content: string,
    published: boolean
  ): Promise<Post> {
    try {
      const post = await prisma.post.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          content: content,
          published: published,
        },
      });
      return post;
    } catch (error) {
      throw new Error(`Error updating post: ${error.message}`);
    }
  }

  async deletePost(id: string): Promise<Post> {
    try {
      const post = await prisma.post.delete({
        where: {
          id: id,
        },
      });
      return post;
    } catch (error) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
  }
}

export default new PostController();
