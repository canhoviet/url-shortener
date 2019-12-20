const { urlStats } = require('./stats.svc');
const logger = require('../../utils/logger');

exports.stats = async function stats(request, h) {
    try {
        const shortURLId = request.params.shortURLId;
        const items = await urlStats(shortURLId);

        return {
            Stats: items.map(item => ({
                at: item.meta.S.replace('stats#', ''),
                visits: Number(item.visits.N)
            }))
        };
    } catch (e) {
        logger.error(e);
    }
};
