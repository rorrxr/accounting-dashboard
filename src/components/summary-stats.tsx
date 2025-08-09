import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { apiClient } from '../lib/api-client'
import { CategorySummaryResponse } from '../lib/types'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart } from 'lucide-react'

interface SummaryStatsProps {
  companyId: string
}

export function SummaryStats({ companyId }: SummaryStatsProps) {
  const [totalSummary, setTotalSummary] = useState<CategorySummaryResponse | null>(null)
  const [categorySummaries, setCategorySummaries] = useState<CategorySummaryResponse[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSummaries = async () => {
    try {
      setLoading(true)
      const [total, categories] = await Promise.all([
        apiClient.getTotalSummary(companyId),
        apiClient.getCategorySummaries(companyId)
      ])
      setTotalSummary(total)
      setCategorySummaries(categories)
    } catch (error) {
      console.error('Failed to fetch summaries:', error)
      alert('요약 통계를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaries()
  }, [companyId])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center py-8">
              <div className="animate-pulse bg-muted h-4 w-24 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 전체 요약 */}
      {totalSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 수입</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(totalSummary.totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 지출</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatAmount((totalSummary.totalExpense ?? totalSummary.totalExpenditure) || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">순이익</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                totalSummary.totalIncome - ((totalSummary.totalExpense ?? totalSummary.totalExpenditure) || 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formatAmount(totalSummary.totalIncome - ((totalSummary.totalExpense ?? totalSummary.totalExpenditure) || 0))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 거래 건수</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(totalSummary.transactionCount ?? totalSummary.recordCount ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 카테고리별 요약 */}
      {categorySummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              카테고리별 요약
            </CardTitle>
            <CardDescription>
              각 카테고리별 수입과 지출 현황입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySummaries.map((category) => (
                <Card key={category.categoryId} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{category.categoryName}</h3>
                    <Badge variant="secondary">
                      {category.transactionCount}건
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">수입</span>
                      <span className="text-green-600 font-medium">
                        {formatAmount(category.totalIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">지출</span>
                      <span className="text-red-600 font-medium">
                        {formatAmount((category.totalExpense ?? category.totalExpenditure) || 0)}
                      </span>
                    </div>
                    <div className="border-t pt-1 mt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>순액</span>
                        <span className={
                          category.totalIncome - (category.totalExpense ?? category.totalExpenditure ?? 0) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }>
                           {formatAmount(category.totalIncome - (category.totalExpense ?? category.totalExpenditure ?? 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 