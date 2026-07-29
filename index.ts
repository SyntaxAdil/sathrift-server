// server/src/index.ts
import dns from 'node:dns';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { type Product, type Wishlist } from './types';

dns.setServers(['8.8.8.8', '8.8.4.4']);
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
  await client.connect();

  const db = client.db('sathrift');
  const productCollection = db.collection<Product>('products');
  const wishlistCollection = db.collection<Wishlist>('wishlists');

  app.post('/api/product', async (req: Request, res: Response) => {
    try {
      const newProduct: Product = {
        ...req.body,
        status: 'available',
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await productCollection.insertOne(newProduct);

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Product added failed',
      });
    }
  });

  app.get('/api/product', async (req: Request, res: Response) => {
    try {
      const { title, category } = req.query;

      const query: any = {};

      if (title) {
        query.$or = [
          { title: { $regex: title as string, $options: 'i' } },
          { description: { $regex: title as string, $options: 'i' } },
        ];
      }

      if (category) {
        query.category = category;
      }

      const result = await productCollection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Products fetched failed',
      });
    }
  });

  app.get('/api/product/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await productCollection.updateOne(
        { _id: new ObjectId(id as string) },
        { $inc: { views: 1 } }
      );

      const result = await productCollection.findOne({
        _id: new ObjectId(id as string),
      });

      res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
        data: result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Product fetched failed',
      });
    }
  });

  app.patch('/api/product/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const updateProduct = {
        ...req.body,
        updatedAt: new Date(),
      };

      const result = await productCollection.updateOne(
        { _id: new ObjectId(id as string) },
        { $set: updateProduct }
      );

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Product updated failed',
      });
    }
  });

  app.patch('/api/product/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await productCollection.updateOne(
        { _id: new ObjectId(id as string) },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        }
      );

      res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        data: result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Status update failed',
      });
    }
  });

  app.delete('/api/product/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const result = await productCollection.deleteOne({
        _id: new ObjectId(id as string),
      });

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Product deleted failed',
      });
    }
  });

  app.post('/api/wishlist/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const existing = await wishlistCollection.findOne({
        userId,
        productId: new ObjectId(id as string),
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Already wishlisted',
        });
      }

      const newWishlist: Wishlist = {
        userId,
        productId: new ObjectId(id as string),
        createdAt: new Date(),
      };

      const result = await wishlistCollection.insertOne(newWishlist);

      res.status(201).json({
        success: true,
        message: 'Product wishlisted successfully',
        data: result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Product wishlisted failed',
      });
    }
  });

  app.get('/api/wishlist', async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;

      const result = await wishlistCollection
        .aggregate([
          {
            $match: { userId },
          },
          {
            $lookup: {
              from: 'products',
              localField: 'productId',
              foreignField: '_id',
              as: 'product',
            },
          },
          {
            $unwind: '$product',
          },
        ])
        .toArray();

      res.status(200).json({
        success: true,
        message: 'Wishlist fetched successfully',
        data: result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Wishlist fetched failed',
      });
    }
  });

  app.delete('/api/wishlist/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      await wishlistCollection.deleteOne({
        userId,
        productId: new ObjectId(id as string),
      });

      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist',
      });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Failed to remove from wishlist',
      });
    }
  });

  await wishlistCollection.createIndex(
    { userId: 1, productId: 1 },
    { unique: true }
  );

  console.log('Database connected');
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;