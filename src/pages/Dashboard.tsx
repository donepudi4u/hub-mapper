import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, Users, Zap, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-dashboard.jpg";
import { productsService } from "@/services/productsService";
import { eventsService } from "@/services/eventsService";
import { partnersService } from "@/services/partnersService";
import { subscriptionsService } from "@/services/subscriptionsService";

interface DashboardStats {
  title: string;
  value: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [products, events, partners, subscriptions] = await Promise.all([
        productsService.getProducts(),
        eventsService.getEvents(),
        partnersService.getPartners(),
        subscriptionsService.getSubscriptions()
      ]);

      const activeSubscriptions = subscriptions.filter(sub => sub.status === 'ACTIVE');

      const dashboardStats: DashboardStats[] = [
        {
          title: "Total Products",
          value: products.length.toString(),
          description: "Active products in system",
          icon: Package,
          href: "/products",
          color: "text-blue-600"
        },
        {
          title: "Total Events",
          value: events.length.toString(),
          description: "Available events",
          icon: Calendar,
          href: "/events",
          color: "text-green-600"
        },
        {
          title: "Partners",
          value: partners.length.toString(),
          description: "Registered partners",
          icon: Users,
          href: "/partners",
          color: "text-purple-600"
        },
        {
          title: "Active Subscriptions",
          value: activeSubscriptions.length.toString(),
          description: "Partner subscriptions",
          icon: Zap,
          href: "/subscriptions",
          color: "text-orange-600"
        }
      ];

      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set default empty stats on error
      setStats([
        {
          title: "Total Products",
          value: "0",
          description: "Active products in system",
          icon: Package,
          href: "/products",
          color: "text-blue-600"
        },
        {
          title: "Total Events",
          value: "0",
          description: "Available events",
          icon: Calendar,
          href: "/events",
          color: "text-green-600"
        },
        {
          title: "Partners",
          value: "0",
          description: "Registered partners",
          icon: Users,
          href: "/partners",
          color: "text-purple-600"
        },
        {
          title: "Active Subscriptions",
          value: "0",
          description: "Partner subscriptions",
          icon: Zap,
          href: "/subscriptions",
          color: "text-orange-600"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Product Manager
          </h1>
          <p className="text-xl opacity-90 mb-6 max-w-2xl">
            Manage your products, events, partners, and subscriptions all in one place. 
            Get insights and streamline your business operations.
          </p>
          <div className="flex gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/products">Manage Products</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link to="/subscriptions">View Subscriptions</Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20" />
        <img 
          src={heroImage} 
          alt="Dashboard" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded mb-4" />
                <div className="h-8 w-full bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
            <Card key={stat.title} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground mb-4">
                  {stat.description}
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={stat.href}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/products">
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/events">
                <Calendar className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/partners">
                <Users className="mr-2 h-4 w-4" />
                Register Partner
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New partner registered</p>
                  <p className="text-xs text-muted-foreground">TechCorp added as partner</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Product updated</p>
                  <p className="text-xs text-muted-foreground">Premium Service v2.0 released</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Event scheduled</p>
                  <p className="text-xs text-muted-foreground">Monthly sync meeting created</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;