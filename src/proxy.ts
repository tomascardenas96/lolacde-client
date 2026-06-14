import { NextResponse } from "next/server";

/**
 * Proxy (ex middleware) de seguridad.
 *
 * Nota de arquitectura: la sesión se maneja con una cookie HttpOnly
 * (`access_token`) que el backend planta en SU propio origen. Con el front y el
 * back en orígenes distintos (ver CORS + `withCredentials`), el navegador no
 * envía esa cookie al servidor de Next, por lo que NO se puede "gatear" la
 * autenticación acá sin desloguear a todos. La protección de rutas vive en los
 * guards de cliente (`AuthInitializer`, `AdminGuard`) y, de forma real, en el
 * `RoleGuard` del backend. Este proxy solo agrega cabeceras de seguridad.
 */
export function proxy() {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

export const config = {
  // Aplica a todo salvo assets estáticos y rutas internas de Next.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
