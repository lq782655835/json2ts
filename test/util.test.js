const helper = require('../src/util/helper')
const getInterfaceTitle = helper.getInterfaceTitle

test('no root path', () => {
    let url = '/view/topic'
    expect(getInterfaceTitle(url)).toBe('view-topic')
})

test('root path', () => {
    let url = 'http://localhost:8002/view/topic'
    expect(getInterfaceTitle(url)).toBe('view-topic')
})