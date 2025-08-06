import api from './api';
import { toast } from '@/hooks/use-toast';

export interface Partner {
  id: number;
  merchant_number: string;
  name: string;
  partner_id: string;
  client_id: string;
  status: 'Active' | 'Inactive';
}

export interface PartnerFormData {
  merchant_number: string;
  name: string;
  partner_id: string;
  client_id: string;
  status: 'Active' | 'Inactive';
}

export const partnersService = {
  // Get all partners
  async getPartners(): Promise<Partner[]> {
    try {
      const response = await api.get('/partners');
      return response.data;
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch partners",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Get partner by ID
  async getPartner(id: number): Promise<Partner> {
    try {
      const response = await api.get(`/partners/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching partner:', error);
      toast({
        title: "Error",
        description: "Failed to fetch partner",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Create new partner
  async createPartner(partnerData: PartnerFormData): Promise<Partner> {
    try {
      const response = await api.post('/partners', partnerData);
      toast({
        title: "Success",
        description: "Partner created successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error creating partner:', error);
      toast({
        title: "Error",
        description: "Failed to create partner",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Update partner
  async updatePartner(id: number, partnerData: PartnerFormData): Promise<Partner> {
    try {
      const response = await api.put(`/partners/${id}`, partnerData);
      toast({
        title: "Success",
        description: "Partner updated successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: "Error",
        description: "Failed to update partner",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Delete partner
  async deletePartner(id: number): Promise<void> {
    try {
      await api.delete(`/partners/${id}`);
      toast({
        title: "Success",
        description: "Partner deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: "Error",
        description: "Failed to delete partner",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Update partner status
  async updatePartnerStatus(id: number, status: 'Active' | 'Inactive'): Promise<Partner> {
    try {
      const response = await api.patch(`/partners/${id}/status`, { status });
      toast({
        title: "Success",
        description: `Partner ${status.toLowerCase()} successfully`
      });
      return response.data;
    } catch (error) {
      console.error('Error updating partner status:', error);
      toast({
        title: "Error",
        description: "Failed to update partner status",
        variant: "destructive"
      });
      throw error;
    }
  }
};