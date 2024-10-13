import { FormEvent, useState } from "react";
import { TokenDto } from "../../api/dto/AuthenticationDto";
import { useAuthSet } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi";
import { AxiosError } from "axios";
import { AuthForm } from "./AuthForm";

export function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const setAuth = useAuthSet()!!
    const navigate = useNavigate()

    function login(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        if (loading)
            return
        setError(null)
        APIAxios<TokenDto>(APIRoutes.POSTLogin({email, password}), setLoading)
            .then(token => {
                setAuth(token)
                navigate('/')
            }).catch((e: AxiosError) => {
                switch(e.status) {
                    case 401: setError("L'email ou le mot de passe est incorrect.")
                        break
                    case 403: APIAxios(APIRoutes.POSTSendActivationKey(email), setLoading)
                            .then(() => navigate(`/activate/${email}`))
                            .catch(() => setError(UNKNOWN_ERROR))
                        break
                    default: setError(UNKNOWN_ERROR)
                }
            })
    }
    return (
        <AuthForm
            title="Se connecter"
            onSubmit={login}
            loading={loading}
            error={error}
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
                },
                {
                    name: "Mot de passe",
                    input: {
                        id: "password",
                        value: password,
                        onChange: setPassword,
                        type: "password",
                        placeholder: "Saisir votre mot de passe",
                    }
                }
            ]}
            links={[
                {
                    name: "Réinitialiser le mot de passe",
                    to: "/reset-password",
                },
                {
                    name: "Créer un compte",
                    to: "/register",
                }
            ]}
        />
    )
}