import React from 'react'

const NoUser = () => {
  return (
    <div className="hidden md:col-span-9  bg-white mt-1 ms-1 rounded-md md:flex items-center justify-center min-h-screen" >
      <div className=' w-full flex flex-col items-center text-center px-4'>
      <i className="fa-regular fa-message text-4xl text-black"></i><br />
        <p className='text-gray-500'>Its a great web for chatting created by <br /> Mrs. Ayush Tiwari</p>
      </div>
    </div>
  )
}

export default NoUser
