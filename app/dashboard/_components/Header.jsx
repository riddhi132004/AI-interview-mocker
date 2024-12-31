"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'


function Header() {
   
    const path=usePathname();
  const router = useRouter();

 
    useEffect(() => {
        console.log(path)
    },[])

  return (
    <div className='hidden md:flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo'/>
      <ul className='flex gap-6'>
        <li onClick={() => router.push("/dashboard")}
        className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard' && 'text-primary font-bold'}
        `}>Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/Questions' && 'text-primary font-bold'}
        `
        }>Questions</li>
        <li onClick={() => router.push("/dashboard/upgrade")}
         className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/upgrade' && 'text-primary font-bold'}
        `}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
        ${path=='/dashboard/how' && 'text-primary font-bold'}
        `}>How it works?</li>
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header
