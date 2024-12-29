import {formatDate} from '../../src/utils/date'

test('should format date correctly', () => {
    const date = new Date(Date.parse('03 Jan 1970 00:00:00 GMT'))
    const formattedDate = formatDate(date)
    expect(formattedDate).toEqual("03/01/1970")
})