import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
}

interface TransactionListProps {
  transactions: Transaction[]
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>₦{transaction.amount.toFixed(2)}</TableCell>
            <TableCell>{transaction.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TransactionList
