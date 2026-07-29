// server/src/index.ts
import dns from "node:dns";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  CommandSucceededEvent,
} from "mongodb";

import dotenv from "dotenv";
import { type Product, type User, type Wishlist } from "./types";

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
  const productCollection = db.collection<Product>("product");
  const whislistCollection = db.collection<Wishlist>("user");
  const userCollection = db.collection<User>("user");

  // product api's
  // -> add product
  app.post("/api/product", async (req: Request, res: Response) => {
    try {
      const getSellerId = req.body.sellerId;
      if (!getSellerId) {
        res.send("No seller id found");
        return;
      }
      const newProduct: Product = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await productCollection.insertOne(newProduct);
      res.status(200).json({
        message: "Product added successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Product added failed",
        success: false,
        error: error,
      });
    }
  });

  // get all product
  app.get("/api/product", async (req: Request, res: Response) => {
    try {
      const { title, category } = req.query;
      let query: any = {};
      if (title) {
        query.title = { $regex: title as string, $options: "i" };
      }
      if (category) {
        query.category = category;
      }

      const result = productCollection.find(query).toArray();

      res.status(200).json({
        message: "Product fetched successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Product fetched failed",
        success: false,
        error: error,
      });
    }
  });

  // update product
  app.patch("/api/product/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send("No product selected");
      }

      const updateProduct: Product = {
        ...req.body,
        updatedAt: new Date(),
      };

      const result = await productCollection.updateOne(
        { _id: new ObjectId(id as string) },
        {
          $set: updateProduct,
        },
      );

      res.status(202).json({
        message: "Product updated successfully",
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Product updated failed",

        success: false,
      });
    }
  });
  //  delete product
  app.delete("/api/product/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send("No product selected");
      }

      const result = await productCollection.deleteOne({
        _id: new ObjectId(id as string),
      });

      res.status(202).json({
        message: "Product deleted successfully",
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Product deleted failed",

        success: false,
      });
    }
  });

  
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
