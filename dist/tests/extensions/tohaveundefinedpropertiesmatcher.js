/**
 * Checks that every property on an object is undefined.
 * @param this The instance of matcher utils being worked with.
 * @param recieved The object recieved.
 */
function toHaveUndefinedProperties(recieved) {
    for (let name in recieved) {
        if (recieved.hasOwnProperty(name) && typeof recieved[name] !== 'undefined') {
            return {
                pass: false,
                message: 'Property ' + name + ' is not undefined.'
            };
        }
    }
    return {
        pass: true,
        message: ''
    };
}
expect.extend({
    toHaveUndefinedProperties
});

//# sourceMappingURL=tohaveundefinedpropertiesmatcher.js.map
