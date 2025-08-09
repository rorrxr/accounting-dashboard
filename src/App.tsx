import { useState, useEffect } from 'react'
import { FileUpload } from './components/file-upload'
import { TransactionList } from './components/transaction-list'
import { ProcessingResultResponse, CategorySummaryResponse } from './lib/types'
import { apiClient } from './lib/api-client'

function App() {
  const [selectedCompany, setSelectedCompany] = useState("com_1")
  const [processingResult, setProcessingResult] = useState<ProcessingResultResponse | null>(null)
  const [summaryStats, setSummaryStats] = useState<CategorySummaryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasProcessed, setHasProcessed] = useState(false)
  const [unclassifiedCount, setUnclassifiedCount] = useState<number>(0)
  const [classifiedCount, setClassifiedCount] = useState<number>(0)

  const companies = [
    { id: "com_1", name: "A커머스" },
    { id: "com_2", name: "B커머스" }
  ]

  // 업로드/처리 이후에만 통계 데이터 조회
  useEffect(() => {
    if (hasProcessed && selectedCompany) {
      fetchSummaryStats()
      fetchUnclassifiedCount()
      fetchClassifiedCount()
    }
  }, [selectedCompany, hasProcessed])

  const fetchSummaryStats = async () => {
    try {
      setLoading(true)
      const stats = await apiClient.getTotalSummary(selectedCompany)
      setSummaryStats(stats)
    } catch (error) {
      console.error('Failed to fetch summary stats:', error)
      // Set default values when API fails (e.g., no data available yet)
      setSummaryStats({
        categoryId: 'total',
        categoryName: '전체',
        totalIncome: 0,
        totalExpenditure: 0,
        recordCount: 0,
        totalExpense: 0,
        transactionCount: 0,
        companyId: selectedCompany
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUnclassifiedCount = async () => {
    try {
      const list = await apiClient.getUnclassifiedRecords(selectedCompany)
      setUnclassifiedCount(Array.isArray(list) ? list.length : 0)
    } catch (error) {
      console.error('Failed to fetch unclassified records:', error)
      // API 실패 시 기존 처리 결과 숫자를 유지하도록 함
      setUnclassifiedCount(processingResult?.unclassifiedCount ?? 0)
    }
  }

  const fetchClassifiedCount = async () => {
    try {
      const list = await apiClient.getClassifiedRecords(selectedCompany)
      setClassifiedCount(Array.isArray(list) ? list.length : 0)
    } catch (error) {
      console.error('Failed to fetch classified records:', error)
      setClassifiedCount(processingResult?.classifiedCount ?? 0)
    }
  }

  const handleProcessingComplete = (result: ProcessingResultResponse) => {
    setHasProcessed(true)
    setProcessingResult(result)
    setUnclassifiedCount(result?.unclassifiedCount ?? 0)
    setClassifiedCount(result?.classifiedCount ?? 0)
    // 처리 완료 후 통계 새로고침
    fetchSummaryStats()
    fetchUnclassifiedCount()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 text-white">🏢</div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">회계 시스템</h1>
                <p className="text-sm text-gray-500">자동화 솔루션</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md bg-purple-50 text-purple-700">
                📊 대시보드
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
                📄 거래 내역
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
                📤 데이터 업로드
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">재무 대시보드</h2>
              <div className="flex items-center gap-4">
                <select 
                  value={selectedCompany} 
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-48 border-2 border-purple-200 focus:border-purple-400 rounded-md px-3 py-2"
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* File Upload Card */}
          <div className="mb-8">
            <FileUpload onProcessingComplete={handleProcessingComplete} />
          </div>

          {/* Processing Result */}
          {processingResult && (
            <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg border-0">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">처리 결과</h3>
                <p className="text-green-700 mb-4">
                  거래 내역 처리가 완료되었습니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{(classifiedCount || 0) + (unclassifiedCount || 0)}</div>
                    <div className="text-sm text-gray-600">총 거래 건수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{classifiedCount}</div>
                    <div className="text-sm text-gray-600">분류 완료</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{unclassifiedCount}</div>
                    <div className="text-sm text-gray-600">미분류</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{processingResult.processingTime}ms</div>
                    <div className="text-sm text-gray-600">처리 시간</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">총 수입</p>
                  <p className="text-2xl font-bold mt-1">
                    {loading ? '로딩 중...' : `₩${summaryStats?.totalIncome?.toLocaleString() || 0}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  📈
                </div>
              </div>
              <div className="flex items-center mt-4 text-blue-100">
                <span className="text-sm">실시간 데이터</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">총 지출</p>
                  <p className="text-2xl font-bold mt-1">
                    {loading ? '로딩 중...' : `₩${summaryStats?.totalExpense?.toLocaleString() || 0}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  📉
                </div>
              </div>
              <div className="flex items-center mt-4 text-rose-100">
                <span className="text-sm">실시간 데이터</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">순이익</p>
                  <p className="text-2xl font-bold mt-1">
                    {loading ? '로딩 중...' : `₩${((summaryStats?.totalIncome || 0) - (summaryStats?.totalExpense || 0)).toLocaleString()}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  💰
                </div>
              </div>
              <div className="flex items-center mt-4 text-emerald-100">
                <span className="text-sm">실시간 데이터</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">미분류</p>
                  <p className="text-2xl font-bold mt-1">
                    {loading ? '로딩 중...' : `${(unclassifiedCount || processingResult?.unclassifiedCount || 0)}건`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  ⚠️
                </div>
              </div>
              <div className="mt-4">
                <span className="text-amber-100 text-sm mt-1 block">실시간 데이터</span>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="mb-8">
            <TransactionList companyId={selectedCompany} enabled={hasProcessed} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 