const moment = require('moment');
const { db } = require('./db');
const logger = require('./logger');

exports.getCurrentHourFmt = function getCurrentHourFmt(
    md = moment().utc(),
    format = 'YYYY-MM-DD HH:mm:ss'
) {
    md.minutes(0);
    md.seconds(0);
    return md.format(format);
};
const TABLE_NAME = 'url-mappings';
exports.TABLE_NAME = TABLE_NAME;

exports.createTableIfNotExist = async function createTableIfNotExist() {
    try {
        const result = await db.listTables().promise();
        if (result.TableNames.includes(TABLE_NAME)) {
            return true;
        }
        const createTableResult = await db
            .createTable({
                TableName: TABLE_NAME,
                KeySchema: [
                    { AttributeName: 'short_url', KeyType: 'HASH' }, //Partition key
                    { AttributeName: 'meta', KeyType: 'RANGE' } //Sort key
                ],
                AttributeDefinitions: [
                    { AttributeName: 'short_url', AttributeType: 'S' },
                    { AttributeName: 'meta', AttributeType: 'S' },
                    { AttributeName: 'long_url', AttributeType: 'S' }
                ],
                GlobalSecondaryIndexes: [
                    {
                        IndexName: 'long_url-index',
                        KeySchema: [
                            {
                                AttributeName: 'long_url',
                                KeyType: 'HASH'
                            }
                        ],

                        Projection: {
                            ProjectionType: 'KEYS_ONLY'
                        },
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 5,
                            WriteCapacityUnits: 5
                        }
                    }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            })
            .promise();
        logger.info(
            `Created dynamodb table ${TABLE_NAME}. It takes a while before becoming ACTIVE`
        );
        return createTableResult;
    } catch (e) {
        logger.error(`Errors creating dynamodb table ${TABLE_NAME}`, e);
        throw e;
    }
};
