"use client"

import { useTransition, useState } from "react"
import { useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "../schemas/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { authService } from "../services/authService";

export const useRegisterForm = () => {
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = (data: RegisterFormValues) => {
        startTransition(async () => {
            setServerError(null);
            logger.info("REGISTER_FORM", "Iniciando intento de registro para: ", data.email);

            if (data.password !== data.confirmPassword) {
                setServerError("Las contraseñas no coinciden");
                return;
            }

            try {
                await authService.register({
                    name: data.name,
                    lastname: data.lastname,
                    email: data.email,
                    password: data.password,
                });
                logger.info("REGISTER_FORM", "Registro exitoso. Sesión iniciada.");

                window.location.href = "/login";
            } catch (err: unknown) {
                const msg = getApiErrorMessage(err, "No se pudo completar el registro");
                setServerError(msg);
                logger.error("REGISTER_FORM", "Fallo en el registro del usuario", msg);
            }
        });
    }

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading: isPending,
        serverError,
    }
}