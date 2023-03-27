import { createContext, ReactNode, useEffect, useState } from 'react'

import { ProductImageDTO } from '@dtos/productImageDTO'
import { ProductDetails } from '@dtos/productResponseDTO'

import {
  storageProductGet,
  storageProductRemove,
  storageProductSave,
  storageImagesRemove,
  storageSaveImages,
  storageProductUpdate,
  storageImagesGet
} from '@storage/storageProduct'
import { PRODUCT_IMAGES_STORAGE } from '@storage/storageConfig'

import { FilterDTO } from '@dtos/FilterDTO'
import { api } from '@services/api'
import { useAuth } from '@hooks/useAuth'

type ProductContextProviderProps = {
  children: ReactNode
}

export type ProductContextDataProps = {
  userProducts: ProductDetails[]
  storedImages: ProductImageDTO[]
  isLoadingDataFromStorage: boolean
  appliedFilterOptions: FilterDTO
  removeFilterOptions: () => void
  addFilterOptions: (data: FilterDTO) => void
  loadProductsFromUser: () => Promise<void>
  editProductInStorage: (id: string, is_active: boolean) => void
  saveProductInStorage: (productData: ProductDetails) => Promise<void>
  removeProductFromStorage: (id: string) => Promise<void>
  loadImagesFromStorage: () => Promise<void>
  saveImagesInStorage: (images: ProductImageDTO[]) => Promise<void>
  removeImagesFromStorage: (ids: string[]) => Promise<void>
}

export const ProductContext = createContext<ProductContextDataProps>(
  {} as ProductContextDataProps
)

export function ProductContextProvider({
  children
}: ProductContextProviderProps) {
  const [userProducts, setUserProducts] = useState<ProductDetails[]>([])
  const [appliedFilterOptions, setAppliedFilterOptions] = useState<FilterDTO>(
    {} as FilterDTO
  )
  const [storedImages, setStoredImages] = useState<ProductImageDTO[]>(
    [] as ProductImageDTO[]
  )
  const [isLoadingDataFromStorage, setIsLoadingDataFromStorage] = useState(true)

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

  async function editProductInStorage(id: string, is_active: boolean) {
    try {
      await storageProductUpdate(id, is_active)
    } catch (error) {
      throw error
    }
  }

  function addFilterOptions(data: FilterDTO) {
    setAppliedFilterOptions(data)
  }

  function removeFilterOptions() {
    setAppliedFilterOptions({} as FilterDTO)
  }

  async function saveImagesInStorage(images: ProductImageDTO[]) {
    try {
      await storageSaveImages(images)
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

  async function loadProductsFromUser() {
    setIsLoadingDataFromStorage(true)
    try {
      const response = await api.get('/users/products')

      setUserProducts(response.data)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingDataFromStorage(false)
    }
  }

  async function loadImagesFromStorage() {
    setIsLoadingDataFromStorage(true)
    try {
      const storedImages = await storageImagesGet()
      setStoredImages(storedImages)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingDataFromStorage(false)
    }
  }

  return (
    <ProductContext.Provider
      value={{
        userProducts,
        storedImages,
        isLoadingDataFromStorage,
        appliedFilterOptions,
        removeFilterOptions,
        addFilterOptions,
        loadProductsFromUser,
        saveProductInStorage,
        editProductInStorage,
        removeProductFromStorage,
        loadImagesFromStorage,
        saveImagesInStorage,
        removeImagesFromStorage
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
