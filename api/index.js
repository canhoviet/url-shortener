const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const { create } = require('./creation');
const { get } = require('./retrieval');
const { stats } = require('./stats');

exports.plugin = {
    name: 'api',
    version: '1.0.0',
    register: function register(server, options) {
        server.route([
            {
                method: 'POST',
                path: '/register.json',
                handler: create,
                options: {
                    validate: {
                        query: Joi.object({
                            url: Joi.string()
                                .uri()
                                .required()
                        }),
                        options: {
                            abortEarly: false
                        },
                        failAction: errorHandler
                    }
                }
            },
            {
                method: 'GET',
                path: '/{shortURLId}',
                handler: get
            },
            {
                method: 'GET',
                path: '/{shortURLId}/stats',
                handler: stats
            }
        ]);
    }
};

const errorHandler = async (request, h, err) => {
    const error = Boom.badRequest('Invalid request payload input');
    error.output.statusCode = 400; // Assign a custom error code
    error.reformat();
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
        const { message } = err.details[0];
        error.output.payload.reason = err.details.map(d => d.message);
    }
    throw error;
};
