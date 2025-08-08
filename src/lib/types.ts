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
  occurredAt: string  // 백엔드에서 실제 사용하는 필드명
  description: string
  deposit: number      // 입금액
  withdraw: number     // 출금액
  balance: number      // 잔액
  branchInfo: string   // 거래점 정보
  categoryName: string // 카테고리명
  categoryId: string   // 카테고리 ID
  companyId: string    // 회사 ID
  classifiedAt: string // 분류된 시간
}

export interface UnclassifiedTransactionResponse {
  id: string
  occurredAt: string
  description: string
  deposit: number
  withdraw: number
  balance: number
  branchInfo: string
  companyId: string
  reason: string
  reviewed: boolean
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