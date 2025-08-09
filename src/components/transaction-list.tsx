import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { apiClient } from '../lib/api-client'
import { ClassifiedTransactionResponse, UnclassifiedTransactionResponse } from '../lib/types'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

interface TransactionListProps {
  companyId: string
  enabled?: boolean
}

export function TransactionList({ companyId, enabled = true }: TransactionListProps) {
  const [transactions, setTransactions] = useState<ClassifiedTransactionResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [unclassified, setUnclassified] = useState<UnclassifiedTransactionResponse[]>([])
  const [loadingUnclassified, setLoadingUnclassified] = useState(false)
  const [unclassifiedCurrentPage, setUnclassifiedCurrentPage] = useState(0)
  const [unclassifiedTotalPages, setUnclassifiedTotalPages] = useState(0)
  const pageSize = 20

  const fetchTransactions = async (page: number = 0) => {
    try {
      setLoading(true)
      const response = await apiClient.getClassifiedRecordsPaged(companyId, page, pageSize)
      setTransactions(response.content)
      setTotalPages(response.totalPages)
      setCurrentPage(page)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 함
      setTransactions([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnclassified = async (page: number = 0) => {
    try {
      setLoadingUnclassified(true)
      const list = await apiClient.getUnclassifiedRecords(companyId)
      const totalElements = list.length
      const total = Math.max(1, Math.ceil(totalElements / pageSize))
      const startIndex = page * pageSize
      const endIndex = startIndex + pageSize
      setUnclassified(list.slice(startIndex, endIndex))
      setUnclassifiedTotalPages(total)
      setUnclassifiedCurrentPage(page)
    } catch (error) {
      console.error('Failed to fetch unclassified transactions:', error)
      setUnclassified([])
      setUnclassifiedTotalPages(0)
    } finally {
      setLoadingUnclassified(false)
    }
  }

  useEffect(() => {
    if (enabled) {
      fetchTransactions()
      fetchUnclassified()
    }
  }, [companyId, enabled])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const handleRefresh = () => {
    fetchTransactions(currentPage)
  }

  const handleUnclassifiedRefresh = () => {
    fetchUnclassified(unclassifiedCurrentPage)
  }

  const handlePageChange = (page: number) => {
    fetchTransactions(page)
  }

  return (
    <div className="space-y-6">
      {/* 분류된 거래 내역 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>분류된 거래 내역</CardTitle>
              <CardDescription>
                {enabled ? `총 ${transactions.length}건의 거래가 분류되었습니다.` : '업로드 후 자동 분류를 시작하면 결과가 표시됩니다.'}
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={!enabled}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!enabled ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                <div className="text-4xl mb-2">📥</div>
                <h3 className="text-lg font-semibold mb-2">먼저 파일을 업로드하세요</h3>
                <p className="text-sm text-gray-500 mb-4">
                  CSV와 JSON 파일을 등록한 뒤 "자동 분류 시작"을 누르면 거래 내역을 조회합니다.
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>거래 내역을 불러오는 중...</span>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-lg font-semibold mb-2">거래 내역이 없습니다</h3>
                <p className="text-sm text-gray-500 mb-4">
                  아직 처리된 거래 내역이 없습니다. CSV 파일을 업로드하여 시작하세요.
                </p>
                <div className="text-xs text-gray-400">
                  • CSV 파일에 거래 내역을 포함하세요<br/>
                  • JSON 파일에 분류 규칙을 정의하세요<br/>
                  • 업로드 후 자동 분류가 진행됩니다
                </div>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>거래처</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead className="text-right">입금</TableHead>
                    <TableHead className="text-right">출금</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={transaction.classifiedTxId ?? `transaction-${index}`}>
                      <TableCell>{formatDate(transaction.occurredAt)}</TableCell>
                      <TableCell>{transaction.companyName || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description || ''}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {transaction.categoryName || '미분류'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(transaction.deposit || 0) > 0 ? (
                          <div className="flex items-center justify-end gap-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">
                              {formatAmount(transaction.deposit || 0)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {(transaction.withdraw || 0) > 0 ? (
                          <div className="flex items-center justify-end gap-1">
                            <TrendingDown className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">
                              {formatAmount(transaction.withdraw || 0)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    이전
                  </Button>
                  <span className="text-sm">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 미분류 거래 내역 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>미분류 거래 내역</CardTitle>
              <CardDescription>
                {enabled ? `총 ${unclassified.length}건의 미분류 거래가 있습니다.` : '업로드 후 자동 분류를 시작하면 결과가 표시됩니다.'}
              </CardDescription>
            </div>
            <Button onClick={handleUnclassifiedRefresh} variant="outline" size="sm" disabled={!enabled}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!enabled ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                <div className="text-4xl mb-2">🗂️</div>
                <h3 className="text-lg font-semibold mb-2">먼저 파일을 업로드하세요</h3>
                <p className="text-sm text-gray-500 mb-4">
                  업로드 후 미분류된 거래가 이곳에 표시됩니다.
                </p>
              </div>
            </div>
          ) : loadingUnclassified ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>미분류 거래를 불러오는 중...</span>
              </div>
            </div>
          ) : unclassified.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-lg font-semibold mb-2">미분류 거래가 없습니다</h3>
                <p className="text-sm text-gray-500 mb-4">
                  현재 모든 거래가 규칙에 의해 분류되었습니다.
                </p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>사유</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">입금</TableHead>
                    <TableHead className="text-right">출금</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unclassified.map((tx, index) => (
                    <TableRow key={tx.id ?? `unclassified-${index}`}>
                      <TableCell>{formatDate(tx.occurredAt)}</TableCell>
                      <TableCell className="max-w-xs truncate">{tx.description || ''}</TableCell>
                      <TableCell className="max-w-xs truncate">{tx.reason || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={tx.reviewed ? 'secondary' : 'destructive'}>
                          {tx.reviewed ? '검토됨' : '미검토'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(tx.deposit || 0) > 0 ? (
                          <div className="flex items-center justify-end gap-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">
                              {formatAmount(tx.deposit || 0)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {(tx.withdraw || 0) > 0 ? (
                          <div className="flex items-center justify-end gap-1">
                            <TrendingDown className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">
                              {formatAmount(tx.withdraw || 0)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {unclassifiedTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUnclassified(unclassifiedCurrentPage - 1)}
                    disabled={unclassifiedCurrentPage === 0}
                  >
                    이전
                  </Button>
                  <span className="text-sm">
                    {unclassifiedCurrentPage + 1} / {unclassifiedTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUnclassified(unclassifiedCurrentPage + 1)}
                    disabled={unclassifiedCurrentPage === unclassifiedTotalPages - 1}
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 