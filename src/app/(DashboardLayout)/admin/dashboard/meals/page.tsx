"use client";

import { useEffect, useState } from "react";
import {
  ChefHat,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Store,
  Tag,
  DollarSign,
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

export default function AdminMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    loadMeals();
  }, [page]);

  const loadMeals = async () => {
    try {
      const res = await fetch(
        `${API_URL}/meals?page=${page}&limit=10`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch meals");
      const result = await res.json();
      setMeals(result.data || []);
      setTotalPages(result.metaData?.totalPages || 1);
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
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">All Meals</h1>
          <p className="text-gray-500">Manage all meals from all restaurants</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by meal name or restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Meals Table */}
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
                      <TableRow key={meal.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                              {meal.imageUrl ? (
                                <Image
                                  src={meal.imageUrl}
                                  alt={meal.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <ChefHat className="h-6 w-6 m-3 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {meal.name}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                                {meal.description || "No description"}
                              </p>
                              {meal.dietaryTags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {meal.dietaryTags.slice(0, 2).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {meal.dietaryTags.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{meal.dietaryTags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {meal.provider?.providerProfile?.restaurantName ||
                                "Unknown"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {meal.category?.name || "Uncategorized"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
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
                              <Link href={`/admin/dashboard/meals/edit/${meal.id}`}>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Meal
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => handleToggleAvailability(meal)}
                              >
                                <Tag className="h-4 w-4 mr-2" />
                                {meal.isAvailable ? "Disable" : "Enable"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(meal)}
                                className="text-red-600"
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