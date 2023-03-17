import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react'
import { useFocusEffect } from '@react-navigation/native'

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
import { FilterDTO } from '@dtos/FilterDTO'
import { api } from '@services/api'
import { useAuth } from '@hooks/useAuth'

type ProductContextProviderProps = {
  children: ReactNode
}

export type ProductContextDataProps = {
  // products: ProductDetails[]
  activeAdsQuantity: number
  userProducts: ProductDetails[]
  loadProductsFromUser: () => Promise<void>
  addFilterOptions: (data: FilterDTO) => void
  removeFilterOptions: () => void
  appliedFilterOptions: FilterDTO
  // loadProductFromStorage: () => void
  isLoadingDataFromStorage: boolean
  saveImagesInStorage: (images: ProductImageDTO[]) => Promise<void>
  removeProductFromStorage: (id: string) => Promise<void>
  editProductInStorage: (id: string, is_active: boolean) => void
  saveProductInStorage: (productData: ProductDetails) => Promise<void>
  removeImagesFromStorage: (ids: string[]) => Promise<void>
}

export const ProductContext = createContext<ProductContextDataProps>(
  {} as ProductContextDataProps
)

export function ProductContextProvider({
  children
}: ProductContextProviderProps) {
  // const [products, setProducts] = useState<ProductDetails[]>(
  //   [] as ProductDetails[]
  // )
  const [userProducts, setUserProducts] = useState<ProductDetails[]>([])
  const [appliedFilterOptions, setAppliedFilterOptions] = useState<FilterDTO>(
    {} as FilterDTO
  )
  const [images, setImages] = useState<ProductImageDTO[]>(
    [] as ProductImageDTO[]
  )
  const [isLoadingDataFromStorage, setIsLoadingDataFromStorage] = useState(true)

  const activeAdsQuantity = userProducts.filter(
    product => product.is_active === true
  ).length

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

      const storageImg = await storageImagesGet()
      setImages(storageImg)
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

  // async function loadProductFromStorage() {
  //   try {
  //     setIsLoadingDataFromStorage(true)
  //     const storage = await storageProductGet()
  //     setProducts(storage)
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoadingDataFromStorage(false)
  //   }
  // }

  async function loadProductsFromUser() {
    try {
      const response = await api.get('/users/products')

      setUserProducts(response.data)
    } catch (error) {
      throw error
    }
  }

  console.log(images)

  return (
    <ProductContext.Provider
      value={{
        // products,
        activeAdsQuantity,
        userProducts,
        loadProductsFromUser,
        addFilterOptions,
        removeFilterOptions,
        appliedFilterOptions,
        // loadProductFromStorage,
        isLoadingDataFromStorage,
        saveImagesInStorage,
        removeImagesFromStorage,
        saveProductInStorage,
        removeProductFromStorage,
        editProductInStorage
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
