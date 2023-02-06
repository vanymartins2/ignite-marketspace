import { createContext, ReactNode, useEffect, useState } from 'react'

import { ProductImageDTO } from '@dtos/productImageDTO'
import { ProductDetails } from '@dtos/productResponseDTO'

import {
  storageProductGet,
  storageProductRemove,
  storageProductSave,
  storageImagesRemove,
  storageSaveImages
} from '@storage/storageProduct'

type ProductContextProviderProps = {
  children: ReactNode
}

export type ProductContextDataProps = {
  products: ProductDetails[]
  saveImagesInStorage: (images: ProductImageDTO[]) => Promise<void>
  removeProductFromStorage: (id: string) => Promise<void>
  saveProductInStorage: (productData: ProductDetails) => Promise<void>
  removeImagesFromStorage: (ids: string[]) => Promise<void>
}

export const ProductContext = createContext<ProductContextDataProps>(
  {} as ProductContextDataProps
)

export function ProductContextProvider({
  children
}: ProductContextProviderProps) {
  const [products, setProducts] = useState<ProductDetails[]>(
    [] as ProductDetails[]
  )
  const [images, setImages] = useState<ProductImageDTO[]>(
    [] as ProductImageDTO[]
  )

  async function saveProductInStorage(productData: ProductDetails) {
    try {
      await storageProductSave(productData)
    } catch (error) {
      throw error
    }
  }

  async function removeProductFromStorage(id: string) {
    try {
      await storageProductRemove(id)
    } catch (error) {
      throw error
    }
  }

  async function saveImagesInStorage(images: ProductImageDTO[]) {
    try {
      await storageSaveImages(images)
      setImages(images)
    } catch (error) {
      throw error
    }
  }

  async function removeImagesFromStorage(ids: string[]) {
    try {
      await storageImagesRemove(ids)
    } catch (error) {
      throw error
    }
  }

  async function loadProductFromStorage() {
    try {
      const products = await storageProductGet()
      setProducts(products)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    loadProductFromStorage()
  }, [])

  return (
    <ProductContext.Provider
      value={{
        products,
        saveImagesInStorage,
        removeImagesFromStorage,
        saveProductInStorage,
        removeProductFromStorage
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}