import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import fidoRoutes from "./routes/fidoRoutes.js";
dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.dophantruongtien.io.vn"
      "https://fakeweb-self.vercel.app"
    ],
    credentials: true
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/fido", fidoRoutes);

app.get("/", (req, res) => {
  res.send("KMASTORE API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
