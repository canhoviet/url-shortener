const { db } = require('../../utils/db');
const logger = require('../../utils/logger');

const TBL_NAME = 'url-mappings';
/**
 * Create a short url based on given `long url`.
 * If the long url already mapped, return existing one
 * @param longURL `string` long url to be shortenized
 */
exports.shorten = async function shorten(longURL) {
    try {
        const result = await db
            .query({
                TableName: TBL_NAME,
                IndexName: 'long_url-index',
                KeyConditionExpression: 'long_url = :v_long_url',
                ExpressionAttributeValues: {
                    ':v_long_url': { S: longURL }
                },
                ProjectionExpression: 'short_url'
            })
            .promise();
        if (result.Count > 0) {
            return result.Items[0].short_url.S;
        }
        const shortURL = Math.floor(Math.random() * 1000000000).toString(26);
        await db
            .putItem({
                TableName: TBL_NAME,
                Item: {
                    short_url: {
                        S: shortURL
                    },
                    meta: { S: 'detail' },
                    long_url: { S: longURL }
                }
            })
            .promise();
        return shortURL;
    } catch (e) {
        logger.error(e);
    }
};
