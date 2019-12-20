const { db } = require('../../utils/db');
const logger = require('../../utils/logger');
const { getCurrentHourFmt } = require('../../utils');

const TBL_NAME = 'url-mappings';
/**
 * Get long url based on short url key
 * @param shortURLId `string` short url id to query
 */
exports.getURL = async function getURL(shortURLId) {
    const result = await db
        .getItem({
            TableName: TBL_NAME,
            Key: {
                short_url: {
                    S: shortURLId
                },
                meta: { S: 'detail' }
            },
            AttributesToGet: ['long_url']
        })
        .promise();
    if (result.Item) {
        return result.Item.long_url.S;
    }

    return null;
};

exports.updateStats = function updateStats(shortURLId, inc = '1') {
    const curHourFmt = getCurrentHourFmt();
    return db
        .updateItem({
            TableName: TBL_NAME,
            Key: {
                short_url: {
                    S: shortURLId
                },
                meta: { S: `stats#${curHourFmt}` }
            },

            UpdateExpression:
                'SET visits = if_not_exists(visits, :start) + :inc',
            ExpressionAttributeValues: {
                ':inc': { N: inc },
                ':start': { N: '0' }
            },
            ReturnValues: 'UPDATED_NEW'
        })
        .promise();
};
