export interface Product {
    id?: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    category?: string;
    userId: string;
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface CreateProductInput {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    category?: string;
  }