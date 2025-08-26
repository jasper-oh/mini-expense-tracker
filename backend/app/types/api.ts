/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Paginated API response interface
 */
export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  success: false
  message: string
  error?: string
  statusCode?: number
}
