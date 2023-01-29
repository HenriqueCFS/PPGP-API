import { prisma } from "./utils/prisma";
import userRouter from "./Routes/UserRoutes";
import groupRouter from "./Routes/GroupRoutes";
import postRouter from "./Routes/PostRoutes";
import messageRouter from "./Routes/MessageRoutes";
import requireAuth from "./Middlewares/requireAuth";
import shutdown from "./utils/gracefulShutdown";
import app from "./config";

const port = process.env.PORT || 3001;

app.use(userRouter);
app.use("/groups", requireAuth, groupRouter);
app.use("/posts", requireAuth, postRouter);
app.use("/messages", requireAuth, messageRouter);

// handle graceful shutdown
process.on("SIGTERM", () => shutdown(server, prisma));
process.on("SIGINT", () => shutdown(server, prisma));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
