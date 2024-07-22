"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa6";
import { clsx } from "clsx";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch(process.env.API_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    setIsLoading(false);

    if (response.ok) {
      router.push("/");
    } else {
      setIsError(true);
    }
  }

  return (
    <>
      <div
        className={clsx(
          "absolute block w-80 top-4 right-4 transition-opacity opacity-0",
          { "opacity-100": isError },
        )}
      >
        <div
          role="alert"
          className="rounded border-s-4 border-red-500 bg-red-50 p-4"
        >
          <div className="flex items-center gap-2 text-red-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>

            <strong className="block font-medium">
              Invalid username or password
            </strong>
          </div>

          <p className="mt-2 text-sm text-red-700">
            Please check your username and password and try again.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <form
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
            onSubmit={handleSubmit}
          >
            <p className="text-center text-lg font-medium">
              Login to your account
            </p>

            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>

              <div className="relative">
                <input
                  name="username"
                  type="text"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  type="password"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
                disabled={isLoading}
              type="submit"
              className="flex w-full justify-center items-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white text-center"
            >
              <FaSpinner
                className={clsx("animate-spin", {
                  hidden: !isLoading,
                })}
                size={20}
              />
              <span
                className={clsx({
                  hidden: isLoading,
                })}
              >
                Login
              </span>
            </button>

            <p className="text-center text-sm text-gray-500">
              No account?
              <Link className="underline" href="/auth/register">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
