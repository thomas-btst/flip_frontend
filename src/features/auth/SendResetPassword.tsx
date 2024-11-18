import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi";
import { AuthForm } from "./AuthForm";

export function SendResetPassword() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function sendResetPasswordKey(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if(loading)
            return
        setError(null)

        APIAxios(APIRoutes.POSTSendResetPasswordKey(email), setLoading)
            .then(() => {navigate(`/reset-password/${email}`)})
            .catch(() => {setError(UNKNOWN_ERROR)})
    }

    const [email, setEmail] = useState("")

    return (
        <AuthForm
            title="Réinitialiser le mot de passe"
            onSubmit={sendResetPasswordKey}
            loading={loading}
            error={error}
            submit="Continuer"
            prev="/login"
            inputs={[
                {
                    name: "Email",
                    input: {
                        id: "email",
                        value: email,
                        onChange: setEmail,
                        type: "email",
                        placeholder: "Saisir votre email",
                        required: true,
                    }
                }
            ]}
        />
    )
}