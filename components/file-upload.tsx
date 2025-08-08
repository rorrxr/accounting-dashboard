'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/api-client'
import { ProcessingResultResponse } from '@/lib/types'
import { Upload, FileText, Settings, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onProcessingComplete?: (result: ProcessingResultResponse) => void
}

export function FileUpload({ onProcessingComplete }: FileUploadProps) {
  const [transactionsFile, setTransactionsFile] = useState<File | null>(null)
  const [rulesFile, setRulesFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'transactions' | 'rules') => {
    const file = event.target.files?.[0]
    if (file) {
      if (fileType === 'transactions') {
        if (!file.name.toLowerCase().endsWith('.csv')) {
          toast({
            title: "잘못된 파일 형식",
            description: "거래 내역은 CSV 파일이어야 합니다.",
            variant: "destructive",
          })
          return
        }
        setTransactionsFile(file)
      } else {
        if (!file.name.toLowerCase().endsWith('.json')) {
          toast({
            title: "잘못된 파일 형식",
            description: "분류 규칙은 JSON 파일이어야 합니다.",
            variant: "destructive",
          })
          return
        }
        setRulesFile(file)
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!transactionsFile || !rulesFile) {
      toast({
        title: "파일 선택 필요",
        description: "거래 내역과 분류 규칙 파일을 모두 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await apiClient.processAccounting(transactionsFile, rulesFile)
      
      clearInterval(progressInterval)
      setProgress(100)

      if (result.success && result.data) {
        toast({
          title: "처리 완료",
          description: `총 ${result.data.totalTransactions}건의 거래가 처리되었습니다.`,
        })
        
        onProcessingComplete?.(result.data)
      } else {
        throw new Error(result.error || '처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Processing error:', error)
      toast({
        title: "처리 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          거래 내역 업로드
        </CardTitle>
        <CardDescription>
          CSV 형식의 거래 내역과 JSON 형식의 분류 규칙을 업로드하여 자동으로 거래를 분류합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactions" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                거래 내역 파일 (CSV)
              </Label>
              <Input
                id="transactions"
                type="file"
                accept=".csv"
                onChange={(e) => handleFileChange(e, 'transactions')}
                disabled={isProcessing}
              />
              {transactionsFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {transactionsFile.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                분류 규칙 파일 (JSON)
              </Label>
              <Input
                id="rules"
                type="file"
                accept=".json"
                onChange={(e) => handleFileChange(e, 'rules')}
                disabled={isProcessing}
              />
              {rulesFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {rulesFile.name}
                </div>
              )}
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>처리 중...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={!transactionsFile || !rulesFile || isProcessing}
            className="w-full"
          >
            {isProcessing ? '처리 중...' : '업로드 및 처리'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 