import { AxiosError } from "axios";

/**
 * Mensajes amigables para códigos de estado cuyo mensaje por defecto del
 * backend suele ser técnico o en inglés ("Unauthorized", "Forbidden"...) y para
 * los que no hay un texto por acción que sea más claro. Para el resto de los
 * 4xx confiamos en el `fallback` específico de cada acción.
 */
const STATUS_MESSAGES: Record<number, string> = {
  401: "Tu sesión expiró. Iniciá sesión nuevamente.",
  403: "No tenés permisos para realizar esta acción.",
  408: "La solicitud tardó demasiado. Intentá de nuevo.",
  429: "Hiciste demasiadas solicitudes. Esperá un momento e intentá de nuevo.",
};

/**
 * Traducciones de los mensajes que el backend devuelve en inglés (defaults de
 * NestJS y excepciones de auth/dominio) a español rioplatense. La clave es el
 * mensaje en minúsculas y sin punto final. Los mensajes que el backend ya manda
 * en español se muestran tal cual.
 */
const MESSAGE_TRANSLATIONS: Record<string, string> = {
  // Autenticación
  "invalid credentials": "El correo electrónico o la contraseña son incorrectos.",
  "passwords do not match": "Las contraseñas no coinciden.",
  "token expired or invalid": "El enlace expiró o no es válido. Pedí uno nuevo.",
  "token already used or invalid":
    "El enlace ya fue usado o no es válido. Pedí uno nuevo.",
  "invalid token": "El enlace no es válido o expiró.",
  "token expirado": "El enlace expiró. Pedí uno nuevo.",
  "you need a token to get access": "Tu sesión expiró. Iniciá sesión nuevamente.",
  "user not found": "No encontramos una cuenta con ese correo electrónico.",
  "invalid email": "El correo electrónico no es válido.",
  "secret key not found":
    "Ocurrió un error en el servidor. Intentá de nuevo en unos minutos.",
  // Carrito / catálogo
  "cannot checkout an empty cart": "Tu carrito está vacío.",
  "product not found": "El producto ya no está disponible.",
  "address not found": "La dirección ya no existe.",
  // Defaults genéricos de NestJS
  unauthorized: "Tu sesión expiró. Iniciá sesión nuevamente.",
  forbidden: "No tenés permisos para realizar esta acción.",
  "not found": "No encontramos lo que estás buscando.",
  "bad request": "Revisá los datos ingresados e intentá de nuevo.",
  "internal server error":
    "Ocurrió un error en el servidor. Intentá de nuevo en unos minutos.",
  "too many requests":
    "Hiciste demasiadas solicitudes. Esperá un momento e intentá de nuevo.",
  "request timeout": "La solicitud tardó demasiado. Intentá de nuevo.",
};

/** Busca una traducción para un mensaje del backend; si no hay, lo deja igual. */
const translateBackendMessage = (message: string): string => {
  const key = message.trim().toLowerCase().replace(/\.$/, "");
  return MESSAGE_TRANSLATIONS[key] ?? message.trim();
};

/** Sin conexión, CORS, timeout o servidor caído (no hubo respuesta HTTP). */
const NETWORK_ERROR =
  "No pudimos conectar con el servidor. Verificá tu conexión a internet e intentá de nuevo.";

/** Errores 5xx: el mensaje real suele ser técnico, mostramos uno genérico. */
const SERVER_ERROR =
  "Ocurrió un error en el servidor. Intentá de nuevo en unos minutos.";

const DEFAULT_FALLBACK = "Algo salió mal. Intentá de nuevo.";

/**
 * Normaliza el campo `message` del backend (NestJS), que puede ser un string o
 * un array de strings (errores de validación de class-validator), y traduce al
 * español los mensajes que llegan en inglés.
 */
const normalizeBackendMessage = (message: unknown): string | null => {
  if (Array.isArray(message)) {
    const parts = message
      .filter((m): m is string => typeof m === "string" && m.trim().length > 0)
      .map(translateBackendMessage);
    return parts.length > 0 ? parts.join(" · ") : null;
  }
  if (typeof message === "string") {
    if (message.trim().length === 0) return null;
    return translateBackendMessage(message);
  }
  return null;
};

/**
 * Traduce cualquier error (de Axios o no) a un mensaje claro y en español,
 * listo para mostrarle al usuario.
 *
 * Prioridad:
 *  1. Sin respuesta del servidor → mensaje de conexión.
 *  2. Error 5xx → mensaje genérico de servidor (oculta detalles técnicos).
 *  3. Mensaje entendible del backend (regla de negocio / validación).
 *  4. Mensaje amigable para estados como 401/403/429.
 *  5. `fallback` específico de la acción.
 *
 * @param fallback Mensaje propio de cada acción (ej. "No se pudo agregar el
 *   producto al carrito"). Se usa cuando no hay nada más específico.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string = DEFAULT_FALLBACK,
): string => {
  if (!(error instanceof AxiosError)) return fallback;

  if (!error.response) return NETWORK_ERROR;

  const { status, data } = error.response;

  if (status >= 500) return SERVER_ERROR;

  const backendMessage = normalizeBackendMessage(data?.message);
  if (backendMessage) return backendMessage;

  return STATUS_MESSAGES[status] ?? fallback;
};
