import { prisma } from "../utils/prisma";

const isGroupAdmin = async (req, res, next) => {
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

  if (!groupMember || !groupMember.isAdmin) {
    return res.status(401).send("You are not an admin of this group");
  }

  next();
};

export default isGroupAdmin;
