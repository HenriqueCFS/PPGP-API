import { prisma } from "../utils/prisma";
import { Group, GroupMember, User } from "@prisma/client";

export class GroupController {
  async createGroup(creatorId: string, name: string): Promise<Group> {
    try {
      const group = await prisma.group.create({
        data: {
          name,
          members: {
            create: {
              user: {
                connect: { id: creatorId },
              },
              isAdmin: true,
            },
          },
        },
      });
      return group;
    } catch (error) {
      throw new Error(`Error creating group: ${error.message}`);
    }
  }

  async addUserToGroup(groupId: string, userId: string): Promise<void> {
    const memberExists = await prisma.user.count({
      where: {
        groups: {
          some: {
            groupId,
            userId,
          },
        },
      },
    });
    if (memberExists) throw new Error("User already in group");
    await prisma.groupMember.create({
      data: {
        group: {
          connect: {
            id: groupId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async removeUserFromGroup(
    userId: string,
    groupId: string
  ): Promise<GroupMember> {
    try {
      let groupMember = await prisma.groupMember.findFirst({
        where: { groupId, userId },
      });

      if (!groupMember) {
        throw new Error("User not in group");
      }
      groupMember = await prisma.groupMember.delete({
        where: { id: groupMember.id },
      });
      return groupMember;
    } catch (error) {
      throw new Error(`Error removing user from group: ${error.message}`);
    }
  }

  async getGroupMembers(
    groupId: string,
    page: number,
    pageSize: number,
    searchTerm: string
  ): Promise<any> {
    try {
      let where = {};
      if (searchTerm) {
        where = {
          name: {
            contains: searchTerm,
          },
        };
      }
      const members = await prisma.groupMember.findMany({
        select: {
          isAdmin: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: { ...where, groupId },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return members;
    } catch (error) {
      throw new Error(`Error getting group members: ${error.message}`);
    }
  }

  async getGroups(
    page: number,
    pageSize: number,
    searchTerm: string
  ): Promise<Group[]> {
    try {
      let where = {};
      if (searchTerm) {
        where = {
          name: {
            contains: searchTerm,
          },
        };
      }
      const groups = await prisma.group.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return groups;
    } catch (error) {
      throw new Error(`Error getting groups: ${error.message}`);
    }
  }

  async getGroup(id: string): Promise<Group> {
    try {
      const group = await prisma.group.findFirst({
        where: {
          id,
        },
      });
      return group;
    } catch (error) {
      throw new Error(`Error getting group: ${error.message}`);
    }
  }

  async updateGroup(id: string, name: string): Promise<Group> {
    try {
      const group = await prisma.group.update({
        where: { id },
        data: { name },
      });
      return group;
    } catch (error) {
      throw new Error(`Error updating group: ${error.message}`);
    }
  }

  async deleteGroup(id: string): Promise<Group> {
    try {
      const group = await prisma.group.delete({
        where: { id },
      });
      return group;
    } catch (error) {
      throw new Error(`Error deleting group: ${error.message}`);
    }
  }
}

export default new GroupController();
