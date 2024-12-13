const productTypes = ["SKATE", "DECK", "WHEEL", "BEARING", "GRID_TAPE", "TRUCK"] as const

export type ProductType = typeof productTypes[number]

export const ProductTranslation = new Map<ProductType, string>([
    ["SKATE", "Skateboard"],
    ["DECK", "Planche"],
    ["WHEEL", "Roue"],
    ["BEARING", "Roulement"],
    ["GRID_TAPE", "Grip"],
    ["TRUCK", "Essieu"],
])

export function isProductType(value: string): value is ProductType {
    return productTypes.includes(value as ProductType);
}

export interface ProductDto {
    id: string,
    name: string,
    description: string,
    price: number,
    picture: string,
    type: ProductType,
}

export interface CreateProductDto {
    name: string,
    description: string,
    price: number,
    type: ProductType,
}

export interface UpdateProductDto {
    name?: string,
    description?: string,
    price?: number,
    type: ProductType,
}

export interface ProductPageDto {
    products: ProductDto[],
    pages: number,
}

export interface ProductPaginationDto {
    products: ProductDto[],
    hasMore: boolean,
}