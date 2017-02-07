define(function (){
    var exports = {},
        queue = [],
        now = function () {
            return performance.now() || Date.now();
        };

    exports.add_function_delayed = function(delay, callback, data) {
        queue.push({
            func:   callback,
            pushed: now(),
            delay:  delay,
            data:   data
        });
    }

    exports.get = function () {
        return queue;
    }

    exports.run = function () {
        var i = 0,
            current,
            lrt_inner;

        while (current = queue[i++]) {
            if (now() - current.pushed > current.delay) {
                current.func();
                queue.splice(i - 1, 1);
            }
        }

        if (queue.length) {
            // Waste a ms to prevent callstack overflow
            lrt_inner = now();

            while (now() - lrt_inner < 1) { void 0; };

            exports.run();
        }
    }

    return exports;
});