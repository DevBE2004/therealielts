// "use client"

// import { HonorService } from '@/services/honor.service'
// import Link from 'next/link'
// import { redirect } from 'next/navigation'

// // async function handleSubmit(formData) {
// //   const honorData = {
// //     name: formData.get('name'),
// //     email: formData.get('email'),
// //     photo: formData.get('photo'),
// //     achievement: formData.get('achievement'),
// //     awardDate: formData.get('awardDate'),
// //     isPublic: formData.get('isPublic') === 'true',
// //   }
// //   const id = formData.get('id')



// export default function HonorManager() {
//   // const { data: honors, total } = await HonorService.list()

  
//   const selectedHonor = honors.find(h => h.id === parseInt(searchParams.id)) || null
//   const page = parseInt(searchParams.page || '1', 10)
//   const limit = 10
//   const totalPages = Math.ceil(total / limit)

//   return ( 
//     <div className='container mx-auto p-4'>
//       <div className='flex justify-between items-center mb-4'>
//         <h1 className='text-2xl font-bold text-gray-800'>Honor Management</h1>
//         <Link
//           href='/honors?add=true'
//           className='bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm'
//         >
//           Add New Honor
//         </Link>
//       </div>

//       {(searchParams.add || selectedHonor) && (
//         <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
//           <div className='bg-white p-5 rounded-lg w-full max-w-md'>
//             <h2 className='text-lg font-bold mb-3'>{selectedHonor ? 'Edit Honor' : 'Add Honor'}</h2>
//             <form action={handleSubmit}>
//               {selectedHonor && <input type='hidden' name='id' value={selectedHonor.id} />}
//               <div className='mb-3'>
//                 <label className='block text-xs font-medium text-gray-700'>Name</label>
//                 <input
//                   type='text'
//                   name='name'
//                   defaultValue={selectedHonor?.name || ''}
//                   className='mt-1 p-1.5 w-full border rounded text-sm'
//                   required
//                 />
//               </div>
//               <div className='mb-3'>
//                 <label className='block text-xs font-medium text-gray-700'>Email</label>
//                 <input
//                   type='email'
//                   name='email'
//                   defaultValue={selectedHonor?.email || ''}
//                   className='mt-1 p-1.5 w-full border rounded text-sm'
//                   required
//                 />
//               </div>
//               <div className='mb-3'>
//                 <label className='block text-xs font-medium text-gray-700'>Photo URL</label>
//                 <input
//                   type='url'
//                   name='photo'
//                   defaultValue={selectedHonor?.photo || ''}
//                   className='mt-1 p-1.5 w-full border rounded text-sm'
//                 />
//               </div>
//               <div className='mb-3'>
//                 <label className='block text-xs font-medium text-gray-700'>Achievement</label>
//                 <textarea
//                   name='achievement'
//                   defaultValue={selectedHonor?.achievement || ''}
//                   className='mt-1 p-1.5 w-full border rounded text-sm'
//                   required
//                 />
//               </div>
//               <div className='mb-3'>
//                 <label className='block text-xs font-medium text-gray-700'>Award Date</label>
//                 <input
//                   type='date'
//                   name='awardDate'
//                   defaultValue={
//                     selectedHonor?.awardDate
//                       ? new Date(selectedHonor.awardDate).toISOString().split('T')[0]
//                       : ''
//                   }
//                   className='mt-1 p-1.5 w-full border rounded text-sm'
//                   required
//                 />
//               </div>
//               <div className='mb-3'>
//                 <label className='block text-xs font-medium text-gray-700'>Status</label>
//                 <select
//                   name='isPublic'
//                   defaultValue={selectedHonor?.isPublic ? 'true' : 'false'}
//                   className='mt-1 p-1.5 w-full border rounded text-sm'
//                 >
//                   <option value='true'>Public</option>
//                   <option value='false'>Private</option>
//                 </select>
//               </div>
//               <div className='flex justify-end gap-2'>
//                 <Link
//                   href='/honors'
//                   className='px-3 py-1.5 bg-gray-300 rounded hover:bg-gray-400 text-sm'
//                 >
//                   Cancel
//                 </Link>
//                 <button
//                   type='submit'
//                   className='px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm'
//                 >
//                   {selectedHonor ? 'Update' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className='bg-white shadow-md rounded-lg'>
//         <div className='overflow-x-auto'>
//           <table className='min-w-full divide-y divide-gray-200 table-fixed'>
//             <thead className='bg-gray-50'>
//               <tr>
//                 <th className='w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   Photo
//                 </th>
//                 <th className='w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   Name
//                 </th>
//                 <th className='w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   Email
//                 </th>
//                 <th className='w-56 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   Achievement
//                 </th>
//                 <th className='w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   Award Date
//                 </th>
//                 <th className='w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   Status
//                 </th>
//                 <th className='w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   Created
//                 </th>
//                 <th className='w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className='bg-white divide-y divide-gray-200'>
//               {honors.length ? (
//                 honors.map(honor => (
//                   <tr key={honor.id} className='hover:bg-gray-50'>
//                     <td className='px-3 py-3'>
//                       <img
//                         src={honor.photo || '/placeholder.png'}
//                         alt={honor.name}
//                         className='h-8 w-8 rounded-full object-cover'
//                       />
//                     </td>
//                     <td className='px-3 py-3 text-sm font-medium text-gray-900 truncate'>
//                       {honor.name}
//                     </td>
//                     <td className='px-3 py-3 text-sm text-gray-500 truncate'>{honor.email}</td>
//                     <td className='px-3 py-3 text-sm text-gray-500'>
//                       <div className='max-w-48 truncate' title={honor.achievement}>
//                         {honor.achievement}
//                       </div>
//                     </td>
//                     <td className='px-3 py-3 text-sm text-gray-500'>
//                       {new Date(honor.awardDate).toLocaleDateString()}
//                     </td>
//                     <td className='px-3 py-3 text-sm'>
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           honor.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {honor.isPublic ? 'Public' : 'Private'}
//                       </span>
//                     </td>
//                     <td className='px-3 py-3 text-sm text-gray-500'>
//                       {honor.createdAt ? new Date(honor.createdAt).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className='px-3 py-3 text-sm'>
//                       <Link
//                         href={`/honors?id=${honor.id}`}
//                         className='text-blue-500 hover:text-blue-700 mr-2'
//                       >
//                         Edit
//                       </Link>
//                       <form action={handleDelete.bind(null, honor.id)} className='inline'>
//                         <button type='submit' className='text-red-500 hover:text-red-700'>
//                           Delete
//                         </button>
//                       </form>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={8} className='px-3 py-3 text-center text-sm text-gray-500'>
//                     No honors found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//         <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
//           <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
//             <div>
//               <p className='text-sm text-gray-700'>
//                 Showing <span className='font-medium'>{(page - 1) * limit + 1}</span> to{' '}
//                 <span className='font-medium'>{Math.min(page * limit, total)}</span> of{' '}
//                 <span className='font-medium'>{total}</span> results
//               </p>
//             </div>
//             <div>
//               <nav
//                 className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
//                 aria-label='Pagination'
//               >
//                 <Link
//                   href={`?page=${page > 1 ? page - 1 : 1}`}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
//                     page === 1 ? 'cursor-not-allowed opacity-50' : ''
//                   }`}
//                 >
//                   Previous
//                 </Link>
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <Link
//                     key={i + 1}
//                     href={`?page=${i + 1}`}
//                     className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${
//                       page === i + 1 ? 'bg-gray-100' : ''
//                     }`}
//                   >
//                     {i + 1}
//                   </Link>
//                 ))}
//                 <Link
//                   href={`?page=${page < totalPages ? page + 1 : totalPages}`}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
//                     page === totalPages ? 'cursor-not-allowed opacity-50' : ''
//                   }`}
//                 >
//                   Next
//                 </Link>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className='block sm:hidden space-y-4 mt-4'>
//         {honors.length ? (
//           honors.map(honor => (
//             <div key={honor.id} className='bg-white p-4 rounded-lg shadow'>
//               <div className='flex items-center space-x-4'>
//                 <img
//                   className='h-12 w-12 object-cover rounded-full'
//                   src={honor.photo || '/placeholder.png'}
//                   alt={honor.name}
//                 />
//                 <div className='flex-1'>
//                   <p className='text-sm font-medium text-gray-900 truncate'>{honor.name}</p>
//                   <p className='text-sm text-gray-500 truncate'>{honor.email}</p>
//                   <p className='text-sm text-gray-500 truncate'>{honor.achievement}</p>
//                   <p className='text-sm text-gray-500'>
//                     Award: {new Date(honor.awardDate).toLocaleDateString()}
//                   </p>
//                   <p className={`text-sm ${honor.isPublic ? 'text-green-600' : 'text-red-600'}`}>
//                     {honor.isPublic ? 'Public' : 'Private'}
//                   </p>
//                   <p className='text-sm text-gray-500'>
//                     Created:{' '}
//                     {honor.createdAt ? new Date(honor.createdAt).toLocaleDateString() : 'N/A'}
//                   </p>
//                 </div>
//               </div>
//               <div className='flex space-x-2 mt-2'>
//                 <Link
//                   href={`/honors?id=${honor.id}`}
//                   className='text-blue-500 hover:text-blue-700 text-sm'
//                 >
//                   Edit
//                 </Link>
//                 <form action={handleDelete.bind(null, honor.id)} className='inline'>
//                   <button type='submit' className='text-red-500 hover:text-red-700 text-sm'>
//                     Delete
//                   </button>
//                 </form>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className='bg-white p-4 rounded-lg shadow text-center text-sm text-gray-500'>
//             No honors found.
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
