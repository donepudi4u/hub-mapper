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
import { productsService, Product } from "@/services/productsService";
import { eventsService, Event } from "@/services/eventsService";
import { Loader2 } from "lucide-react";

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

export const ProductEventForm = ({ open, onOpenChange, onSave }: ProductEventFormProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products and events on component mount
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, eventsData] = await Promise.all([
        productsService.getProducts(),
        eventsService.getEvents()
      ]);
      setProducts(productsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: "Error",
        description: "Failed to load products and events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
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
                       {loading ? (
                         <div className="flex items-center justify-center p-2">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span className="ml-2">Loading...</span>
                         </div>
                       ) : (
                         products.map((product) => (
                           <SelectItem key={product.id} value={product.id.toString()}>
                             {product.name}
                           </SelectItem>
                         ))
                       )}
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
                       {loading ? (
                         <div className="flex items-center justify-center p-2">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span className="ml-2">Loading...</span>
                         </div>
                       ) : (
                         events.map((event) => (
                           <SelectItem key={event.id} value={event.id.toString()}>
                             {event.name}
                           </SelectItem>
                         ))
                       )}
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