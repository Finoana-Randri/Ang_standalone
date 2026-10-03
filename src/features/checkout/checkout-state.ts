export type CheckoutState = {
  status: 'idle' | 'error' | 'success'
  message: string
  orderNumber?: string
}

export const initialCheckoutState: CheckoutState = {
  status: 'idle',
  message: '',
}
