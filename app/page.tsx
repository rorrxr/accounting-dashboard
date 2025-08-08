"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Upload, TrendingUp, TrendingDown, AlertCircle, FileText, Building2, DollarSign, BarChart3, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Area, AreaChart, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FileUpload } from "@/components/file-upload"
import { TransactionList } from "@/components/transaction-list"
import { SummaryStats } from "@/components/summary-stats"
import { apiClient } from "@/lib/api-client"
import { ProcessingResultResponse, ClassifiedTransactionResponse, CategorySummaryResponse } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"





const trendData = [
  { month: "1월", income: 320000, expense: 180000, profit: 140000 },
  { month: "2월", income: 380000, expense: 220000, profit: 160000 },
  { month: "3월", income: 420000, expense: 190000, profit: 230000 },
  { month: "4월", income: 350000, expense: 240000, profit: 110000 },
  { month: "5월", income: 480000, expense: 200000, profit: 280000 },
  { month: "6월", income: 400000, expense: 150000, profit: 250000 },
  { month: "7월", income: 450000, expense: 180000, profit: 270000 }
]

const categoryData = [
  { name: "배송수입", value: 45, amount: 400000, color: "#8b5cf6" },
  { name: "사무용품비", value: 25, amount: 75000, color: "#06b6d4" },
  { name: "식비", value: 20, amount: 33000, color: "#10b981" },
  { name: "기타", value: 10, amount: 25000, color: "#f59e0b" }
]

export default function ModernAccountingDashboard() {
  const [selectedCompany, setSelectedCompany] = useState("com_1")
  const [processingResult, setProcessingResult] = useState<ProcessingResultResponse | null>(null)
  const { toast } = useToast()

  const companies = [
    { id: "com_1", name: "A커머스", color: "bg-purple-500" },
    { id: "com_2", name: "B커머스", color: "bg-cyan-500" }
  ]





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-white shadow-xl border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">회계 시스템</h1>
                <p className="text-sm text-gray-500">자동화 솔루션</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start bg-purple-50 text-purple-700">
                <BarChart3 className="w-4 h-4 mr-3" />
                대시보드
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-600">
                <FileText className="w-4 h-4 mr-3" />
                거래 내역
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-600">
                <PieChart className="w-4 h-4 mr-3" />
                분석 리포트
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-600">
                <Upload className="w-4 h-4 mr-3" />
                데이터 업로드
              </Button>
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
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-48 border-2 border-purple-200 focus:border-purple-400">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${companies.find(c => c.id === selectedCompany)?.color}`} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${company.color}`} />
                          {company.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="text-gray-600">
                  <Calendar className="w-3 h-3 mr-1" />
                  2025년 7월
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                내보내기
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
            </div>
          </div>

          {/* File Upload Card */}
          <div className="mb-8">
            <FileUpload onProcessingComplete={setProcessingResult} />
              </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">총 수입</p>
                    <p className="text-2xl font-bold mt-1">₩0</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-blue-100">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">실시간 데이터</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-rose-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-rose-100 text-sm font-medium">총 지출</p>
                    <p className="text-2xl font-bold mt-1">₩0</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <ArrowDownRight className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-rose-100">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span className="text-sm">실시간 데이터</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">순이익</p>
                    <p className="text-2xl font-bold mt-1">₩0</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-emerald-100">
                  <span className="text-sm">실시간 데이터</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">미분류</p>
                    <p className="text-2xl font-bold mt-1">0건</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={0} className="h-2 bg-white/20" />
                  <span className="text-amber-100 text-sm mt-1 block">실시간 데이터</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">수익 트렌드 분석</CardTitle>
                <CardDescription>월별 수입, 지출, 순이익 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    income: { label: "수입", color: "#8b5cf6" },
                    expense: { label: "지출", color: "#ef4444" },
                    profit: { label: "순이익", color: "#10b981" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#incomeGradient)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expense" 
                        stroke="#ef4444" 
                        fillOpacity={1} 
                        fill="url(#expenseGradient)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">카테고리별 분포</CardTitle>
                <CardDescription>지출 항목 구성 비율</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: data.color }}
                                  />
                                  <span className="font-medium text-gray-900">{data.name}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  비율: {data.value}%
                                </div>
                                <div className="text-sm text-gray-600">
                                  금액: {formatCurrency(data.amount)}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="space-y-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{item.value}%</div>
                        <div className="text-xs text-gray-500">{formatCurrency(item.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction List */}
          <div className="mb-8">
            <TransactionList companyId={selectedCompany} />
                </div>

          {/* Summary Stats */}
          <div className="mb-8">
            <SummaryStats companyId={selectedCompany} />
              </div>
        </div>
      </div>
    </div>
  )
}
