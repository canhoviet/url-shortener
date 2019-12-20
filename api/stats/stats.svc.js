const { db } = require('../../utils/db');
const logger = require('../../utils/logger');
const { getCurrentHourFmt } = require('../../utils');

const TBL_NAME = 'url-mappings';
/**
 * Get long url based on short url key
 * @param shortURLId `string` short url id to query
 */
exports.urlStats = async function urlStats(shortURLId) {
    const result = await db
        .query({
            TableName: TBL_NAME,
            KeyConditionExpression:
                'short_url = :short_url and begins_with(meta, :meta)',
            ExpressionAttributeValues: {
                ':short_url': { S: shortURLId },
                ':meta': { S: 'stats#' }
            }
        })
        .promise();

    return result.Items;
};
