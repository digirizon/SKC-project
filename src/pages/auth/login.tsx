
import React, { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login with dummy account
    if (email === "dummy@example.com" || email.length > 0) {
      setTimeout(() => {
        setIsLoading(false)
        router.push("/")
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Log In - 3rdHub</title>
        <meta name="description" content="Log in to your 3rdHub account" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="text-4xl font-bold">
                <span className="text-blue-600">3rd</span>
                <span className="text-orange-500">Hub</span>
              </div>
            </Link>
          </div>

          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Log in to your account
              </CardTitle>
              <p className="text-gray-600">
                Welcome back! Please enter your details.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 text-white hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign up
                    </Link>
                  </span>
                </div>
              </form>

              {/* Demo Account Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Demo Account:</strong> Use any email (e.g., dummy@example.com) with any password to test the login.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
