import { useState, useEffect } from "react";
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
import { partnersService } from "@/services/partnersService";
import { productsService } from "@/services/productsService";
import { eventsService } from "@/services/eventsService";
import { productEventsService } from "@/services/productEventsService";
import { Loader2 } from "lucide-react";

const subscriptionSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  product_event_id: z.string().min(1, "Product Event is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

interface Partner {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface Event {
  id: number;
  name: string;
}

interface ProductEvent {
  id: number;
  product?: Product;
  event?: Event;
}

export const SubscriptionForm = ({ open, onOpenChange, onSave }: SubscriptionFormProps) => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [productEvents, setProductEvents] = useState<ProductEvent[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      partner_id: "",
      product_event_id: "",
      status: "ACTIVE",
    },
  });

  // Load partners and product events when dialog opens
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [partnersData, productEventsData] = await Promise.all([
        partnersService.getPartners(),
        productEventsService.getProductEvents()
      ]);
      setPartners(partnersData);
      setProductEvents(productEventsData);
    } catch (error) {
      console.error('Failed to load form data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: SubscriptionFormData) => {
    const subscriptionData = {
      partner_id: parseInt(data.partner_id),
      product_event_id: parseInt(data.product_event_id),
      status: data.status,
    };
    onSave(subscriptionData);
    form.reset();
    onOpenChange(false);
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
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading data...</span>
          </div>
        ) : (
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
                        {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id.toString()}>
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
                name="product_event_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Event</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productEvents.map((productEvent) => (
                          <SelectItem key={productEvent.id} value={productEvent.id.toString()}>
                            {productEvent.product?.name || 'Unknown Product'} - {productEvent.event?.name || 'Unknown Event'}
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
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
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
        )}
      </DialogContent>
    </Dialog>
  );
};