export type ProductResponseDTO = {
  id: string
  name: string
  description: string
  is_new: boolean
  price: number
  accept_trade: boolean
  user_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProductDetails = ProductResponseDTO & {
  product_images: {
    path: string
    id: string
  }[]
  payment_methods: {
    key: string
    name: string
  }[]
  user: {
    avatar: string
    name: string
    tel: string
  }
}
