import { ProductTranslation, ProductType } from "../api/dto/Product"

type ProductTypeOptions = {value: ProductType, label: string}[]

export const selectProductTypeOptions: ProductTypeOptions = Array.from(ProductTranslation.entries()).map(([value, label]) => ({
    value,
    label,
}))