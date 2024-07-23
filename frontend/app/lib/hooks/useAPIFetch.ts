import { useState } from "react";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

interface APIResponse<TData> {
  data: TData;
  status: "success" | "fail";
}

const isTokenExpired = (token: string) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    if (!decodedToken.exp) {
      return true;
    }
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const useAPIFetch = <TData>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  apiPath: string,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<APIResponse<TData>>();
  const [error, setError] = useState("");

  const request = async (body?: any) => {
    try {
      setIsLoading(true);
      setError("");

      let accessToken = getCookie("access_token");

      if (isTokenExpired(accessToken!)) {
        await fetch(process.env.API_URL + "/api/auth/refresh", {
          method: "GET",
          body: JSON.stringify(body),
        });
        accessToken = getCookie("access_token");
      }

      const res = await fetch(process.env.API_URL + "/api" + apiPath, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResponse(data);
      return data;
    } catch (error: any) {
      console.error(error)
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { request, isLoading, response, isError: error };
};
