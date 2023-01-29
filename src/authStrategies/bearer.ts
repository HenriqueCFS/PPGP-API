import { prisma } from "../utils/prisma";
import BearerStrategy from "passport-http-bearer";
import { User } from "@prisma/client";
export default new BearerStrategy(async function (token, done) {
  try {
    const user: User = await prisma.user.findFirst({ where: { token } });
    if (!user) {
      return done(null, false);
    }
    return done(null, user, { scope: "all" });
  } catch (err) {
    return done(err);
  }
});
