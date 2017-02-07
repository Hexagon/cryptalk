({
    baseUrl: "public/js/lib/",
    paths: {
        websocket: 'empty:'
    },
    packages: [
        {
            name: 'crypto-js',
            location: '../vendor/crypto-js-3.1.9',
            main: 'index'
        }
    ],
    name: "main",
    out: "public/js/cryptalk.min.js"
})