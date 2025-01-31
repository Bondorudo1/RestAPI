import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/index";
import dotenv from "dotenv";
import { db } from "./db"; 

dotenv.config(); 

const app = express();


app.use(helmet()); 
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan("combined")); 


app.use("/api", router());


app.get("/api/health", async (req, res) => {
  try {
    const [result] = await db.execute("SELECT 1"); 
    res.status(200).json({ status: "OK", db: result });
  } catch (error: any) {
    res.status(500).json({ status: "Database connection failed", error: error.message });
  }
});


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on https://0.0.0.0:${PORT}`);
});




process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
