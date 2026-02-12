export interface ApiResponse<T> {
  data: T;
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
}

export interface ApiError {
  error: string;
  message: string;
  hint?: string;
  next_steps?: string[];
  docs_url?: string;
}

export interface SingleItemResponse<T> {
  data: T;
}
