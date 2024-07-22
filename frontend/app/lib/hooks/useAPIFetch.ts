import { useState } from "react";
import { getCookie } from "cookies-next";

interface APIResponse<TData> {
  data: TData;
  status: "success" | "fail";
}

export const useAPIFetch = <TData>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  apiPath: string,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<APIResponse<TData>>();
  const [isError, setIsError] = useState(false);

  const request = async (body?: any) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await fetch(process.env.API_URL + "/api" + apiPath, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { request, isLoading, response, isError };
};
