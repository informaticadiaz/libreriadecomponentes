'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WelcomeScreen } from "@/components/maq/welcom/WelcomeScreen"

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStart = async () => {
    setIsLoading(true)
    try {
      // Add your registration/onboarding logic here
      // For example:
      // await startOnboarding()
      
      // Navigate to registration page
      router.push('/register')
    } catch (error) {
      console.error('Error starting onboarding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // Add your login navigation logic here
      // For example:
      // await redirectToLogin()
      
      // Navigate to login page
      router.push('/login')
    } catch (error) {
      console.error('Error navigating to login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WelcomeScreen
      onStart={handleStart}
      onLogin={handleLogin}
      appName="MyApp"
      isLoading={isLoading}
      subtitle="Encuentra tu hogar ideal con la confianza de profesionales inmobiliarios"
    />
  )
}