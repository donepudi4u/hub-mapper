import { useState, useEffect } from "react";
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
  MoreHorizontal,
  Loader2
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { subscriptionsService, Subscription } from "@/services/subscriptionsService";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deleteSubscription, setDeleteSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'partner_name' | 'product_name' | 'event_name' | 'status'>('partner_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  // Load subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionsService.getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.partner?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.product_event?.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.product_event?.event?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleDelete = (subscription: Subscription) => {
    setDeleteSubscription(subscription);
  };

  const confirmDelete = async () => {
    if (deleteSubscription && !actionLoading) {
      try {
        setActionLoading(true);
        await subscriptionsService.deleteSubscription(deleteSubscription.id);
        setSubscriptions(subscriptions.filter(s => s.id !== deleteSubscription.id));
        setDeleteSubscription(null);
      } catch (error) {
        console.error('Failed to delete subscription:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (subscriptionData: any) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      if (editingSubscription) {
        // Update existing subscription
        const updatedSubscription = await subscriptionsService.updateSubscription(editingSubscription.id, subscriptionData);
        setSubscriptions(subscriptions.map(s => 
          s.id === editingSubscription.id ? updatedSubscription : s
        ));
      } else {
        // Add new subscription
        const newSubscription = await subscriptionsService.createSubscription(subscriptionData);
        setSubscriptions([...subscriptions, newSubscription]);
      }
      setShowForm(false);
      setEditingSubscription(null);
    } catch (error) {
      console.error('Failed to save subscription:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (subscriptionId: number) => {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (!subscription || actionLoading) return;

    const newStatus = subscription.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setActionLoading(true);
      const updatedSubscription = await subscriptionsService.updateSubscriptionStatus(subscriptionId, newStatus);
      setSubscriptions(subscriptions.map(s => 
        s.id === subscriptionId ? updatedSubscription : s
      ));
    } catch (error) {
      console.error('Failed to update subscription status:', error);
    } finally {
      setActionLoading(false);
    }
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
          onClick={() => {
            setEditingSubscription(null);
            setShowForm(true);
          }}
          className="bg-gradient-primary hover:opacity-90"
          disabled={actionLoading}
        >
          {actionLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading subscriptions...</span>
            </div>
          ) : (
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
                    <TableCell className="font-medium">
                      {subscription.partner?.name || `Partner ${subscription.partner_id}`}
                    </TableCell>
                    <TableCell>
                      {subscription.product_event?.product?.name || 'Unknown Product'}
                    </TableCell>
                    <TableCell>
                      {subscription.product_event?.event?.name || 'Unknown Event'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={subscription.status === 'ACTIVE'}
                          onCheckedChange={() => toggleStatus(subscription.id)}
                          disabled={actionLoading}
                        />
                        <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'}>
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
                          <DropdownMenuItem onClick={() => handleEdit(subscription)}>
                            <Zap className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
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
          )}
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