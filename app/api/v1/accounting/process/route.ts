import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const csvFile = formData.get('csvFile') as File
    const rulesFile = formData.get('rulesFile') as File
    
    if (!csvFile || !rulesFile) {
      return NextResponse.json(
        { error: 'CSV 파일과 규칙 파일이 모두 필요합니다.' },
        { status: 400 }
      )
    }

    // Parse CSV file
    const csvText = await csvFile.text()
    const csvLines = csvText.split('\n').slice(1) // Skip header
    
    // Parse rules file
    const rulesText = await rulesFile.text()
    const rules = JSON.parse(rulesText)
    
    const processedTransactions = []
    
    for (const line of csvLines) {
      if (!line.trim()) continue
      
      const [date, time, counterparty, amount, description] = line.split(',')
      const numAmount = parseFloat(amount)
      
      // Apply classification rules
      let companyId = null
      let categoryId = null
      let categoryName = '미분류'
      
      for (const [company, companyRules] of Object.entries(rules)) {
        for (const [category, keywords] of Object.entries(companyRules as any)) {
          const keywordList = keywords as string[]
          if (keywordList.some(keyword => 
            counterparty.includes(keyword) || description.includes(keyword)
          )) {
            companyId = company
            categoryId = category
            categoryName = category
            break
          }
        }
        if (companyId) break
      }
      
      processedTransactions.push({
        id: Math.random().toString(36).substr(2, 9),
        date,
        time,
        counterparty,
        description,
        amount: numAmount,
        companyId,
        categoryId,
        categoryName,
        income: numAmount > 0 ? numAmount : 0,
        expense: numAmount < 0 ? Math.abs(numAmount) : 0
      })
    }
    
    // Here you would typically save to database
    // For demo purposes, we'll just return the processed data
    
    return NextResponse.json({
      success: true,
      message: '거래 내역이 성공적으로 처리되었습니다.',
      processedCount: processedTransactions.length,
      transactions: processedTransactions
    })
    
  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json(
      { error: '파일 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
