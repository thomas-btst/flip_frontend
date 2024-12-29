import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { APIAxios, APIRoutes } from "../../api/FlipApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons"
import { NotFound } from "../../pages/NotFound"

export function PaymentReturn() {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const sessionId = urlParams.get('session_id')
        if (!sessionId) 
            setLoading(false)
        else
            void APIAxios(APIRoutes.POSTFinalizePaymentSession(sessionId))
                .then(commandId => { navigate(`/command/${encodeURIComponent(commandId)}`); })
                .catch(() => { setLoading(false); })
    }, [])
  
    if (loading) {
      return <div className="flex justify-center my-10">
            <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-xl text-gray-500" />
        </div>
    }

    return <NotFound/>
}
