import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
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
import { EventForm } from "@/components/EventForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

// Mock data - replace with API calls
const mockEvents = [
  { id: 1, name: "Product Launch", description: "Official product launch event" },
  { id: 2, name: "User Training", description: "Training session for new users" },
  { id: 3, name: "Maintenance Window", description: "Scheduled system maintenance" },
  { id: 4, name: "Feature Update", description: "Rollout of new features" },
];

const Events = () => {
  const [events, setEvents] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (event) => {
    setDeleteEvent(event);
  };

  const confirmDelete = () => {
    if (deleteEvent) {
      setEvents(events.filter(e => e.id !== deleteEvent.id));
      setDeleteEvent(null);
    }
  };

  const handleSave = (eventData) => {
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...e, ...eventData }
          : e
      ));
    } else {
      // Add new event
      const newEvent = {
        id: Math.max(...events.map(e => e.id)) + 1,
        ...eventData
      };
      setEvents([...events, newEvent]);
    }
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage your events and activities
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Events ({filteredEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground truncate">
                      {event.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(event)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(event)}
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

      {/* Event Form Modal */}
      <EventForm
        open={showForm}
        onOpenChange={setShowForm}
        event={editingEvent}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteEvent}
        onOpenChange={() => setDeleteEvent(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        description={`Are you sure you want to delete "${deleteEvent?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Events;