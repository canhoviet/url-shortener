const { HOST, PORT } = process.env;
const manifest = {
    server: {
        host: HOST,
        port: PORT,
        routes: {
            cors: true
        },
        router: {
            stripTrailingSlash: true
        }
    },
    register: {
        plugins: [
            {
                plugin: './api'
            }
        ]
    }
};

module.exports = manifest;
