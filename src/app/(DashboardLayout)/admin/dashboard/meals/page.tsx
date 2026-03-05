"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChefHat,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Store,
  Tag,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import PaginationControls from "@/components/ui/pagination-controls";

interface Meal {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  dietaryTags: string[];
  category?: { name: string };
  provider?: {
    providerProfile?: { restaurantName?: string };
  };
  _count?: { reviews: number; orderItems: number };
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminMealsPage() {
  const searchParams = useSearchParams();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [meta, setMeta] = useState<MetaData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    loadMeals();
  }, [currentPage]);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/meals?page=${currentPage}&limit=10`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch meals");
      const result = await res.json();

      const mealsData = result.data || result.meals || result;
      const metaData = result.metaData ||
        result.meta || {
          page: currentPage,
          limit: 10,
          total: mealsData.length,
          totalPages: Math.ceil(mealsData.length / 10),
        };

      setMeals(mealsData);
      setMeta(metaData);
    } catch (error) {
      toast.error("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMeal) return;
    try {
      const res = await fetch(`${API_URL}/meals/${selectedMeal.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete meal");
      toast.success("Meal deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedMeal(null);
      loadMeals();
    } catch (error) {
      toast.error("Failed to delete meal");
    }
  };

  const handleToggleAvailability = async (meal: Meal) => {
    try {
      const res = await fetch(`${API_URL}/meals/${meal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isAvailable: !meal.isAvailable }),
      });
      if (!res.ok) throw new Error("Failed to update meal");
      toast.success(`Meal ${meal.isAvailable ? "disabled" : "enabled"}`);
      loadMeals();
    } catch (error) {
      toast.error("Failed to update meal");
    }
  };

  const openDeleteDialog = (meal: Meal) => {
    setSelectedMeal(meal);
    setDeleteDialogOpen(true);
  };

  const filteredMeals = meals.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider?.providerProfile?.restaurantName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      m.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Meals</h1>
          <p className="text-gray-500 mt-1">
            Manage all meals from all restaurants
          </p>
        </div>
        <Button
          onClick={loadMeals}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by meal name, restaurant, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Meals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meal</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No meals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMeals.map((meal) => (
                      <TableRow key={meal.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              {meal.imageUrl ? (
                                <Image
                                  src={meal.imageUrl}
                                  alt={meal.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ChefHat className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {meal.name}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-1 max-w-50">
                                {meal.description || "No description"}
                              </p>
                              {meal.dietaryTags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {meal.dietaryTags.slice(0, 2).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs px-1.5 py-0"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="text-sm">
                              {meal.provider?.providerProfile?.restaurantName ||
                                "Unknown"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50">
                            {meal.category?.name || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {formatPrice(meal.price)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              meal.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {meal.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link
                                href={`/admin/dashboard/meals/edit/${meal.id}`}
                              >
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Meal
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => handleToggleAvailability(meal)}
                                className="cursor-pointer"
                              >
                                <Tag className="h-4 w-4 mr-2" />
                                {meal.isAvailable ? "Disable" : "Enable"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(meal)}
                                className="text-red-600 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {meta && meta.totalPages > 1 && (
                <div className="p-4 border-t">
                  <PaginationControls meta={meta} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Meal
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedMeal?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
