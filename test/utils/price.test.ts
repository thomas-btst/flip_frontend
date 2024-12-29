import { Price } from '../../src/utils/price'

test('should convert price to integer correctly', () => {
    const price = 2.22
    const integer = Price.toInteger(price)
    expect(integer).toEqual(222)
})

test('should convert integer to price correctly', () => {
    const integer = 578
    const price = Price.toPrice(integer)
    expect(price).toEqual(5.78)
})