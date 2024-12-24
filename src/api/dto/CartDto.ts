export interface CartDto {
    products: CartItemDto[],
}

interface CartItemDto {
    id: string,
    name: string,
    price: number,
    picture: string,
    quantity: number,
}

export interface CartQuantityDto {
    quantity: number,
}