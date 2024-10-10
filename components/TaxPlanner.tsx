'use client'

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const TaxPlanner: React.FC = () => {
    const [income, setIncome] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [taxes, setTaxes] = useState<{ vat: number; incomeTax: number }>({ vat: 0, incomeTax: 0 });
    const [errors, setErrors] = useState<{ income: string; amount: string }>({ income: '', amount: '' });

    const validateInput = (value: number, type: keyof typeof errors): boolean => {
        if (value < 0) {
            setErrors(prev => ({ ...prev, [type]: 'Value cannot be negative' }));
            return false;
        } else {
            setErrors(prev => ({ ...prev, [type]: '' }));
            return true;
        }
    };

    const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (validateInput(value, 'income')) {
            setIncome(value);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (validateInput(value, 'amount')) {
            setAmount(value);
        }
    };

    const simulateTaxCalculations = () => {
        try {
            const VAT_RATE = 0.075; // 7.5%
            const incomeTaxRates = [
                { threshold: 300000, rate: 0.07 },
                { threshold: 600000, rate: 0.11 },
                { threshold: 1100000, rate: 0.15 },
                { threshold: 1600000, rate: 0.19 },
                { threshold: 3200000, rate: 0.21 },
                { threshold: Infinity, rate: 0.24 }
            ];

            // Calculate VAT
            const vat = amount * VAT_RATE;

            // Calculate progressive income tax
            let incomeTax = 0;
            let remainingIncome = income;

            for (const bracket of incomeTaxRates) {
                const taxableIncome = Math.min(remainingIncome, bracket.threshold);
                incomeTax += taxableIncome * bracket.rate;
                remainingIncome -= taxableIncome;
                if (remainingIncome <= 0) break;
            }

            setTaxes({ vat, incomeTax });
            toast.success('Tax calculations completed successfully!');
        } catch (error) {
            console.error('Failed to perform tax calculations:', error);
            toast.error('Failed to perform tax calculations.');
        }
    };

    return (
        <Card className="tax-planner h-full flex flex-col">
            <CardHeader>
                <CardTitle className="tax-planner-header">Simulate Your Tax Impact</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <div className="tax-planner-form space-y-4 flex-grow">
                    <div>
                        <Input 
                            type="number" 
                            value={income} 
                            onChange={handleIncomeChange} 
                            placeholder="Projected Income" 
                            className={errors.income ? 'border-red-500' : ''}
                        />
                        {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income}</p>}
                    </div>
                    <div>
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={handleAmountChange} 
                            placeholder="Projected Spending" 
                            className={errors.amount ? 'border-red-500' : ''}
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>
                    <Button onClick={simulateTaxCalculations} className="w-full">Simulate Taxes</Button>
                </div>
                {taxes && (
                    <div className="tax-planner-results">
                        <h4 className="font-semibold mb-2">Tax Projections:</h4>
                        <p>Projected VAT: ₦{taxes.vat.toFixed(2)}</p>
                        <p>Projected Income Tax: ₦{taxes.incomeTax.toFixed(2)}</p>
                        <p className="font-semibold mt-2">Total Tax: ₦{(taxes.vat + taxes.incomeTax).toFixed(2)}</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Note: This is a simplified simulation. Actual tax calculations may vary based on individual circumstances and current tax laws.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TaxPlanner;