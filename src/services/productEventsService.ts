import api from './api';
import { toast } from '@/hooks/use-toast';

export interface ProductEvent {
  id: number;
  product_id: number;
  event_id: number;
  order: number;
  product?: {
    id: number;
    name: string;
    description: string;
  };
  event?: {
    id: number;
    name: string;
    description: string;
  };
}

export interface ProductEventFormData {
  product_id: number;
  event_id: number;
  order: number;
}

export const productEventsService = {
  // Get all product events
  async getProductEvents(): Promise<ProductEvent[]> {
    try {
      const response = await api.get('/product-events');
      return response.data;
    } catch (error) {
      console.error('Error fetching product events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product events",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Get product events by product ID
  async getProductEventsByProduct(productId: number): Promise<ProductEvent[]> {
    try {
      const response = await api.get(`/products/${productId}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product events",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Get product event by ID
  async getProductEvent(id: number): Promise<ProductEvent> {
    try {
      const response = await api.get(`/product-events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product event:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product event",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Create new product event mapping
  async createProductEvent(productEventData: ProductEventFormData): Promise<ProductEvent> {
    try {
      const response = await api.post('/product-events', productEventData);
      toast({
        title: "Success",
        description: "Product event mapping created successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product event:', error);
      toast({
        title: "Error",
        description: "Failed to create product event mapping",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Update product event
  async updateProductEvent(id: number, productEventData: ProductEventFormData): Promise<ProductEvent> {
    try {
      const response = await api.put(`/product-events/${id}`, productEventData);
      toast({
        title: "Success",
        description: "Product event mapping updated successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product event:', error);
      toast({
        title: "Error",
        description: "Failed to update product event mapping",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Delete product event
  async deleteProductEvent(id: number): Promise<void> {
    try {
      await api.delete(`/product-events/${id}`);
      toast({
        title: "Success",
        description: "Product event mapping deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting product event:', error);
      toast({
        title: "Error",
        description: "Failed to delete product event mapping",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Update product event order
  async updateProductEventOrder(id: number, order: number): Promise<ProductEvent> {
    try {
      const response = await api.patch(`/product-events/${id}/order`, { order });
      toast({
        title: "Success",
        description: "Product event order updated successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product event order:', error);
      toast({
        title: "Error",
        description: "Failed to update product event order",
        variant: "destructive"
      });
      throw error;
    }
  }
};