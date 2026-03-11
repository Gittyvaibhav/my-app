"use client"

import { useAuthStore } from '@/store/Auth'
import React from 'react'

const LoginPage = () => {
  const { login } = useAuthStore()
  const [isLoading, setISLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //collect data
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    //validation
    if (!email || !password) {
      setError(() => "Please fill out all the fields")
      return
    }

    //login
    setISLoading(true)
    setError("")

    const response = await login(email.toString(), password.toString())
  if (response.error) {
      setError(() => response.error!.message)
    }
    setISLoading(() => false)
  }

  return (
    <div>
      {error && (
        <p>{error}</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          disabled={isLoading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
