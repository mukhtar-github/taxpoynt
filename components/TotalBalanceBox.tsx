'use client'

import React, { useState, useEffect } from 'react';
import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';
import { Loader2 } from 'lucide-react'; // Import a loading spinner


const TotalBalanceBox = () => {
    const [taxDetails, setTaxDetails] = useState({ total: 0, vat: 0, incomeTax: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchTaxLiability = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/calculateTaxes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            // Ensure vat and incomeTax are numbers, defaulting to 0 if invalid
            const vat = Number(data.vat) || 0;
            const incomeTax = Number(data.incomeTax) || 0;
            
            setTaxDetails({
                total: vat + incomeTax,
                vat,
                incomeTax
            });
        } catch (error) {
            console.error('Failed to fetch tax liability:', error);
            // Set default values in case of error
            setTaxDetails({ total: 0, vat: 0, incomeTax: 0 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxLiability();
    }, []);

    const taxTypes = [
        { name: 'VAT', value: taxDetails.vat },
        { name: 'Income Tax', value: taxDetails.incomeTax }
    ];
    
    if (isLoading) {
        return (
            <div className="total-tax-container">
                <section className="total-tax-liability">
                    <h2 className="total-tax-liability-header">Total Tax Liability</h2>
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin" />
                    </div>
                </section>
                <div className="doughnut-placeholder"></div>
            </div>
        );
    }

    return (
        <div className="total-tax-container flex flex-col p-6 bg-white rounded-lg shadow-md">
            <section className="total-tax-liability mb-6">
                <h2 className="total-tax-liability-header text-2xl font-bold mb-2">Total Tax Liability</h2>
                <div className="total-tax-amount text-4xl font-bold text-blue-600 mb-2">
                    <AnimatedCounter amount={taxDetails.total} />
                </div>
                <div className="tax-breakdown text-sm">
                    <p className="mb-1">VAT: ₦{taxDetails.vat.toFixed(2)}</p>
                    <p>Income Tax: ₦{taxDetails.incomeTax.toFixed(2)}</p>
                </div>
            </section>
            <section className="total-balance-chart">
                <DoughnutChart taxTypes={taxTypes} size={300} />
            </section>
        </div>
    );
};
    
export default TotalBalanceBox;