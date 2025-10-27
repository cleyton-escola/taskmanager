import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("."));
app.use(express.static("docs"));

(async () => {
  await storage.ensureDefaultUser();
  
  const server = await registerRoutes(app);

  const PORT = parseInt(process.env.PORT || "5000", 10);
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
})();
