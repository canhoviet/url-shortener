const Boom = require('@hapi/boom');
const { getURL, updateStats } = require('./retrieval.svc');
const logger = require('../../utils/logger');

exports.get = async function get(request, h) {
    try {
        const shortURLId = request.params.shortURLId;
        const result = await getURL(shortURLId);
        if (result == null) {
            return Boom.notFound(`URL not foud "${shortURLId}"`);
        }
        // no need to `await` in this case.
        updateStats(shortURLId);
        return h.redirect(result);
    } catch (e) {
        logger.error(e);
    }
};
