import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Zap,
  Trash2,
  MoreHorizontal 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

// Mock data - replace with API calls
const mockSubscriptions = [
  { 
    id: 1, 
    product_event_id: 1, 
    status: "active",
    partner_name: "TechCorp Solutions",
    product_name: "Premium Service",
    event_name: "Product Launch"
  },
  { 
    id: 2, 
    product_event_id: 2, 
    status: "active",
    partner_name: "TechCorp Solutions",
    product_name: "Premium Service",
    event_name: "User Training"
  },
  { 
    id: 3, 
    product_event_id: 3, 
    status: "inactive",
    partner_name: "Digital Innovations",
    product_name: "Basic Plan",
    event_name: "Product Launch"
  },
];

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteSubscription, setDeleteSubscription] = useState(null);

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (subscription) => {
    setDeleteSubscription(subscription);
  };

  const confirmDelete = () => {
    if (deleteSubscription) {
      setSubscriptions(subscriptions.filter(s => s.id !== deleteSubscription.id));
      setDeleteSubscription(null);
    }
  };

  const handleSave = (subscriptionData) => {
    const newSubscription = {
      id: Math.max(...subscriptions.map(s => s.id)) + 1,
      ...subscriptionData,
      // These would come from API lookups in real implementation
      partner_name: "Partner Name",
      product_name: "Product Name",
      event_name: "Event Name"
    };
    setSubscriptions([...subscriptions, newSubscription]);
    setShowForm(false);
  };

  const toggleStatus = (subscriptionId) => {
    setSubscriptions(subscriptions.map(s => 
      s.id === subscriptionId 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage partner subscriptions to product events
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Subscriptions ({filteredSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.partner_name}</TableCell>
                  <TableCell>{subscription.product_name}</TableCell>
                  <TableCell>{subscription.event_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={subscription.status === 'active'}
                        onCheckedChange={() => toggleStatus(subscription.id)}
                      />
                      <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                        {subscription.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleDelete(subscription)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subscription Form Modal */}
      <SubscriptionForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteSubscription}
        onOpenChange={() => setDeleteSubscription(null)}
        onConfirm={confirmDelete}
        title="Delete Subscription"
        description={`Are you sure you want to delete this subscription? This action cannot be undone.`}
      />
    </div>
  );
};

export default Subscriptions;