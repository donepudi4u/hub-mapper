import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  MoreHorizontal,
  Loader2,
  ArrowUpDown
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
import { PartnerForm } from "@/components/PartnerForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { partnersService, Partner } from "@/services/partnersService";

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletePartner, setDeletePartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Partner>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  // Load partners on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await partnersService.getPartners();
      setPartners(data);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.merchant_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.partner_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPartners = [...filteredPartners].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPartners.length / itemsPerPage);
  const paginatedPartners = sortedPartners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Partner) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  };

  const handleDelete = (partner: Partner) => {
    setDeletePartner(partner);
  };

  const confirmDelete = async () => {
    if (deletePartner && !actionLoading) {
      try {
        setActionLoading(true);
        await partnersService.deletePartner(deletePartner.id);
        setPartners(partners.filter(p => p.id !== deletePartner.id));
        setDeletePartner(null);
      } catch (error) {
        console.error('Failed to delete partner:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (partnerData: any) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      if (editingPartner) {
        // Update existing partner
        const updatedPartner = await partnersService.updatePartner(editingPartner.id, partnerData);
        setPartners(partners.map(p => 
          p.id === editingPartner.id ? updatedPartner : p
        ));
      } else {
        // Add new partner
        const newPartner = await partnersService.createPartner(partnerData);
        setPartners([...partners, newPartner]);
      }
      setShowForm(false);
      setEditingPartner(null);
    } catch (error) {
      console.error('Failed to save partner:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (partnerId: number) => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner || actionLoading) return;

    const newStatus = partner.status === 'Active' ? 'Inactive' : 'Active';
    try {
      setActionLoading(true);
      const updatedPartner = await partnersService.updatePartnerStatus(partnerId, newStatus);
      setPartners(partners.map(p => 
        p.id === partnerId ? updatedPartner : p
      ));
    } catch (error) {
      console.error('Failed to update partner status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partners</h1>
          <p className="text-muted-foreground">
            Manage your business partners and their access
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingPartner(null);
            setShowForm(true);
          }}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Partners ({filteredPartners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('merchant_number')}
                >
                  <div className="flex items-center">
                    Merchant Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('partner_id')}
                >
                  <div className="flex items-center">
                    Partner ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.merchant_number}</TableCell>
                  <TableCell className="font-mono text-sm">{partner.partner_id}</TableCell>
                  <TableCell className="font-mono text-sm">{partner.client_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={partner.status === 'Active'}
                        onCheckedChange={() => toggleStatus(partner.id)}
                        disabled={actionLoading}
                      />
                      <Badge variant={partner.status === 'Active' ? 'default' : 'secondary'}>
                        {partner.status}
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
                        <DropdownMenuItem onClick={() => handleEdit(partner)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(partner)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Partner Form Modal */}
      <PartnerForm
        open={showForm}
        onOpenChange={setShowForm}
        partner={editingPartner}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletePartner}
        onOpenChange={() => setDeletePartner(null)}
        onConfirm={confirmDelete}
        title="Delete Partner"
        description={`Are you sure you want to delete "${deletePartner?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Partners;