import { useQuery } from "@tanstack/react-query"
import { APIRoutes, UNKNOWN_ERROR, APIAxios } from "../api/FlipApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate, faFloppyDisk, faKey, faPenToSquare, faRightFromBracket, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { ChangeEvent, FormEvent, MouseEvent, ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../components/common/input/Input"
import { UserDto } from "../api/dto/User"
import { useAuthLogout } from "../contexts/AuthContext"

function ProfileItem({id, title, children}: {id?: string, title: string, children: ReactNode}) {
    return <div className="flex items-center relative">
        <label htmlFor={id}>
            <span className="font-semibold text-gray-700 whitespace-nowrap">{title}</span>
        </label>
        <span className="text-gray-600 w-full text-end ml-6">{children}</span>
    </div>
}

function ProfileInputItem({id, title, value, onChange, inputTitle, type, pattern, required}: {
    id: string,
    title: string,
    value: string,
    onChange: (val: string) => void,
    inputTitle?: string,
    type: "text" | "tel" | "email",
    pattern?: string,
    required?: boolean,
}) {
    return <ProfileItem id={id} title={title}>
        <Input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            pattern={pattern}
            title={inputTitle}
            className="pr-9 bg-gray-50 text-gray-900 text-sm border-b border-white focus:border-gray-400 focus:outline-none block w-full pb-2 -mb-2 text-end"
            required={required}
        />
        <label htmlFor={id}>
            <FontAwesomeIcon
                icon={faPenToSquare}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
        </label>
    </ProfileItem>
}

