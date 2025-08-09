import express from 'express'
import cors from 'cors'
import multer from 'multer'

const app = express()
const PORT = 8080

// Middleware
app.use(cors())
app.use(express.json())

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' })

// Empty mock data
const mockTransactions = []

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// Process accounting files
app.post(
  '/api/accounting/process',
  upload.fields([
    { name: 'transactions', maxCount: 1 },
    { name: 'rules', maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const transactionsFile = req.files['transactions']?.[0]
      const rulesFile = req.files['rules']?.[0]

      if (!transactionsFile || !rulesFile) {
        return res.status(400).json({ success: false, error: 'CSV 파일과 규칙 파일이 모두 필요합니다.' })
      }

      const result = {
        success: true,
        data: {
          totalTransactions: 0,
          classifiedCount: 0,
          unclassifiedCount: 0,
          processingTime: 0,
          companyId: 'com_1'
        }
      }

      res.json(result)
    } catch (error) {
      console.error('Processing error:', error)
      res.status(500).json({ success: false, error: '파일 처리 중 오류가 발생했습니다.' })
    }
  }
)

// Get records (array; paging handled client-side)
app.get('/api/accounting/records', (req, res) => {
  try {
    const { companyId } = req.query
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'companyId 파라미터가 필요합니다.' })
    }

    const filtered = mockTransactions.filter(t => t.companyId === companyId)
    res.json(filtered)
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ success: false, error: '데이터 조회 중 오류가 발생했습니다.' })
  }
})

// Get unclassified records
app.get('/api/accounting/unclassified', (req, res) => {
  try {
    const { companyId } = req.query
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'companyId 파라미터가 필요합니다.' })
    }

    res.json([])
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ success: false, error: '미분류 거래 조회 중 오류가 발생했습니다.' })
  }
})

// Get total summary
app.get('/api/accounting/summary/total/:companyId', (req, res) => {
  try {
    const { companyId } = req.params
    res.json({
      categoryId: 'total',
      categoryName: '전체',
      totalIncome: 0,
      totalExpense: 0,
      transactionCount: 0,
      companyId
    })
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ success: false, error: '요약 데이터 조회 중 오류가 발생했습니다.' })
  }
})

// Get category summaries
app.get('/api/accounting/summary/categories/:companyId', (req, res) => {
  try {
    const { companyId } = req.params
    res.json([])
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ success: false, error: '카테고리별 요약 조회 중 오류가 발생했습니다.' })
  }
})

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
