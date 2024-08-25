'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { mockTransactions } from '@/__mocks__/mockData';
import { useState } from 'react';

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
}

// interface TransactionListProps {
//   transactions: Transaction[]
// }

const TransactionList = () => {
//const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [transactions, setTransactions] = useState(mockTransactions);
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
