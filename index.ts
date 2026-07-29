// server/src/index.ts
import dns from "node:dns";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

import dotenv from "dotenv";
import { type User } from "./types";




dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI as string;
const port = process.env.PORT || 5000;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});




async function run(): Promise<void> {
  const db = client.db("sathrift");
  const userCollection = db.collection<User>("user");

 
  await client.connect();
  console.log("✅ Database connected");
  console.log(`✅ Server running on port ${port}`);
}

run().catch(console.dir);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`),
  );
}

export default app;
