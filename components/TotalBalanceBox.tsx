import React, { useState, useEffect } from 'react';
import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';

// interface TotalBalanceBoxProps {
//     // Remove totalReturns from props as it's no longer needed
// }

const TotalBalanceBox = () => {
    const [taxDetails, setTaxDetails] = useState({ total: 0, vat: 0, incomeTax: 0 });

    const fetchTaxLiability = async () => {
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
            setTaxDetails({
                total: data.vat + data.incomeTax,
                vat: data.vat,
                incomeTax: data.incomeTax
            });
        } catch (error) {
            console.error('Failed to fetch tax liability:', error);
        }
    };

    useEffect(() => {
        fetchTaxLiability();
    }, []);

    const taxTypes = [
        { name: 'VAT', value: taxDetails.vat },
        { name: 'Income Tax', value: taxDetails.incomeTax }
    ];

    return (
        <section className='total-balance'>
            <div className='total-balance-chart'>
                <DoughnutChart taxTypes={taxTypes} />
            </div>
            <div className='flex flex-col gap-6'>
                <h2 className='header-2'>
                    Total Tax Liability
                </h2>
                <div className='total-balance-amount flex-center gap-2'>
                    <AnimatedCounter amount={taxDetails.total} />
                </div>
                <div className='tax-breakdown'>
                    <p>VAT: ₦{taxDetails.vat.toFixed(2)}</p>
                    <p>Income Tax: ₦{taxDetails.incomeTax.toFixed(2)}</p>
                </div>
            </div>
        </section>
    );
}

export default TotalBalanceBox;




// import AnimatedCounter from './AnimatedCounter'
// import DoughnutChart from './DoughnutChart'

// const TotalBalanceBox = ({ taxTypes = [],totalReturns, totalTaxLiability
// }: TotalBalanceBoxProps) => {
//   return (
//     <section className='total-balance'>
//         <div className='total-balace-chart'>
//            <DoughnutChart taxTypes={taxTypes} />
//         </div>

//         <div className='flex flex-col gap-6'>
//             <h2 className='header-2'>
//                 Tax Returns: {totalReturns}
//             </h2>
//             <div className='flex flex-col gap-2'>
//                 <p className='total-balance-label'>
//                     Total Tax Liability
//                 </p>

//                 <div className='total-balance-amount flex-center gap-2'>
//                     <AnimatedCounter amount={totalTaxLiability} />
//                 </div>
//             </div>
//         </div>
//     </section>
//   )
// }

// export default TotalBalanceBox