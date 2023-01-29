const shutdown = (server, prisma) => {
  console.log("\nServer is shutting down...");
  // close the server
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    console.log("Server is closed.");
    // close the prisma client
    prisma.$disconnect().then(() => {
      console.log("Prisma client is disconnected");
      process.exit();
    });
  });
};
export default shutdown;
