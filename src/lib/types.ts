export interface Transaction {
  id: string
  date: string
  time: string
  counterparty: string
  category_id: string
  category_name: string
  company_id: string
  income: number
  expense: number
  description: string
}

export interface ClassificationRule {
  [companyId: string]: {
    [categoryId: string]: string[]
  }
}

export interface SummaryStats {
  totalIncome: number
  totalExpense: number
  netProfit: number
  unclassifiedCount: number
  totalTransactions: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Spring Boot API 응답 타입들
export interface ProcessingResultResponse {
  totalTransactions: number
  classifiedCount: number
  unclassifiedCount: number
  processingTime: number
  companyId: string
}

export interface ClassifiedTransactionResponse {
  id: string
  transactionDate: string
  counterparty: string
  description: string
  amount: number
  category: string
  categoryId: string
  companyId: string
  isIncome: boolean
}

export interface UnclassifiedTransactionResponse {
  id: string
  transactionDate: string
  counterparty: string
  description: string
  amount: number
  companyId: string
  isIncome: boolean
  reason: string
}

export interface CategorySummaryResponse {
  categoryId: string
  categoryName: string
  totalIncome: number
  totalExpense: number
  transactionCount: number
  companyId: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
} 