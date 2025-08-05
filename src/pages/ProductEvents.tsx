import { useState } from "react";
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
import { ProductEventForm } from "@/components/ProductEventForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

// Mock data - replace with API calls
const mockProductEvents = [
  { 
    id: 1, 
    product_id: 1, 
    event_id: 1, 
    order: 1,
    product_name: "Premium Service",
    event_name: "Product Launch"
  },
  { 
    id: 2, 
    product_id: 1, 
    event_id: 2, 
    order: 2,
    product_name: "Premium Service",
    event_name: "User Training"
  },
  { 
    id: 3, 
    product_id: 2, 
    event_id: 1, 
    order: 1,
    product_name: "Basic Plan",
    event_name: "Product Launch"
  },
];

const ProductEvents = () => {
  const [productEvents, setProductEvents] = useState(mockProductEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteMapping, setDeleteMapping] = useState(null);

  const filteredMappings = productEvents.filter(mapping =>
    mapping.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (mapping) => {
    setDeleteMapping(mapping);
  };

  const confirmDelete = () => {
    if (deleteMapping) {
      setProductEvents(productEvents.filter(pe => pe.id !== deleteMapping.id));
      setDeleteMapping(null);
    }
  };

  const handleSave = (mappingData) => {
    const newMapping = {
      id: Math.max(...productEvents.map(pe => pe.id)) + 1,
      ...mappingData,
      // These would come from API lookups in real implementation
      product_name: "Product Name",
      event_name: "Event Name"
    };
    setProductEvents([...productEvents, newMapping]);
    setShowForm(false);
  };

  const moveOrder = (mappingId, direction) => {
    const mapping = productEvents.find(pe => pe.id === mappingId);
    if (!mapping) return;

    const sameProductMappings = productEvents
      .filter(pe => pe.product_id === mapping.product_id)
      .sort((a, b) => a.order - b.order);

    const currentIndex = sameProductMappings.findIndex(pe => pe.id === mappingId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sameProductMappings.length) return;

    const updatedMappings = [...productEvents];
    const currentMapping = updatedMappings.find(pe => pe.id === mappingId);
    const swapMapping = updatedMappings.find(pe => pe.id === sameProductMappings[newIndex].id);

    if (currentMapping && swapMapping) {
      const tempOrder = currentMapping.order;
      currentMapping.order = swapMapping.order;
      swapMapping.order = tempOrder;
    }

    setProductEvents(updatedMappings);
  };

  // Group mappings by product
  const groupedMappings = filteredMappings.reduce((acc, mapping) => {
    const productName = mapping.product_name;
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push(mapping);
    return acc;
  }, {} as Record<string, typeof mockProductEvents>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product-Event Mappings</h1>
          <p className="text-muted-foreground">
            Manage event associations and their order for each product
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
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
                placeholder="Search by product or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mappings by Product */}
      <div className="space-y-6">
        {Object.entries(groupedMappings).map(([productName, mappings]) => (
          <Card key={productName}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-2 h-5 w-5" />
                {productName} ({mappings.length} events)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings
                    .sort((a, b) => a.order - b.order)
                    .map((mapping, index) => (
                    <TableRow key={mapping.id}>
                      <TableCell>
                        <Badge variant="outline">#{mapping.order}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{mapping.event_name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveOrder(mapping.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveOrder(mapping.id, 'down')}
                            disabled={index === mappings.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleDelete(mapping)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Mapping
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Event Form Modal */}
      <ProductEventForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteMapping}
        onOpenChange={() => setDeleteMapping(null)}
        onConfirm={confirmDelete}
        title="Remove Mapping"
        description={`Are you sure you want to remove the mapping between "${deleteMapping?.product_name}" and "${deleteMapping?.event_name}"?`}
      />
    </div>
  );
};

export default ProductEvents;