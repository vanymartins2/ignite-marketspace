import AsyncStorage from '@react-native-async-storage/async-storage'

import { PRODUCT_IMAGES_STORAGE, PRODUCT_STORAGE } from '@storage/storageConfig'

import { ProductDetails, ProductResponseDTO } from '@dtos/productResponseDTO'
import { ProductImageDTO } from '@dtos/productImageDTO'

export async function storageProductSave(product: ProductDetails) {
  const storedProducts = await storageProductGet()
  const products = [...storedProducts, product]

  await AsyncStorage.setItem(PRODUCT_STORAGE, JSON.stringify(products))
}

export async function storageProductGet() {
  const storage = await AsyncStorage.getItem(PRODUCT_STORAGE)
  const products: ProductDetails[] = storage ? JSON.parse(storage) : []

  return products
}

export async function storageProductRemove(id: string) {
  const storage = await AsyncStorage.getItem(PRODUCT_STORAGE)

  const filteredProducts = storage
    ? JSON.parse(storage).filter(
        (product: ProductResponseDTO) => product.id !== id
      )
    : storage

  await AsyncStorage.setItem(PRODUCT_STORAGE, JSON.stringify(filteredProducts))
}

export async function storageProductUpdate(id: string, is_active: boolean) {
  const storage = await storageProductGet()
  const index = storage.findIndex(obj => obj.id === id)

  if (index !== -1) {
    storage[index] = { ...storage[index], is_active }
  }

  await AsyncStorage.setItem(PRODUCT_STORAGE, JSON.stringify(storage))
}

export async function storageSaveImages(images: ProductImageDTO[]) {
  const storedImages = await storageImagesGet()
  const newImages = [...storedImages, ...images]

  await AsyncStorage.setItem(PRODUCT_IMAGES_STORAGE, JSON.stringify(newImages))
}

export async function storageImagesGet() {
  const storage = await AsyncStorage.getItem(PRODUCT_IMAGES_STORAGE)
  const images: ProductImageDTO[] = storage ? JSON.parse(storage) : []

  return images
}

export async function storageImagesRemove(ids: string[]) {
  const storage = await AsyncStorage.getItem(PRODUCT_IMAGES_STORAGE)

  const filteredImages = storage
    ? JSON.parse(storage).filter((img: ProductImageDTO) =>
        ids.map(item => item !== img.id)
      )
    : storage

  await AsyncStorage.setItem(
    PRODUCT_IMAGES_STORAGE,
    JSON.stringify(filteredImages)
  )
}
