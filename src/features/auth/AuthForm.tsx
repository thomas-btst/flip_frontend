import { FormEvent, MouseEvent, useMemo, useState } from "react";
import { Input, InputProps } from "../../components/common/input/Input";
import { Error } from "../../components/common/Error";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHome, faRotate } from "@fortawesome/free-solid-svg-icons";
import { Password } from "../../components/common/input/Password";
import { Button } from "../../components/common/Button";

export type AuthFormInput = {
    name: string,
    input: InputProps & {id: string, relaxed?: boolean},
}

export type AuthFormLink = {
    name: string,
    to: string,
}

type AuthFormProps = {
    title: string,
    inputs: AuthFormInput[],
    links?: AuthFormLink[]
    submit?: string,
    prev?: string,
    reload?: (event: MouseEvent<HTMLButtonElement>) => void,
    onSubmit: (event: FormEvent<HTMLFormElement>) => void,
    loading: boolean,
    error: string | null,
}

export function AuthForm(props: AuthFormProps) {
    const [rotate, setRotate] = useState(false)

    const inputs = useMemo(() => props.inputs.map(({name, input: {relaxed, ...input}}) => {
        const className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring focus:border-blue-300 p-1"
        return (
            <div key={input.id}>
                <label htmlFor={input.id} className="block text-sm font-medium text-gray-700">
                    {name}
                </label>
                {input.type === "password" ? 
                    (relaxed ? <Input className={className} {...input} type="password"/> : <Password className={className} {...input}/>)
                :
                    <Input className={className} {...input}/>
                }
            </div>
        )
    }), [props.inputs])

    const links = useMemo(() => props.links?.map((link, i) => (
        <Link key={i.toString()} to={link.to} className="block text-sm text-center hover:underline">
            {link.name}
        </Link>
    )), [props.links])

    function refresh(event: MouseEvent<HTMLButtonElement>) {
        if(rotate) return
        setRotate(true)
        setTimeout(() => {setRotate(false)}, 1000)
        if(props.reload)
            props.reload(event)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-[url('/bg.jpg')] bg-cover">
            <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md bg-opacity-95">
                <h2 className="text-2xl font-bold text-center">
                    <Link to={props.prev ?? "/"} className={`absolute top-3.5 left-5 ${props.prev? "text-lg" : "text-xl text-gray-800"}`}>
                        <FontAwesomeIcon icon={props.prev ? faArrowLeft : faHome}/>
                    </Link>
                    <img src="/logo.jpeg" className="w-16 inline-block rounded-full mr-4"/>
                    {props.title}
                </h2>
                <form onSubmit={props.onSubmit} className="space-y-4">
                    {inputs}
                    <div className="flex space-x-3">
                        <Button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                            loading={props.loading}
                        >
                            {props.submit ?? props.title}
                        </Button>
                        {props.reload &&
                            <button className={`px-3 ${rotate ? "rotate-[360deg] transition-all duration-1000": ""}`} onClick={refresh}>
                                <FontAwesomeIcon icon={faRotate}/>
                            </button>
                        }
                    </div>
                    <Error>{props.error}</Error>
                    {links}
                </form>
            </div>
        </div>
    )
}