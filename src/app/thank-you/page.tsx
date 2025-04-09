"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAnimatedUrl } from "@/hook/useAnimatedUrl";

export default function ThankYouPage() {
  useAnimatedUrl();
  const params = useSearchParams();
  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Thank you for submitting your assignment!
      </h1>
      <p className="text-gray-700">Name: {params.get("name")}</p>
      <p className="text-gray-700">Email: {params.get("email")}</p>
      <p className="text-gray-700 mb-4">Level: {params.get("level")}</p>
      <Link passHref href="/" className="text-blue-600 underline border">
        <Button>Submit another assignment</Button>
      </Link>
    </main>
  );
}
