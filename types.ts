import type { ObjectId } from "mongodb";

export interface User {
  _id: string;
  name: string;
  image?: string | null;
  email: string;
  createdAt?: Date;
}

export interface Product {
  _id: string | ObjectId;
  title:string,
  description: string;
  price: number;
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair" | "Used";
  images: string[];
  location: string;
  sellerWhatsapp?: string;
  sellerId?: string;
  sellerName?: string;
  sellerImage?: string;
  status?: "available" | "sold";
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Wishlist {
  _id?: string;
  userId: string;
  productId: string;
  createdAt?: Date;
}

