const moment = require('moment');

exports.getCurrentHourFmt = function getCurrentHourFmt(
    md = moment().utc(),
    format = 'YYYY-MM-DD HH:mm:ss'
) {
    md.minutes(0);
    md.seconds(0);
    return md.format(format);
};
