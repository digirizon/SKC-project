
import React from "react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
          <Link href="/community" className="hover:text-gray-900">
            Community
          </Link>
          <Link href="/affiliates" className="hover:text-gray-900">
            Affiliates
          </Link>
          <Link href="/support" className="hover:text-gray-900">
            Support
          </Link>
          <Link href="/careers" className="hover:text-gray-900">
            Careers
          </Link>
          <span className="text-gray-400">•••</span>
        </div>
        <div className="text-center mt-4 text-xs text-gray-500">
          powered by{" "}
          <span className="font-semibold">
            <span className="text-blue-600">3rd</span>
            <span className="text-orange-500">Hub</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
