import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
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
import { ProductEventForm } from "@/components/ProductEventForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { productEventsService, ProductEvent } from "@/services/productEventsService";

const ProductEvents = () => {
  const [productEvents, setProductEvents] = useState<ProductEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProductEvent, setEditingProductEvent] = useState<ProductEvent | null>(null);
  const [deleteProductEvent, setDeleteProductEvent] = useState<ProductEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'product_name' | 'event_name' | 'order'>('order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  // Load product events on component mount
  useEffect(() => {
    fetchProductEvents();
  }, []);

  const fetchProductEvents = async () => {
    try {
      setLoading(true);
      const data = await productEventsService.getProductEvents();
      setProductEvents(data);
    } catch (error) {
      console.error('Failed to fetch product events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProductEvents = productEvents.filter(pe =>
    pe.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pe.event?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (productEvent: ProductEvent) => {
    setEditingProductEvent(productEvent);
    setShowForm(true);
  };

  const handleDelete = (productEvent: ProductEvent) => {
    setDeleteProductEvent(productEvent);
  };

  const confirmDelete = async () => {
    if (deleteProductEvent && !actionLoading) {
      try {
        setActionLoading(true);
        await productEventsService.deleteProductEvent(deleteProductEvent.id);
        setProductEvents(productEvents.filter(pe => pe.id !== deleteProductEvent.id));
        setDeleteProductEvent(null);
      } catch (error) {
        console.error('Failed to delete product event:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (productEventData: any) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      if (editingProductEvent) {
        // Update existing product event
        const updatedProductEvent = await productEventsService.updateProductEvent(editingProductEvent.id, productEventData);
        setProductEvents(productEvents.map(pe => 
          pe.id === editingProductEvent.id ? updatedProductEvent : pe
        ));
      } else {
        // Add new product event
        const newProductEvent = await productEventsService.createProductEvent(productEventData);
        setProductEvents([...productEvents, newProductEvent]);
      }
      setShowForm(false);
      setEditingProductEvent(null);
    } catch (error) {
      console.error('Failed to save product event:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const moveOrder = async (productEventId: number, direction: 'up' | 'down') => {
    const productEvent = productEvents.find(pe => pe.id === productEventId);
    if (!productEvent || actionLoading) return;

    const newOrder = direction === 'up' ? productEvent.order - 1 : productEvent.order + 1;
    if (newOrder < 1) return;

    try {
      setActionLoading(true);
      const updatedProductEvent = await productEventsService.updateProductEventOrder(productEventId, newOrder);
      setProductEvents(productEvents.map(pe => 
        pe.id === productEventId ? updatedProductEvent : pe
      ));
    } catch (error) {
      console.error('Failed to update product event order:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Events</h1>
          <p className="text-muted-foreground">
            Manage product-event mappings and their order
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingProductEvent(null);
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
          Add Mapping
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search product events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="mr-2 h-5 w-5" />
            Product Events ({filteredProductEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading product events...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductEvents.map((productEvent) => (
                  <TableRow key={productEvent.id}>
                    <TableCell className="font-medium">
                      {productEvent.product?.name || `Product ${productEvent.product_id}`}
                    </TableCell>
                    <TableCell>
                      {productEvent.event?.name || `Event ${productEvent.event_id}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{productEvent.order}</Badge>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveOrder(productEvent.id, 'up')}
                            disabled={actionLoading}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveOrder(productEvent.id, 'down')}
                            disabled={actionLoading}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
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
                          <DropdownMenuItem onClick={() => handleEdit(productEvent)}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Edit Mapping
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(productEvent)}
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

      {/* Product Event Form Modal */}
      <ProductEventForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteProductEvent}
        onOpenChange={() => setDeleteProductEvent(null)}
        onConfirm={confirmDelete}
        title="Delete Product Event Mapping"
        description={`Are you sure you want to delete this product-event mapping? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProductEvents;