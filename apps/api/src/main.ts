import { createApiServer } from "./app";

const port = Number(process.env.API_PORT ?? 3001);

const app = createApiServer();
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`Code Hammer API listening on http://127.0.0.1:${port}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
