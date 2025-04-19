import Link from "next/link"
import Navigation from "@/components/layout/Navigation"
import Footer from "@/components/layout/Footer"

interface ErrorDisplayProps {
  message: string;
  redirectUrl?: string;
  redirectText?: string;
}

export default function ErrorDisplay({ 
  message, 
  redirectUrl = "/login", 
  redirectText = "Go to Login" 
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-pink-200 flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-16 text-center flex-grow">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-xl">{message}</p>
        {redirectUrl && (
          <Link href={redirectUrl} className="mt-8 inline-block bg-primary px-8 py-3 text-white rounded-md">
            {redirectText}
          </Link>
        )}
      </div>
      <Footer />
    </div>
  )
} 