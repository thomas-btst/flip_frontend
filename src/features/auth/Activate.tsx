import { FormEvent, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi";
import { AxiosError } from "axios";
import { AuthForm } from "./AuthForm";
import { useAuthSet } from "../../contexts/AuthContext";

export function Activate({email}: {email: string}) {
    const setAuth = useAuthSet()

    const [code, setCode] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    function activate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(loading)
            return

        APIAxios(APIRoutes.POSTActivateUser({
            email,
            activationKey: code
        }), setLoading)
            .then(token => {
                setAuth(token)
                navigate("/")
            }).catch((e: AxiosError) => {
                switch(e.status) {
                    case 403: setError("La clé d'activation est invalide.")
                        break
                    default: setError(UNKNOWN_ERROR)
                }
            })
    }

    function resendActivationKey(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setError(null)
        APIAxios(APIRoutes.POSTSendActivationKey(email))
            .catch(() => {setError(UNKNOWN_ERROR)})
    }

    return (
        <AuthForm
            title="Valider l'adresse email"
            onSubmit={activate}
            loading={loading}
            error={error}
            submit="Activer le compte"
            reload={resendActivationKey}
            prev="/login"
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
                }
            ]}
        />
    )
}