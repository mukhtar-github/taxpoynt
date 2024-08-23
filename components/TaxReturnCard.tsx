import { formatAmount } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

interface TaxReturnCardProps {
  taxReturn: {
    $id: string;
    taxReturnId: string;
    taxPeriod: string;
    documentUrl: string;
    status: string;
    currentBalance: number;
    type: string;
    year: string;
    dueDate: string;
  };
}

const TaxReturnCard = ({ taxReturn }: TaxReturnCardProps) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='text-lg font-semibold'>{taxReturn.type} - {taxReturn.year}</h2>
        <span className={`px-2 py-1 rounded-full text-sm ${
          taxReturn.status === 'Paid' ? 'bg-green-100 text-green-800' :
          taxReturn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {taxReturn.status}
        </span>
      </div>
      <p className='text-gray-600 mb-2'>Due: {taxReturn.dueDate}</p>
      <p className='text-xl font-bold mb-3'>{formatAmount(taxReturn.currentBalance)}</p>
      <Link href={`/tax-return/${taxReturn.taxReturnId}`} 
            className='text-blue-500 hover:text-blue-700 font-medium'>
        View Details
      </Link>
    </div>
  )
}

export default TaxReturnCard




// import { formatAmount } from '@/lib/utils'
// import Image from 'next/image'
// import Link from 'next/link'
// import React from 'react'

// interface CreditCardProps {
//   taxReturn: {
//     currentBalance: number;
//     // other properties
//   };
//   userName: string;
//   showBalance?: boolean;
// }

// const TaxReturnCard = ({ taxReturn, userName, showBalance = true }: CreditCardProps) => {
//   return (
//     <div className='flex flex-col'>
//         <Link href='/' className='bank-card'>
//             <div className='bank-card_content'>
//                 <div>
//                    <h1 className='text-16 font-semibold text-white'>
//                         {userName}
//                         {/* {taxReturn.type} - {taxReturn.year} */}
//                     </h1>
//                     <p className='font-ibm-plex-serif font-black text-white'>
//                     {formatAmount(taxReturn.currentBalance)}
//                     {/* Due Date: {taxReturn.dueDate} */}
//                     </p>               
//                 </div>
//                 <article className='flex flex-col gap-2'>
//                   <div className='flex justify-between'>
//                     <h1 className='text-12 text-semibold text-white'>
//                       {userName}
//                     </h1>
//                     <h2 className='text-12 text-semibold text-white'>
//                       ●●/●●
//                     </h2>
//                   </div>
//                   <p className='text-14 fond-semibold tracking-[1.1px] text-white'>
//                     ●●●● ●●●● ●●●● <span className='text-16'>1234</span>
//                   </p>
//                 </article>
//             </div>
//             <div className='bank-card_icon'>
//               <Image
//                 src='/icons/Paypass.svg'
//                 width={20}
//                 height={24}
//                 alt='pay'
//               />
//               <Image
//                 src='/icons/mastercard.svg'
//                 width={45}
//                 height={32}
//                 alt='mastercard'
//                 className='ml-5'
//               />
//             </div>

//             <Image
//                 src='/icons/lines.png'
//                 width={316}
//                 height={190}
//                 alt='lines'
//                 className='absolute top-0 right-0'
//               />           
//         </Link>
//         {/* COPY */}
//     </div>
//   )
// }

// export default TaxReturnCard