import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import evaluateTextbookHandler from "./api/evaluate-textbook";
import generateReflectionHandler from "./api/generate-reflection";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoints
  app.post("/api/evaluate-textbook", evaluateTextbookHandler);
  app.post("/api/generate-reflection", generateReflectionHandler);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
