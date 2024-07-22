import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as jose from "jose";

const verifyAccessToken = async (accessToken?: string) => {
  if (!accessToken) {
    return false;
  }

  try {
    const publicKey = await jose.importSPKI(
      Buffer.from(
        process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY || "",
        "base64",
      ).toString("ascii"),
      "RS256",
    );
    await jose.jwtVerify(accessToken, publicKey, {
      algorithms: ["RS256"],
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/portfolio", request.url));
  }

  const isLoggedIn = await verifyAccessToken(
    request.cookies.get("access_token")?.value,
  );

  if (request.nextUrl.pathname.startsWith("/portfolio") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/auth") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
