import React, { useState } from 'react';

const TaxDisplay = () => {
    const [income, setIncome] = useState(0);
    const [amount, setAmount] = useState(0);
    const [taxes, setTaxes] = useState({ vat: 0, incomeTax: 0 });

    const handleCalculateTaxes = async () => {
        const response = await fetch('/api/calculateTaxes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ income, amount })
        });
        const data = await response.json();
        setTaxes(data);
    };

    return (
        <div>
            <input type="number" value={income} onChange={e => setIncome(+e.target.value)} placeholder="Income" />
            <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} placeholder="Amount" />
            <button onClick={handleCalculateTaxes}>Calculate Taxes</button>
            <p>VAT: {taxes.vat.toFixed(2)}</p>
            <p>Income Tax: {taxes.incomeTax.toFixed(2)}</p>
        </div>
    );
};

export default TaxDisplay;
