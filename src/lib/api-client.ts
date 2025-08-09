import { 
  ProcessingResultResponse, 
  ClassifiedTransactionResponse, 
  UnclassifiedTransactionResponse, 
  CategorySummaryResponse,
  PageResponse,
  ApiResponse 
} from './types'

// 개발 환경에서는 백엔드 포트를 8080으로 설정
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080/api' 
  : '/api'

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
    
    console.log(`API 요청: ${url}`) // 디버깅용 로그
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API 오류 응답: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`API 응답:`, data) // 디버깅용 로그
    return data
  }

  // 거래 내역 업로드 및 자동 분류
  async processAccounting(
    transactionsFile: File, 
    rulesFile: File
  ): Promise<ApiResponse<ProcessingResultResponse>> {
    const formData = new FormData()
    formData.append('transactions', transactionsFile)
    formData.append('rules', rulesFile)

    const response = await fetch(`${this.baseUrl}/accounting/process`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Processing 오류 응답: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`Processing failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // 분류된 거래 조회 (기본)
  async getClassifiedRecords(companyId: string): Promise<ClassifiedTransactionResponse[]> {
    const response = await this.request<any>(
      `/accounting/records?companyId=${encodeURIComponent(companyId)}`
    )
    const payload = (response && typeof response === 'object' && 'data' in response)
      ? (response as ApiResponse<ClassifiedTransactionResponse[]>).data
      : response
    return Array.isArray(payload) ? payload : []
  }

  // 분류된 거래 조회 (페이징) - 현재는 기본 조회를 사용
  async getClassifiedRecordsPaged(
    companyId: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<PageResponse<ClassifiedTransactionResponse>> {
    // 기본 조회 API를 재사용하여 일관된 언래핑을 보장
    const transactions = await this.getClassifiedRecords(companyId)
    const totalElements = transactions.length
    const totalPages = Math.max(1, Math.ceil(totalElements / size))
    const startIndex = page * size
    const endIndex = startIndex + size
    const content = transactions.slice(startIndex, endIndex)
    
    return {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1
    }
  }

  // 미분류 거래 조회
  async getUnclassifiedRecords(companyId: string): Promise<UnclassifiedTransactionResponse[]> {
    const response = await this.request<any>(
      `/accounting/unclassified?companyId=${encodeURIComponent(companyId)}`
    )
    const payload = (response && typeof response === 'object' && 'data' in response)
      ? (response as ApiResponse<UnclassifiedTransactionResponse[]>).data
      : response
    return Array.isArray(payload) ? payload : []
  }

  // 전체 수입/지출 요약
  async getTotalSummary(companyId: string): Promise<CategorySummaryResponse> {
    try {
      const response = await this.request<any>(
        `/accounting/summary/total/${encodeURIComponent(companyId)}`
      )
      const base = (response && typeof response === 'object' && 'data' in response)
        ? (response as ApiResponse<CategorySummaryResponse>).data
        : response
      const safe = base || {}
      // 백엔드 응답 형태에 맞춰 변환
      return {
        categoryId: safe.categoryId || 'total',
        categoryName: safe.categoryName || '전체',
        totalIncome: safe.totalIncome || 0,
        totalExpenditure: safe.totalExpenditure || 0,
        totalExpense: safe.totalExpenditure || 0, // UI 호환성을 위한 별칭
        recordCount: safe.recordCount || 0,
        transactionCount: safe.recordCount || 0, // UI 호환성을 위한 별칭
        companyId: companyId
      }
    } catch (error) {
      console.error(`getTotalSummary 오류 (companyId: ${companyId}):`, error)
      // 빈 응답 반환 (UI에서 에러 핸들링 가능하도록)
      return {
        categoryId: 'total',
        categoryName: '전체',
        totalIncome: 0,
        totalExpenditure: 0,
        totalExpense: 0,
        recordCount: 0,
        transactionCount: 0,
        companyId: companyId
      }
    }
  }

  // 카테고리별 수입/지출 요약
  async getCategorySummaries(companyId: string): Promise<CategorySummaryResponse[]> {
    try {
      const response = await this.request<any>(
        `/accounting/summary/categories/${encodeURIComponent(companyId)}`
      )
      const payload = (response && typeof response === 'object' && 'data' in response)
        ? (response as ApiResponse<CategorySummaryResponse[]>).data
        : response
      return Array.isArray(payload) ? payload : []
    } catch (error) {
      console.error(`getCategorySummaries 오류 (companyId: ${companyId}):`, error)
      return []
    }
  }

  // 헬스 체크 (백엔드 연결 확인용)
  async healthCheck(): Promise<any> {
    try {
      // 백엔드에 헬스 체크 엔드포인트가 있다면 사용
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`, {
        method: 'GET',
      })
      
      if (response.ok) {
        return await response.json()
      }
      throw new Error(`Health check failed: ${response.status}`)
    } catch (error) {
      console.error('헬스 체크 실패:', error)
      throw error
    }
  }
}

export const apiClient = new ApiClient()