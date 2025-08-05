import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const productEventSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  event_id: z.string().min(1, "Event is required"),
  order: z.number().min(1, "Order must be at least 1"),
});

type ProductEventFormData = z.infer<typeof productEventSchema>;

interface ProductEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

// Mock data - replace with API calls
const mockProducts = [
  { id: "1", name: "Premium Service" },
  { id: "2", name: "Basic Plan" },
  { id: "3", name: "Enterprise Solution" },
];

const mockEvents = [
  { id: "1", name: "Product Launch" },
  { id: "2", name: "User Training" },
  { id: "3", name: "Maintenance Window" },
];

export const ProductEventForm = ({ open, onOpenChange, onSave }: ProductEventFormProps) => {
  const { toast } = useToast();
  const form = useForm<ProductEventFormData>({
    resolver: zodResolver(productEventSchema),
    defaultValues: {
      product_id: "",
      event_id: "",
      order: 1,
    },
  });

  const onSubmit = (data: ProductEventFormData) => {
    onSave({
      product_id: parseInt(data.product_id),
      event_id: parseInt(data.event_id),
      order: data.order,
    });
    toast({
      title: "Mapping created",
      description: "Product-event mapping has been created successfully.",
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product-Event Mapping</DialogTitle>
          <DialogDescription>
            Create a new mapping between a product and an event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="1" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                Create Mapping
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};