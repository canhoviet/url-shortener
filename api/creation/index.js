const Boom = require('@hapi/boom');
const { shorten } = require('./creation.svc');
const logger = require('../../utils/logger');

const { HOST, PORT, PROTO } = process.env;
exports.create = async function(request, h) {
    const longURL = request.query.url;
    try {
        const shortURLId = await shorten(longURL);
        return {
            url: `${PROTO}://${HOST}:${PORT}/${shortURLId}`
        };
    } catch (e) {
        logger.error(e);
        return Boom.badImplementation();
    }
};
