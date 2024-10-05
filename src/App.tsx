import { useState } from "react"
import { Input } from "./components/common/Input"
import { useFetch } from "./hooks/useFetch"

interface User{
  id: string,
  username: string,
  email: string,
}

export default function App() {

  const [url, setUrl] = useState('/api/users')

  const request = useFetch<User[]>(url)

  const users = request.data ?? []

  return (
    <div>
      <Input value={url} onChange={setUrl}/>
      <div>{request.loading ? 'Chargement...' : 'Chargé'}</div>
      <div className={request.error ? 'text-red-600' : 'text-green-600'}>Erreur: {request.error ?? 'Aucune'}</div>
      <ul>
        {users.map(user => <li key={user.id}>{user.username}: {user.email}</li>)}
      </ul>
      <button onClick={request.trigger}>Recharger</button>
    </div>
  )
}