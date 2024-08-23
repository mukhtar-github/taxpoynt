import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import TaxReturnCard from './TaxReturnCard'

interface RightSidebarProps {
  user: {
    name?: string;
    email?: string;
  };
  taxReturns: Array<{
    $id: string;
    taxReturnId: string;
    taxPeriod: string;
    documentUrl: string;
    status: string;
    currentBalance: number;
    type: string;
    year: string;
    dueDate: string;
  }>;
}

const RightSidebar = ({ user, taxReturns }: RightSidebarProps) => {
  return (
    <aside className='right-sidebar'>
      <section className='flex flex-col pb-8'>
        <div className='profile-banner'/>
        <div className='profile'>
          <div className='profile-img'>
            <span className='text-5xl font-bold text-blue-500'>
              {user?.name?.[0] || ''}
            </span>
          </div>
          <div className='profile-details'>
            <h1 className='profile-name'>{user?.name || 'User'}</h1>
            <p className='profile-email'>{user?.email || 'No email'}</p>
          </div>
        </div>
      </section>

      <section className='banks'>
        {taxReturns?.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            {taxReturns.slice(0, 2).map((taxReturn) => (
              <TaxReturnCard
                key={taxReturn.$id}
                taxReturn={taxReturn}
              />
            ))}
            <Link href="/tax-returns" className="text-blue-500 hover:underline text-sm">
              View All Tax Returns
            </Link>
          </div>
        )}
      </section>
    </aside>
  )
}

export default RightSidebar




// import Image from 'next/image'
// import Link from 'next/link'
// import React from 'react'
// import TaxReturnCard from './TaxReturnCard'

// const RightSidebar = ({ user, transactions, taxReturns }: RightSidebarProps) => {
//   console.log("User data:", user);  // This will log the user data to the console

//   return (
//     <aside className='right-sidebar'>
//         <section className='flex flex-col pb-8'>
//             <div className='profile-banner'/>
//             <div className='profile'>
//                 <div className='profile-img'>
//                     <span className='text-5xl font-bold text-blue-500'>
//                     {user?.name?.[0] || ''}
//                     </span>
//                 </div>
                
//                 <div className='profile-details'>
//                     <h1 className='profile-name'>{user?.name || 'User'}</h1>
//                     <p className='profile-email'>{user?.email || 'No email'}</p>
//                 </div>
//             </div>
//         </section>

//         <section className='banks'>
//             <div className='flex w-full justify-between'>
//                 <h2 className='header-2'>My Tax Returns</h2>
//                 <Link href='/' className='flex gap-2'>
//                     <Image
//                         src='/icons/plus.svg'
//                         width={20}
//                         height={20}
//                         alt='plus'
//                     />
//                     <h2 className='text-14 font-semibold text-grey-600'>
//                         Add Tax Return
//                     </h2>
//                 </Link>
//             </div>

//             {taxReturns?.length > 0 && (
//                 <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
//                     <div className='relative z-10'>
//                     <TaxReturnCard
//                         key={taxReturns[0].$id}
//                         taxReturn={taxReturns[0]}
//                         userName={user?.name || 'User'}
//                         showBalance={false}
//                     />
//                     </div>
//                     {taxReturns[1] && (
//                         <div className='absolute right-0 top-8 z-0 w-[90%]'>
//                             <TaxReturnCard
//                                 key={taxReturns[1].$id}
//                                 taxReturn={taxReturns[1]}
//                                 userName={user?.name || 'User'}
//                                 showBalance={false}
//                             />
//                         </div>
//                     )}
//                 </div>
//             )}

//         </section>
//     </aside>
//   )
// }

// export default RightSidebar