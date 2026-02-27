const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    image?: string;
  };
  meal?: {
    id: string;
    name: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  meta: {
    total: number;
    averageRating: number;
  };
}

export const getReviews = async (mealId: string): Promise<ReviewsResponse> => {
  const res = await fetch(`${API_URL}/reviews/meals/${mealId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export const createReview = async (data: {
  mealId: string;
  rating: number;
  comment?: string;
}): Promise<Review> => {
  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create review");
  }
  const json = await res.json();
  return json.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete review");
};

export const updateReview = async (
  reviewId: string,
  data: { rating: number; comment?: string }
): Promise<Review> => {
  const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update review");
  }
  
  const json = await res.json();
  return json.data;
};