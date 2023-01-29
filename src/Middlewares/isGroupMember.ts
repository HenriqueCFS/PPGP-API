import { prisma } from "../utils/prisma";

const isGroupMember = async (req, res, next) => {
  const groupId = req.params.groupId;
  const userId = req.user.id;

  const roles = await prisma.userRole.findMany({
    where: {
      userId,
      roleId: {
        lte: 100,
      },
    },
  });
  const isAdmin = roles.length > 0;

  if (isAdmin) return next();

  const groupMember = await prisma.groupMember.findFirst({
    where: { groupId, userId },
  });

  if (!groupMember) {
    return res.status(401).send("You are not a member of this group");
  }

  next();
};

export default isGroupMember;
