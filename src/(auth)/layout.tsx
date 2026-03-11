"use client"

import { useAuthStore } from "@/store/Auth"
import React from "react"
import { useRouter } from "next/navigation" 

const Layout = ({ children }: { children: React.ReactNode }) =>
{
  const {session}=useAuthStore()
  const router =useRouter()

  React.useEffect(()=>{ 
    if(session) router.push("/dashboard")
  },[session]) 
if(session){
    return null
}
return(
    <div className="">
        <div className="div">{children}</div>
    </div>
)
}




export default Layout
