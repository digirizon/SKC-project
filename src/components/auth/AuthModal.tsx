import React, { useState } from "react"
import { X, Chrome } from "lucide-react" // Added Chrome icon for Google
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import authService from "@/services/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onSwitchMode: (mode: "login" | "signup") => void;
  onSuccess?: (email: string) => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode, onSuccess }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { data } = await authService.signUp(formData.email, formData.password, formData.name);
        if (data.user) {
          onSuccess?.(data.user.email || formData.email);
          onClose();
        }
      } else {
        const { data } = await authService.signIn(formData.email, formData.password);
        if (data.user) {
          onSuccess?.(data.user.email);
          onClose();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signInError } = await authService.signInWithGoogle();
      if (signInError) throw signInError;
      // Supabase handles redirection, onSuccess might be called on redirect page or via auth state change
      // For now, we can close the modal, AuthContext will pick up the change.
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An OAuth error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-0">
        {/* Removed manual backdrop: <div className="fixed inset-0 bg-black/50 z-40" /> */}
        <div className="relative bg-white rounded-lg p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {mode === "login" ? "Log in to your account" : "Create your account"}
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-600">
              {mode === "login" 
                ? "Welcome back! Please enter your details." 
                : "Join thousands of learners in our communities"
              }
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="mt-1"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={mode === "login" ? "Enter your password" : "Create a password"}
                className="mt-1"
                required
              />
            </div>

            {mode === "signup" && (
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="mt-1"
                  required
                />
              </div>
            )}

            {mode === "login" && (
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
                <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </button>
              </div>
            )}

            {mode === "signup" && (
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading 
                ? (mode === "login" ? "Signing in..." : "Creating account...") 
                : (mode === "login" ? "Sign in" : "Create account")
              }
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4" /> {/* Using Chrome icon as a stand-in for Google logo */}
              Google
            </Button>

            <div className="text-center mt-2"> {/* Adjusted margin top */}
              <span className="text-sm text-gray-600">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => onSwitchMode(mode === "login" ? "signup" : "login")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </span>
            </div>
          </form>

          {mode === "login" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo:</strong> Use any email with any password to test login.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                {error}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
