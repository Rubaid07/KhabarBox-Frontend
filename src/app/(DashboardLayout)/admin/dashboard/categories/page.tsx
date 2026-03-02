"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreHorizontal,
  Tag,
  Utensils,
  Loader2,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CreateCategoryInput,
} from "@/lib/api-categories";
import { Category } from "@/types/meal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load categories";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setSelectedCategory(null);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      await createCategory(formData);
      toast.success("Category created successfully");
      setIsCreateOpen(false);
      resetForm();
      loadCategories();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create category";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      await updateCategory(selectedCategory.id, formData);
      toast.success("Category updated successfully");
      setIsEditOpen(false);
      resetForm();
      loadCategories();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update category";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      setSubmitting(true);
      await deleteCategory(selectedCategory.id);
      toast.success("Category deleted successfully");
      setIsDeleteOpen(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Cannot delete category with existing meals";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name });
    setIsEditOpen(true);
  };

  const openDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-500 mt-4">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">
            Manage food categories • <span className="font-semibold text-orange-600">{categories.length}</span> total
          </p>
        </div>
        
        <div className="flex items-center gap-2">

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your meals.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Fast Food, Desserts, Drinks"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="focus-visible:ring-orange-500"
                    autoFocus
                  />
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={submitting}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar - কার্ডের ভিতরে */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories by name..."
              className="pl-10 focus-visible:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Tag className="h-5 w-5 text-orange-500" />
            All Categories ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <Utensils className="h-10 w-10 text-orange-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-gray-500 max-w-md mb-6">
                {searchQuery 
                  ? "Try adjusting your search to find what you're looking for." 
                  : "Create your first category to start organizing your meals."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Category
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[400px]">Category Name</TableHead>
                    <TableHead className="w-[150px]">Meals</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Utensils className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-xs text-gray-400">
                              ID: {category.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                          {category._count?.meals || 0} meals
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => openEdit(category)} className="gap-2">
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDelete(category)}
                              disabled={(category._count?.meals || 0) > 0}
                              className="gap-2 text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="focus-visible:ring-orange-500"
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={submitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Delete Category</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            {selectedCategory && (
              <div className="space-y-3">
                <p className="text-gray-600">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">&quot;{selectedCategory.name}&quot;</span>?
                </p>
                {(selectedCategory._count?.meals || 0) > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <span className="font-medium">Warning:</span>
                      This category has {selectedCategory._count?.meals} meals. 
                      Delete those meals first.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={submitting || (selectedCategory?._count?.meals || 0) > 0}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}