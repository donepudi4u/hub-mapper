import api from './api';
import { toast } from '@/hooks/use-toast';

export interface Product {
  id: number;
  name: string;
  description: string;
}

export interface ProductFormData {
  name: string;
  description: string;
}

export const productsService = {
  // Get all products
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Get product by ID
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Create new product
  async createProduct(productData: ProductFormData): Promise<Product> {
    try {
      const response = await api.post('/products', productData);
      toast({
        title: "Success",
        description: "Product created successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Update product
  async updateProduct(id: number, productData: ProductFormData): Promise<Product> {
    try {
      const response = await api.put(`/products/${id}`, productData);
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
      throw error;
    }
  }
};