import { useState } from 'react'
import { apiClient } from '../lib/api-client'
import { ProcessingResultResponse } from '../lib/types'

interface FileUploadProps {
  onProcessingComplete?: (result: ProcessingResultResponse) => void
}

export function FileUpload({ onProcessingComplete }: FileUploadProps) {
  const [transactionsFile, setTransactionsFile] = useState<File | null>(null)
  const [rulesFile, setRulesFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'transactions' | 'rules') => {
    const file = event.target.files?.[0]
    if (file) {
      if (fileType === 'transactions') {
        if (!file.name.toLowerCase().endsWith('.csv')) {
          alert('거래 내역은 CSV 파일이어야 합니다.')
          return
        }
        setTransactionsFile(file)
      } else {
        if (!file.name.toLowerCase().endsWith('.json')) {
          alert('분류 규칙은 JSON 파일이어야 합니다.')
          return
        }
        setRulesFile(file)
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!transactionsFile || !rulesFile) {
      alert('거래 내역과 분류 규칙 파일을 모두 선택해주세요.')
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
        alert(`처리 완료: 총 ${result.data.totalTransactions}건의 거래가 처리되었습니다.`)
        onProcessingComplete?.(result.data)
      } else {
        throw new Error(result.error || '처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Processing error:', error)
      alert(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg border-0">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          📤 거래 내역 업로드
        </h3>
        <p className="text-gray-600 mb-6">
          CSV 형식의 거래 내역과 JSON 형식의 분류 규칙을 업로드하여 자동으로 거래를 분류합니다.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                📄 거래 내역 파일 (CSV)
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileChange(e, 'transactions')}
                disabled={isProcessing}
                className="w-full border-2 border-dashed border-purple-300 bg-white/50 hover:border-purple-400 transition-colors rounded-md p-3"
              />
              {transactionsFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  ✅ {transactionsFile.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                ⚙️ 분류 규칙 파일 (JSON)
              </label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => handleFileChange(e, 'rules')}
                disabled={isProcessing}
                className="w-full border-2 border-dashed border-cyan-300 bg-white/50 hover:border-cyan-400 transition-colors rounded-md p-3"
              />
              {rulesFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  ✅ {rulesFile.name}
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
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={!transactionsFile || !rulesFile || isProcessing}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            {isProcessing ? '처리 중...' : '자동 분류 시작'}
          </button>
        </form>
      </div>
    </div>
  )
} 