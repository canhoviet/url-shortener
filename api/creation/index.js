const { shorten } = require('./creation.svc');

const { SERVER_HOST, SERVER_PORT } = process.env;
exports.create = async function(request, h) {
    const longURL = request.query.url;
    const shortURLId = await shorten(longURL);
    return {
        url: `${SERVER_HOST}:${SERVER_PORT}/${shortURLId}`
    };
};
