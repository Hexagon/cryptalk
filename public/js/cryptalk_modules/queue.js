define('queue', function(){

    var exports = {};
    
    queue = [];

    exports.add_function_delayed = function(d,callback,data) { 
        
        queue.push(
            {
                func:
                    function(){
                        var finished = callback();
                    },
                pushed:Date.now(),
                delay:d,
                data:data
            }
        );

    }

    exports.get = function() {
        return queue;
    }

    exports.run = function(){

        for(var i=0;i<queue.length;i++){
            var current = queue[i];
            if (Date.now() - current.pushed > current.delay) {
                current.func();
                queue.splice(i,1);
            }
        }
        if(!queue.length) return;

        // Waste a ms to prevent callstack overflow
        lrt_inner = Date.now();
        while (Date.now() - lrt_inner < 1) { var a=1+1; };

        exports.run();
        
    }

    return exports;

});