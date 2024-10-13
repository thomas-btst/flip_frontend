import { FormEvent, MouseEvent, useMemo, useState } from "react";
import { Input, InputProps } from "../../components/common/Input";
import { Error } from "../../components/common/Error";
import { Loading } from "../../components/common/Loading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotate } from "@fortawesome/free-solid-svg-icons";
import { Password } from "../../components/common/Password";

export type AuthFormInput = {
    name: string,
    input: InputProps<any> & {id: string}
}

export type AuthFormLink = {
    name: string, to: string
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

    const inputs = useMemo(() => props.inputs.map(({name, input}) => (
        <div key={input.id}>
            <label htmlFor={input.id} className="block text-sm font-medium text-gray-700">
                {name}
            </label>
            {input.type === "password" ? <Password {...input}/> : <Input {...input}/>}
        </div>
    )), [props.inputs])

    const links = useMemo(() => props.links?.map((link, i) => (
        <Link key={i.toString()} to={link.to} className="block text-sm text-center hover:underline">
            {link.name}
        </Link>
    )), [props.links])

    function refresh(event: MouseEvent<HTMLButtonElement>) {
        if(rotate) return
        setRotate(true)
        setTimeout(() => setRotate(false), 1000)
        props.reload!(event)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-[url('/bg.jpg')] bg-cover">
            <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md bg-opacity-95">
                {props.prev && <Link to={props.prev} className="absolute top-3.5 left-5 text-lg"><FontAwesomeIcon icon={faArrowLeft}/></Link>}
                <h2 className="text-2xl font-bold text-center">
                    <img src="/logo.jpeg" className="w-16 inline-block rounded-full mr-4"/>
                    {props.title}
                </h2>
                <form onSubmit={props.onSubmit} className="space-y-4">
                    {inputs}
                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            {props.loading ? <Loading loading={props.loading}/> : props.submit ?? props.title}
                        </button>
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