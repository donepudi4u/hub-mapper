import api from './api';
import { toast } from '@/hooks/use-toast';

export interface Event {
  id: number;
  name: string;
  description: string;
}

export interface EventFormData {
  name: string;
  description: string;
}

export const eventsService = {
  // Get all events
  async getEvents(): Promise<Event[]> {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Get event by ID
  async getEvent(id: number): Promise<Event> {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      toast({
        title: "Error",
        description: "Failed to fetch event",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Create new event
  async createEvent(eventData: EventFormData): Promise<Event> {
    try {
      const response = await api.post('/events', eventData);
      toast({
        title: "Success",
        description: "Event created successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Update event
  async updateEvent(id: number, eventData: EventFormData): Promise<Event> {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      toast({
        title: "Success",
        description: "Event updated successfully"
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive"
      });
      throw error;
    }
  },

  // Delete event
  async deleteEvent(id: number): Promise<void> {
    try {
      await api.delete(`/events/${id}`);
      toast({
        title: "Success",
        description: "Event deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      });
      throw error;
    }
  }
};