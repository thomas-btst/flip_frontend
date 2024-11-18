import { FormEvent, useState } from "react"
import { APIAxios, APIRoutes, UNKNOWN_ERROR } from "../../api/FlipApi"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { AuthForm } from "./AuthForm"

export function Register(){
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()
    
    function register(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (loading)
            return
        if (password1 != password2){
            setError("Les mots de passe sont différents.")
            return
        }
        setError(null)
        APIAxios(APIRoutes.POSTRegister({
            email,
            firstName,
            lastName,
            password: password1,
        }), setLoading).then(() => {navigate(`/activate/${email}`)})
            .catch((e: AxiosError) => {
                switch(e.status) {
                    case 409: setError("L'adresse mail est déjà utilisée.")
                        break
                    default: setError(UNKNOWN_ERROR)
                }
            })
    }
    return (
        <AuthForm
            title="Créer un compte"
            onSubmit={register}
            loading={loading}
            error={error}
            links={[
                {
                    name: "Se connecter",
                    to: "/login"
                }
            ]}
            inputs={[
                {
                    name: "Prénom",
                    input: {
                        id: "firstname",
                        value: firstName,
                        onChange: setFirstName,
                        type: "text",
                        placeholder: "Saisir votre prénom",
                        required: true,
                    }
                },
                {
                    name: "Nom",
                    input: {
                        id: "lastname",
                        value: lastName,
                        onChange: setLastName,
                        type: "text",
                        placeholder: "Saisir votre nom",
                        required: true,
                    }
                },
                {
                    name: "Email",
                    input: {
                        id: "email",
                        value: email,
                        onChange: setEmail,
                        type: "email",
                        placeholder: "Saisir votre adresse email",
                        required: true,
                    }
                },
                {
                    name: "Saisir votre mot de passe",
                    input: {
                        id: "password1",
                        value: password1,
                        onChange: setPassword1,
                        type: "password",
                        placeholder: "Saisir votre mot de passe"
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