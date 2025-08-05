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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const subscriptionSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  product_id: z.string().min(1, "Product is required"),
  event_id: z.string().min(1, "Event is required"),
  status: z.enum(["active", "inactive"]),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

// Mock data - replace with API calls
const mockPartners = [
  { id: "1", name: "TechCorp Solutions" },
  { id: "2", name: "Digital Innovations" },
  { id: "3", name: "Global Systems" },
];

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

export const SubscriptionForm = ({ open, onOpenChange, onSave }: SubscriptionFormProps) => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState("");
  
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      partner_id: "",
      product_id: "",
      event_id: "",
      status: "active",
    },
  });

  const availableEvents = mockEvents; // In real app, filter by product

  const onSubmit = (data: SubscriptionFormData) => {
    // In real app, would need to find the product_event_id from the backend
    const subscriptionData = {
      product_event_id: 1, // This would be looked up
      status: data.status,
    };
    onSave(subscriptionData);
    toast({
      title: "Subscription created",
      description: "Partner subscription has been created successfully.",
    });
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
          <DialogDescription>
            Create a new partner subscription to a product event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="partner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a partner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
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
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedProduct(value);
                      form.setValue("event_id", ""); // Reset event selection
                    }} 
                    defaultValue={field.value}
                  >
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
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!selectedProduct}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedProduct ? "Select a product first" : "Select an event"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableEvents.map((event) => (
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                Create Subscription
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};