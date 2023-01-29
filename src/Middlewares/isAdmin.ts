import { prisma } from "../utils/prisma";

const isGroupMember = async (req, res, next) => {
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

  if (!isAdmin) return res.status(401).send("Insufficient Permissions");

  next();
};

export default isGroupMember;
