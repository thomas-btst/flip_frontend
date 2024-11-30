export namespace Price {
    export function toPrice(price: number) {
        return price / 100
    }
    
    export function toInteger(price: number) {
        return price * 100
    }
}