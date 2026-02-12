import MealForm from "@/components/meal/meal-form";

export default function CreateMealPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Meal</h1>
        <p className="mt-2 text-gray-600">
          Create a delicious new item for your customers. Fill in all the details below.
        </p>
      </div>

      <MealForm />
    </div>
  );
}