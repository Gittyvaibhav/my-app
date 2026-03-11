"use client"

import { useAuthStore } from '@/store/Auth'
import React from 'react'

const RegisterPage = () => {
  const {createAccount}=useAuthStore()
  const[isLoading,setISLoading]=React.useState(false)
  const[error,setError]=React.useState("")

  const handleSubmit=async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()

    //collect data
    const formData=new FormData(e.currentTarget)
    const firstName=formData.get("firstName")
    const lastName=formData.get("lastName")
    const email=formData.get("email")
    const password=formData.get("password")
    

    //validate

    if(!firstName ||!lastName||!email||!password){
        setError(()=>"Please fill out all the fields")
        return
    }

    //call the store
    setISLoading(true)
    setError("")

   const response= await createAccount(email.toString(),password.toString())
    if(response.error){
        setError(()=>response.error!.message)
    }
    setISLoading(()=>false)

  }
  return (
    <div>{error&&(
        <p>{error}</p>
    )}
    <form onSubmit={handleSubmit}></form>
    </div>
  )
}

export default RegisterPage
