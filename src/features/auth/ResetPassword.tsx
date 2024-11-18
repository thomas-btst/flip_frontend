import { FormEvent, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi";
import { useAuthSet } from "../../contexts/AuthContext";
import { AxiosError } from "axios";
import { AuthForm } from "./AuthForm";

export function ResetPassword({email}: {email: string}) {
    const navigate = useNavigate()

    const setAuth = useAuthSet()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [code, setCode] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")

    function resetPassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if(loading)
            return
        setError(null)

        if(password1 != password2) {
            setError("Les mots de passe sont différents")
            return
        }

        APIAxios(APIRoutes.POSTResetPassword({
            email: email,
            newPassword: password1,
            verificationKey: code,
        }), setLoading).then(token => {
            setAuth(token)
            navigate("/")
        }).catch((e: AxiosError) => {
            switch(e.status) {
                case 403: setError("Code invalide ou expiré.")
                    break
                default: setError(UNKNOWN_ERROR)
            }
        })
    }

    function resendCode(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setError(null)
        APIAxios(APIRoutes.POSTSendResetPasswordKey(email))
            .catch(() => {setError(UNKNOWN_ERROR)})
    }

    return (
        <AuthForm
            title="Réinitialiser le mot de passe"
            onSubmit={resetPassword}
            loading={loading}
            error={error}
            prev="/reset-password"
            reload={resendCode}
            inputs={[
                {
                    name: "Code",
                    input: {
                        id: "code",
                        value: code,
                        onChange: setCode,
                        type: "text",
                        placeholder: "Saisir le code reçu par email",
                        maxLength: 6,
                        minLength: 6,
                        required: true,
                    }
                },
                {
                    name: "Nouveau mot de passe",
                    input: {
                        id: "password1",
                        value: password1,
                        onChange: setPassword1,
                        type: "password",
                        placeholder: "Saisir le nouveau mot de passe"
                    }
                },
                {
                    name: "Répéter le mot de passe",
                    input: {
                        id: "password2",
                        value: password2,
                        onChange: setPassword2,
                        type: "password",
                        placeholder: "Répéter le mot de passe"
                    }
                },
            ]}
        />
    )
}