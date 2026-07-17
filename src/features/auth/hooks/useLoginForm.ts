
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginFormValues, loginSchema } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { authService } from "../services/authService";

export const useLoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormValues) => {
        startTransition(async () => {
            setServerError(null);
            logger.info("LOGIN_FORM", `Iniciando intento de login para: ${data.email}`);

            try {
                await authService.login(data.email, data.password);
                logger.info(
                    "LOGIN_FORM",
                    "Autenticación exitosa. Sincronizando sesión...",
                );

                router.push("/");
            } catch (err: unknown) {
                const msg = getApiErrorMessage(
                    err,
                    "No se pudo iniciar sesión. Revisá tu email y contraseña.",
                );
                setServerError(msg);
                logger.error("LOGIN_FORM", "Fallo en la autenticación", msg);
            }
        });
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading: isPending,
        serverError,
    };
}