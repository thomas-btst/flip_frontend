import { useCallback } from "react"
import { APIAxios, APIRoutes } from "../../api/FlipApi"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string

export function PaymentForm() {
    const fetchClientSecret = useCallback(() => {
      return APIAxios(APIRoutes.POSTInitPaymentSession())
    }, [])
  
    return (
      <div id="checkout">
        <EmbeddedCheckoutProvider
            stripe={loadStripe(publicKey)}
            options={{
                fetchClientSecret,
            }}
        >
            <EmbeddedCheckout/>
        </EmbeddedCheckoutProvider>
      </div>
    )
  }