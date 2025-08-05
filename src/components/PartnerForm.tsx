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

const partnerSchema = z.object({
  merchant_number: z.string().min(1, "Merchant number is required"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  partner_id: z.string().min(1, "Partner ID is required"),
  client_id: z.string().min(1, "Client ID is required"),
  status: z.enum(["active", "inactive"]),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

interface PartnerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner?: any;
  onSave: (data: PartnerFormData) => void;
}

export const PartnerForm = ({ open, onOpenChange, partner, onSave }: PartnerFormProps) => {
  const { toast } = useToast();
  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      merchant_number: "",
      name: "",
      partner_id: "",
      client_id: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (partner) {
      form.reset({
        merchant_number: partner.merchant_number,
        name: partner.name,
        partner_id: partner.partner_id,
        client_id: partner.client_id,
        status: partner.status,
      });
    } else {
      form.reset({
        merchant_number: "",
        name: "",
        partner_id: "",
        client_id: "",
        status: "active",
      });
    }
  }, [partner, form]);

  const onSubmit = (data: PartnerFormData) => {
    onSave(data);
    toast({
      title: partner ? "Partner updated" : "Partner created",
      description: partner 
        ? `${data.name} has been updated successfully.`
        : `${data.name} has been created successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{partner ? "Edit Partner" : "Add Partner"}</DialogTitle>
          <DialogDescription>
            {partner 
              ? "Make changes to the partner details below."
              : "Fill in the details to create a new partner."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="merchant_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merchant Number</FormLabel>
                    <FormControl>
                      <Input placeholder="MER001" {...field} />
                    </FormControl>
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
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter partner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner ID</FormLabel>
                  <FormControl>
                    <Input placeholder="PARTNER001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input placeholder="CLIENT_001" {...field} />
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
                {partner ? "Update Partner" : "Create Partner"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};