export function Profile() {
    const navigate = useNavigate()
    const logout = useAuthLogout()

    const [error, setError] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [logoLoading, setLogoLoading] = useState(false)

    const [line1, setLine1] = useState("")
    const [line2, setLine2] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [city, setCity] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")

    const {data: user, isLoading, isError, refetch} = useQuery({
        queryKey: ['account'], 
        queryFn: () => APIAxios(APIRoutes.GETUserProfile()).then(user => ({
            ...user,
            logo: user.logo ? `${user.logo}?${new Date().getTime().toString()}` : undefined
        })),
    })

    function resetPassword(event: MouseEvent<HTMLButtonElement>, email: string) {
        event.preventDefault()
        APIAxios(APIRoutes.POSTSendResetPasswordKey(email)).then(() => {
            navigate(`/reset-password/${encodeURIComponent(email)}`)
        }).catch(() => {setError(true)})
    }

    function saveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(saveLoading)
            return
        setError(false)
        setSaveLoading(true)
        APIAxios(APIRoutes.PUTUserProfile({
            firstName,
            lastName,
            phone,
            address: {
                line1,
                line2,
                zipCode,
                city,
            },
        }))
            .then(async () => {await refetch()})
            .catch(() => { setError(true); })
            .finally(() => { setSaveLoading(false); })
    }

    function hasChanges(user: UserDto): boolean {
        return user.firstName !== firstName ||
            user.lastName !== lastName ||
            (user.phone ?? "") !== phone ||
            (user.address?.line1 ?? "") !== line1 ||
            (user.address?.line2 ?? "") !== line2 ||
            (user.address?.zipCode ?? "") !== zipCode ||
            (user.address?.city ?? "") !== city
    }

    function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const files = event.target.files
        if (!files || logoLoading)
            return
        setError(false)
        setLogoLoading(true)
        void APIAxios(APIRoutes.PUTUserLogo(files[0]))
            .then(() => refetch())
            .catch(() => { setError(true); })
            .finally(() => { setLogoLoading(false); })
    }

    useEffect(() => {
        if (!user) return
        setFirstName(user.firstName)
        setLastName(user.lastName)
        if(user.phone) setPhone(user.phone)
        if (!user.address) return
        setLine1(user.address.line1)
        setLine2(user.address.line2)
        setZipCode(user.address.zipCode)
        setCity(user.address.city)
    }, [user])

    return (
        <>
            {user && (
                <form onSubmit={saveProfile} className="max-w-5xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg space-y-6">
                    {/* User Info Section */}
                    <header className="flex items-center space-x-6 w-full">
                        {/* Logo */}
                        <div className="relative group">
                            <div className="absolute bg-black hidden group-hover:block bg-opacity-20 rounded-full">
                                <input
                                    type="file"
                                    onChange={handleLogoUpload}
                                    className="w-24 h-24 opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                            </div>
                            <div className="absolute hidden group-hover:flex w-24 h-24 pointer-events-none justify-center items-center">
                                <FontAwesomeIcon className="w-6 h-6 text-slate-100" icon={faPenToSquare} />
                            </div>
                            {user.logo ?
                                <div className="w-24 h-24">
                                    <img src={user.logo} alt="logo" className="object-contain bg-slate-300 w-24 h-24 rounded-full"/>
                                </div>
                            :
                                <FontAwesomeIcon
                                    icon={faUserCircle}
                                    className="w-24 h-24 rounded-full text-slate-300"
                                />
                            }
                        </div>
                        {/* Header main informations */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 text-nowrap">
                                {`${user.firstName} ${user.lastName}`}
                            </h2>
                            <p className="text-lg text-gray-600">{user.email}</p>
                        </div>
                        {/* Form actions */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={event => { resetPassword(event, user.email); }}
                                className="space-x-2 px-2 py-1 bg-orange-100 hover:bg-orange-200 rounded-md border border-yellow-500 whitespace-nowrap"
                            >
                                <FontAwesomeIcon icon={faKey}/>
                                <span>Mot de passe</span>
                            </button>
                            {hasChanges(user) &&
                                <button
                                    type="submit"
                                    title="Sauvegarder le profile"
                                    className="px-2 py-1 bg-green-100 text-green-950 hover:bg-green-200 rounded-md border border-green-900"
                                >
                                    <FontAwesomeIcon icon={faFloppyDisk}/>
                                </button>
                            }
                        </div>
                        <button
                            onClick={() => {void APIAxios(APIRoutes.POSTLogout()); logout()}}
                            type="button"
                            className="text-red-600 hover:text-red-800 transition w-full text-right"
                            title="Se déconnecter"
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-6 h-6" />
                        </button>
                    </header>
    
                    {/* Profile and Address Sections */}
                    <section className="grid md:grid-cols-2 gap-8">
                        {/* Profile Details */}
                        <article className="space-y-5 border-r border-gray-300 pr-7">
                            <ProfileInputItem id="firstName" type="text" title="Prénom" value={firstName} onChange={setFirstName} required/>
                            <ProfileInputItem id="lastName" type="text" title="Nom" value={lastName} onChange={setLastName} required/>
                            <ProfileItem title="Email">{user.email}</ProfileItem>
                            <ProfileInputItem
                                id="phone"
                                type="tel"
                                pattern="^0[1-9]\d{8}$"
                                inputTitle="Doit être un numéro de téléphone valide"
                                title="Numéro de téléphone"
                                value={phone}
                                onChange={setPhone}
                                required
                            />
                        </article>
    
                        {/* Address Details */}
                        <article className="space-y-5">
                            <ProfileInputItem id="line1" type="text" title="Adresse" value={line1} onChange={setLine1} required/>
                            <ProfileInputItem id="line2" type="text" title="Complément d'adresse" value={line2} onChange={setLine2}/>
                            <ProfileInputItem id="zipCode" type="text" title="Code postal" value={zipCode} onChange={setZipCode} pattern="[0-9]{5}" inputTitle="Le code postal doit être valide" required/>
                            <ProfileInputItem id="city" type="text" title="Ville" value={city} onChange={setCity} required/>
                        </article>
                    </section>
                </form>
            )}
    
            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center mt-10">
                    <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
                </div>
            )}
    
            {/* Error State */}
            {(isError || error) && (
                <div className="text-red-600 text-xl text-center my-6">
                    {UNKNOWN_ERROR}
                </div>
            )}
        </>
    );
    
}