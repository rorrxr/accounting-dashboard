// API 응답 관련 타입들
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 거래 처리 결과
export interface ProcessingResultResponse {
  totalTransactions: number;
  classifiedCount: number;
  unclassifiedCount: number;
  processingTime: number;
  success: boolean;
}

// 분류된 거래
export interface ClassifiedTransactionResponse {
  classifiedTxId: number;
  companyId: string;
  companyName: string;
  categoryId: string;
  categoryName: string;
  matchedKeyword: string;
  classifiedAt: string;
  // 위임된 Transaction 필드들
  occurredAt: string;
  description: string;
  deposit: number;
  withdraw: number;
}

// 미분류 거래
export interface UnclassifiedTransactionResponse {
  id: number;
  companyId: string;
  reason: string;
  reviewed: boolean;
  // 위임된 Transaction 필드들
  occurredAt: string;
  description: string;
  deposit: number;
  withdraw: number;
  balance: number;
  branchInfo: string;
}

// 카테고리 요약 - 백엔드 응답에 맞춰 수정
export interface CategorySummaryResponse {
  categoryId: string;
  categoryName: string;
  totalIncome: number;
  totalExpenditure: number;
  recordCount: number;
  
  // UI 호환성을 위한 선택적 필드들
  totalExpense?: number; // totalExpenditure의 별칭
  transactionCount?: number; // recordCount의 별칭
  companyId?: string;
}

// 페이징 응답
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 회사 정보
export interface Company {
  companyId: string;
  companyName: string;
  createdAt: string;
}

// 카테고리 정보
export interface Category {
  categoryId: string;
  categoryName: string;
  companyId: string;
  createdAt: string;
}

// 원본 거래 정보
export interface Transaction {
  id: number;
  companyId: string;
  occurredAt: string;
  description: string;
  deposit: number;
  withdraw: number;
  balance: number;
  branchInfo: string;
  createdAt: string;
}