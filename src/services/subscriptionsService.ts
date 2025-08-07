import api from './api';
import { toast } from '@/hooks/use-toast';

export interface Subscription {
  id: number;
  product_event_id: number;
  partner_id: number;
  status: 'ACTIVE' | 'INACTIVE';
  partner?: {
    id: number;
    name: string;
    merchant_number: string;
  };
  product_event?: {
    id: number;
    product?: {
      id: number;
      name: string;
    };
    event?: {
      id: number;
      name: string;
    };
  };
}

export interface SubscriptionFormData {
  product_event_id: number;
  partner_id: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export const subscriptionsService = {
  // Get all subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await api.get('/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Get subscriptions by partner
  async getSubscriptionsByPartner(partnerId: number): Promise<Subscription[]> {
    try {
      const response = await api.get(`/partners/${partnerId}/subscriptions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching partner subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch partner subscriptions",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Get subscription by ID
  async getSubscription(id: number): Promise<Subscription> {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Create new subscription
  async createSubscription(subscriptionData: SubscriptionFormData): Promise<Subscription> {
    try {
      const response = await api.post('/subscriptions', subscriptionData);
      toast({
        title: "Success",
        description: "Subscription created successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Update subscription
  async updateSubscription(id: number, subscriptionData: SubscriptionFormData): Promise<Subscription> {
    try {
      const response = await api.put(`/subscriptions/${id}`, subscriptionData);
      toast({
        title: "Success",
        description: "Subscription updated successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Delete subscription
  async deleteSubscription(id: number): Promise<void> {
    try {
      await api.delete(`/subscriptions/${id}`);
      toast({
        title: "Success",
        description: "Subscription deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Update subscription status
  async updateSubscriptionStatus(id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<Subscription> {
    try {
      const response = await api.patch(`/subscriptions/${id}/status`, { status });
      toast({
        title: "Success",
        description: `Subscription ${status.toLowerCase()} successfully`
      });
      return response.data;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive"
      });
      throw error;
    }
  }
};