import express from 'express';
import dotenv from "dotenv"
import cookieparser from "cookie-parser"
import cors from "cors"
import { connectDB } from './lib/db';
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cookieparser())
app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true
}))

app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB()
});
