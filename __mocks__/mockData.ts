export const mockUser = {
    id: 'user123',
    name: 'Taxpoynt User',
    email: 'taxpoynt@example.com',
    isAdmin: true,
  };
  
  export const mockTaxReturns = [
    {
      $id: 'return1',
      taxReturnId: 'TR001',
      taxPeriod: '2023',
      documentUrl: 'https://example.com/tax-return-2023.pdf',
      status: 'Submitted',
      currentBalance: 5000,
      type: 'Income Tax',
      year: '2023',
      dueDate: '2024-04-15',
    },
    {
      $id: 'return2',
      taxReturnId: 'TR002',
      taxPeriod: '2022',
      documentUrl: 'https://example.com/tax-return-2022.pdf',
      status: 'Paid',
      currentBalance: 0,
      type: 'Income Tax',
      year: '2022',
      dueDate: '2023-04-15',
    },
  ];
  
  export const mockTaxLiability = {
    total: 7500,
    vat: 2500,
    incomeTax: 5000,
  };
  
  export const mockTransactions = [
    {
      id: 'trans1',
      date: '2023-12-15',
      description: 'Salary Deposit',
      amount: 5000,
      type: 'credit',
    },
    {
      id: 'trans2',
      date: '2023-12-20',
      description: 'Tax Payment',
      amount: 1000,
      type: 'debit',
    },
  ];
  
  export const mockTaxUpdates = [
    {
      $id: 'update1',
      title: 'New Tax Rates for 2024',
      description: 'The government has announced new tax rates effective from January 1, 2024.',
      category: 'Tax Rates',
      date: '2023-11-30',
    },
    {
      $id: 'update2',
      title: 'Extended Deadline for Tax Returns',
      description: 'The deadline for submitting tax returns has been extended by one month.',
      category: 'Deadlines',
      date: '2023-12-10',
    },
  ];
  
  export const mockReminders = [
    {
      $id: 'reminder1',
      title: 'Submit Q4 VAT Return',
      description: 'Don\'t forget to submit your Q4 VAT return by the end of the month.',
      dueDate: '2024-01-31',
      priority: 'High',
    },
    {
      $id: 'reminder2',
      title: 'Prepare Annual Tax Documents',
      description: 'Start gathering documents for your annual tax return.',
      dueDate: '2024-03-15',
      priority: 'Medium',
    },
  ];