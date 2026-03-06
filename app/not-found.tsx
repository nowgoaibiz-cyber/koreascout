import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1916] px-4 py-12">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <Logo className="w-48 h-auto mx-auto mb-8" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Intelligence Not Found.</h1>
        <p className="text-sm text-gray-600 mb-8">
          The path you are looking for does not exist in our archive.
        </p>
        <Link
          href="/"
          className="inline-block w-full bg-[#1A1916] text-white font-bold py-3 rounded-xl hover:bg-black transition-colors text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
