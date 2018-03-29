export function debounce(func, interval) {
    var lastCall = -1;
    return function () {
        clearTimeout(lastCall);
        var args = arguments;
        var self = this;
        lastCall = setTimeout(function () {
            func.apply(self, args);
        }, interval);
    };
}