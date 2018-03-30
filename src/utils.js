// export function debounce(func, interval) {
//     var lastCall = -1;
//     return function () {
//         clearTimeout(lastCall);
//         var args = arguments;
//         var self = this;
//         lastCall = setTimeout(function () {
//             func.apply(self, args);
//         }, interval);
//     };
// }

export function debounce(callback, wait, context = this) {
    let timeout = null
    let callbackArgs = null

    const later = () => callback.apply(context, callbackArgs)

    return function() {
        callbackArgs = arguments
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}