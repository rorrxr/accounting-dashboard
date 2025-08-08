import { NextRequest, NextResponse } from 'next/server'

// Mock database - in real implementation, this would be a proper database
const mockTransactions = [
  {
    id: "1",
    date: "2025-07-22",
    time: "11:55:10",
    counterparty: "오피스디포(주)",
    category_id: "office_supplies",
    category_name: "사무용품비",
    company_id: "com_1",
    income: 0,
    expense: 75000,
    description: "사무용품 구매"
  },
  {
    id: "2",
    date: "2025-07-21", 
    time: "14:20:40",
    counterparty: "(주)쿠팡",
    category_id: "delivery",
    category_name: "택배",
    company_id: "com_1",
    income: 250000,
    expense: 0,
    description: "배송료 수입"
  },
  {
    id: "3",
    date: "2025-07-21",
    time: "12:10:05", 
    counterparty: "김밥천국 역삼점",
    category_id: "food",
    category_name: "식비",
    company_id: "com_1",
    income: 0,
    expense: 8000,
    description: "점심식사"
  },
  {
    id: "4",
    date: "2025-07-20",
    time: "15:12:30",
    counterparty: "(주)해달인터롤", 
    category_id: "food",
    category_name: "식비",
    company_id: "com_2",
    income: 0,
    expense: 25000,
    description: "회식비"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId 파라미터가 필요합니다.' },
        { status: 400 }
      )
    }
    
    // Filter transactions by company ID
    const filteredTransactions = mockTransactions.filter(
      transaction => transaction.company_id === companyId
    )
    
    // Calculate summary statistics
    const totalIncome = filteredTransactions.reduce((sum, t) => sum + t.income, 0)
    const totalExpense = filteredTransactions.reduce((sum, t) => sum + t.expense, 0)
    const netProfit = totalIncome - totalExpense
    const unclassifiedCount = filteredTransactions.filter(
      t => t.category_id === 'unclassified'
    ).length
    
    return NextResponse.json({
      success: true,
      companyId,
      summary: {
        totalIncome,
        totalExpense, 
        netProfit,
        unclassifiedCount,
        totalTransactions: filteredTransactions.length
      },
      transactions: filteredTransactions.map(t => ({
        id: t.id,
        date: t.date,
        time: t.time,
        counterparty: t.counterparty,
        category_id: t.category_id,
        category_name: t.category_name,
        income: t.income,
        expense: t.expense,
        description: t.description
      }))
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '데이터 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
