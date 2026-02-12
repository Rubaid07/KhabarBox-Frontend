"use client";

import { useEffect, useState } from "react";
import { getProviderMeals, deleteMeal } from "@/lib/api-meals";
import { Meal } from "@/types/meal";
import { toast } from "sonner";
import { 
  Loader2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MyMealsPage() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  // Shadcn Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    loadMeals();
  }, []);

  useEffect(() => {
    // Filter meals when search changes
    const filtered = meals.filter(meal => 
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.dietaryTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredMeals(filtered);
  }, [searchQuery, meals]);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const data = await getProviderMeals();
      setMeals(data);
      setFilteredMeals(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error loading meals");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (meal: Meal) => {
    setSelectedMeal(meal);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMeal) return;
    
    try {
      setDeleteLoading(selectedMeal.id);
      await deleteMeal(selectedMeal.id);
      toast.success("Meal deleted successfully!");
      setMeals(prev => prev.filter(m => m.id !== selectedMeal.id));
      setDeleteDialogOpen(false);
      setSelectedMeal(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete meal");
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleAvailability = async (meal: Meal) => {
    try {
      const { updateMeal } = await import("@/lib/api-meals");
      await updateMeal(meal.id, { isAvailable: !meal.isAvailable });
      setMeals(prev => prev.map(m => 
        m.id === meal.id ? { ...m, isAvailable: !m.isAvailable } : m
      ));
      toast.success(`Meal ${meal.isAvailable ? 'unavailable' : 'available'} now!`);
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Meals</h1>
          <p className="text-gray-500 mt-1">{meals.length} meals in your menu</p>
        </div>
        
        <Link 
          href="/provider/dashboard/meals/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Meal
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search meals by name, description or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Meals Grid */}
      {filteredMeals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? "No meals found" : "No meals yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? "Try adjusting your search" 
              : "Create your first meal to get started!"}
          </p>
          {!searchQuery && (
            <Link 
              href="/provider/dashboard/meals/create" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Create First Meal
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <div 
              key={meal.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-100">
                {meal.imageUrl ? (
                  <img 
                    src={meal.imageUrl} 
                    alt={meal.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-4xl">🍽️</span>
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    meal.isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {meal.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleAvailability(meal)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    title={meal.isAvailable ? "Make unavailable" : "Make available"}
                  >
                    {meal.isAvailable ? (
                      <EyeOff className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{meal.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">{meal.description}</p>
                  </div>
                  <span className="text-lg font-bold text-blue-600">${meal.price}</span>
                </div>

                {/* Tags */}
                {meal.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {meal.dietaryTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {meal.dietaryTags.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{meal.dietaryTags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => router.push(`/provider/dashboard/meals/edit/${meal.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(meal)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/*  Delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Delete Meal?</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            {selectedMeal && (
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">&quot;{selectedMeal.name}&quot;</span>?
                This will permanently remove the meal from your menu.
              </p>
            )}
          </div>

          {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Warning:</span> If this meal is in any active orders, 
              those orders may be affected.
            </p>
          </div> */}

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedMeal(null);
              }}
              disabled={deleteLoading === selectedMeal?.id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading === selectedMeal?.id}
              className="flex items-center gap-2 min-w-[100px]"
            >
              {deleteLoading === selectedMeal?.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}