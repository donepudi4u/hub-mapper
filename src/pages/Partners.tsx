import { useState } from "react";
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
import { PartnerForm } from "@/components/PartnerForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

// Mock data - replace with API calls
const mockPartners = [
  { 
    id: 1, 
    merchant_number: "MER001", 
    name: "TechCorp Solutions", 
    partner_id: "TECH001", 
    client_id: "CLIENT_TECH_001", 
    status: "active" 
  },
  { 
    id: 2, 
    merchant_number: "MER002", 
    name: "Digital Innovations", 
    partner_id: "DIGI001", 
    client_id: "CLIENT_DIGI_001", 
    status: "active" 
  },
  { 
    id: 3, 
    merchant_number: "MER003", 
    name: "Global Systems", 
    partner_id: "GLOB001", 
    client_id: "CLIENT_GLOB_001", 
    status: "inactive" 
  },
];

const Partners = () => {
  const [partners, setPartners] = useState(mockPartners);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deletePartner, setDeletePartner] = useState(null);

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.merchant_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.partner_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  };

  const handleDelete = (partner) => {
    setDeletePartner(partner);
  };

  const confirmDelete = () => {
    if (deletePartner) {
      setPartners(partners.filter(p => p.id !== deletePartner.id));
      setDeletePartner(null);
    }
  };

  const handleSave = (partnerData) => {
    if (editingPartner) {
      // Update existing partner
      setPartners(partners.map(p => 
        p.id === editingPartner.id 
          ? { ...p, ...partnerData }
          : p
      ));
    } else {
      // Add new partner
      const newPartner = {
        id: Math.max(...partners.map(p => p.id)) + 1,
        ...partnerData
      };
      setPartners([...partners, newPartner]);
    }
    setShowForm(false);
    setEditingPartner(null);
  };

  const toggleStatus = (partnerId) => {
    setPartners(partners.map(p => 
      p.id === partnerId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
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
                <TableHead>Name</TableHead>
                <TableHead>Merchant Number</TableHead>
                <TableHead>Partner ID</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.merchant_number}</TableCell>
                  <TableCell className="font-mono text-sm">{partner.partner_id}</TableCell>
                  <TableCell className="font-mono text-sm">{partner.client_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={partner.status === 'active'}
                        onCheckedChange={() => toggleStatus(partner.id)}
                      />
                      <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
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