import { 
  ProcessingResultResponse, 
  ClassifiedTransactionResponse, 
  UnclassifiedTransactionResponse, 
  CategorySummaryResponse,
  PageResponse,
  ApiResponse 
} from './types'

const API_BASE_URL = 'http://localhost:8080'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // 거래 내역 업로드 및 자동 분류
  async processAccounting(
    transactionsFile: File, 
    rulesFile: File
  ): Promise<ApiResponse<ProcessingResultResponse>> {
    const formData = new FormData()
    formData.append('transactions', transactionsFile)
    formData.append('rules', rulesFile)

    const response = await fetch(`${this.baseUrl}/api/accounting/process`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Processing failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // 분류된 거래 조회
  async getClassifiedRecords(companyId: string): Promise<ClassifiedTransactionResponse[]> {
    return this.request<ClassifiedTransactionResponse[]>(
      `/api/accounting/records?companyId=${encodeURIComponent(companyId)}`
    )
  }

  // 분류된 거래 조회 (페이징)
  async getClassifiedRecordsPaged(
    companyId: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<PageResponse<ClassifiedTransactionResponse>> {
    return this.request<PageResponse<ClassifiedTransactionResponse>>(
      `/api/accounting/records/paged?companyId=${encodeURIComponent(companyId)}&page=${page}&size=${size}`
    )
  }

  // 미분류 거래 조회
  async getUnclassifiedRecords(companyId: string): Promise<UnclassifiedTransactionResponse[]> {
    return this.request<UnclassifiedTransactionResponse[]>(
      `/api/accounting/unclassified?companyId=${encodeURIComponent(companyId)}`
    )
  }

  // 전체 수입/지출 요약
  async getTotalSummary(companyId: string): Promise<CategorySummaryResponse> {
    return this.request<CategorySummaryResponse>(
      `/api/accounting/summary/total/${encodeURIComponent(companyId)}`
    )
  }

  // 카테고리별 수입/지출 요약
  async getCategorySummaries(companyId: string): Promise<CategorySummaryResponse[]> {
    return this.request<CategorySummaryResponse[]>(
      `/api/accounting/summary/categories/${encodeURIComponent(companyId)}`
    )
  }
}

export const apiClient = new ApiClient() 