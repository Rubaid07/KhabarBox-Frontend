"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Package,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  ChefHat,
  Clock,
  Bike,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { getAllOrders, updateOrderStatus, cancelOrder } from "@/lib/api-admin";
import { formatDate } from "@/lib/utils";

type OrderStatus = "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

interface StatusItem {
  label: string;
  color: string;
  icon: LucideIcon;
}

const statusConfig: Record<OrderStatus, StatusItem> = {
  PLACED: { label: "Placed", color: "bg-blue-100 text-blue-800", icon: Package },
  PREPARING: { label: "Preparing", color: "bg-yellow-100 text-yellow-800", icon: ChefHat },
  READY: { label: "Ready", color: "bg-purple-100 text-purple-800", icon: Clock },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: Bike },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

interface StatusAction {
  label: string;
  value: OrderStatus;
  icon: LucideIcon;
  color: string;
}

const statusActions: Record<OrderStatus, StatusAction[]> = {
  PLACED: [
    { label: "Start Preparing", value: "PREPARING", icon: ChefHat, color: "text-yellow-600" },
    { label: "Mark Ready", value: "READY", icon: Clock, color: "text-purple-600" },
    { label: "Mark Delivered", value: "DELIVERED", icon: CheckCircle, color: "text-green-600" },
    { label: "Cancel Order", value: "CANCELLED", icon: XCircle, color: "text-red-600" },
  ],
  PREPARING: [
    { label: "Mark Ready", value: "READY", icon: Clock, color: "text-purple-600" },
    { label: "Mark Delivered", value: "DELIVERED", icon: CheckCircle, color: "text-green-600" },
    { label: "Cancel Order", value: "CANCELLED", icon: XCircle, color: "text-red-600" },
  ],
  READY: [
    { label: "Mark Delivered", value: "DELIVERED", icon: CheckCircle, color: "text-green-600" },
    { label: "Cancel Order", value: "CANCELLED", icon: XCircle, color: "text-red-600" },
  ],
  DELIVERED: [],
  CANCELLED: [],
};

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: { name: string; email: string };
  provider: { providerProfile?: { restaurantName?: string } };
  orderItems: { meal: { name: string } }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = useCallback(async () => {
    try {
      const result = await getAllOrders({ page, limit: 10 });
      setOrders(result.data);
      setTotalPages(result.meta.totalPage);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      loadOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      loadOrders();
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Orders</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by customer or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {filteredOrders.map((order) => {
  const currentStatus = order.status as OrderStatus; 
  
  const status = statusConfig[currentStatus];
  const StatusIcon = status?.icon;
  const actions = statusActions[currentStatus] || [];

  return (
    <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id.slice(-8)}
                        </TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>
                          {order.provider?.providerProfile?.restaurantName ||
                            "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge className={status?.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          BDT {Number(order.totalAmount).toLocaleString()}
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          {actions.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {actions.map((action) => {
                                  const ActionIcon = action.icon;
                                  return (
                                    <DropdownMenuItem
                                      key={action.value}
                                      onClick={() =>
                                        action.value === "CANCELLED"
                                          ? handleCancel(order.id)
                                          : handleStatusUpdate(order.id, action.value)
                                      }
                                      className={action.color}
                                    >
                                      <ActionIcon className="h-4 w-4 mr-2" />
                                      {action.label}
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}