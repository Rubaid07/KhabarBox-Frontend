"use client";

import { useState } from "react";
import { Star, Save, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateReview } from "@/lib/api-reviews";

interface EditReviewFormProps {
  reviewId: string;
  initialRating: number;
  initialComment?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditReviewForm({
  reviewId,
  initialRating,
  initialComment,
  onSuccess,
  onCancel,
}: EditReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      await updateReview(reviewId, { rating, comment });
      toast.success("Review updated successfully!");
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update review";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">Edit Review</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-transform hover:scale-110"
            disabled={submitting}
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 &&
            ["Terrible", "Bad", "Okay", "Good", "Excellent"][rating - 1]}
        </span>
      </div>

      {/* Comment */}
      <Textarea
        placeholder="Share your experience (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-3 min-h-20"
        disabled={submitting}
      />

      {/* Submit */}
      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
          className="bg-orange-600 hover:bg-orange-700"
          size="sm"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}