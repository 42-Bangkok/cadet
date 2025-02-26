"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useLinkCodeStore } from "./store";

export default function Page() {
  const { linkCode, setLinkCode, clearLinkCode } = useLinkCodeStore();
  const [inputCode, setInputCode] = useState(linkCode);
  const [isLinking, setIsLinking] = useState(false);
  const [linkResult, setLinkResult] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Save code regardless of auth state
    setLinkCode(inputCode);

    if (isAuthenticated) {
      try {
        setIsLinking(true);
        // Make API call to link accounts
        const response = await fetch("/api/link-discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ linkCode: inputCode }),
        });

        const data = await response.json();

        if (response.ok) {
          setLinkResult({
            success: true,
            message: "Discord account linked successfully!",
          });
          clearLinkCode();
        } else {
          setLinkResult({
            success: false,
            message: data.error || "Failed to link account.",
          });
        }
      } catch (error) {
        setLinkResult({
          success: false,
          message: "An error occurred while linking your account.",
        });
      } finally {
        setIsLinking(false);
      }
    } else {
      setLinkResult({
        success: true,
        message:
          "Link code saved. Please log in to complete the linking process.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Link Discord</h1>
      <p className="mb-2">
        This page is used to link your Discord account to your user account.
      </p>
      <p className="mb-2">
        You can link your Discord account by entering the link code you received
        in the Discord bot.
      </p>
      <p className="mb-6">
        If you have not received a link code, please check the Discord bot
        settings.
      </p>
      <form onSubmit={handleSubmit} className="mb-4">
        <label
          htmlFor="linkCode"
          className="block text-sm font-medium text-gray-700"
        >
          Link Code
        </label>
        <input
          type="text"
          id="linkCode"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <button
          type="submit"
          className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLinking}
        >
          {isLinking ? "Linking..." : "Link Discord"}
        </button>
      </form>
      {linkResult.message && (
        <p
          className={`mt-2 text-sm ${
            linkResult.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {linkResult.message}
        </p>
      )}
    </div>
  );
}
