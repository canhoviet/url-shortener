#### Prerequisites

Node latest version. Node >= 10 should work too

#### Storage: Dynamodb

The data is stored in dynamodb with following structure:

-   table name: `url-mappings`
-   partion key: short_url (string)
-   sort key: meta (string): Can be `detail` - attribute is `long_url` and `stats# YYYY-MM-DD hh:mm:ss` - attribute is `visits`
-   Attributes: long_url (string) & visits (number)

As we need to check if a long url exists, we need a `global secondary index` with key is `long_url`
![schema](/url_mappings.png)

#### Installation

Before running, please rename `env.sample` to `.env` and input data for all properties, especially AWS\_ config

• `npm i` to install dependencies

• `npm start` to start the service

• `npm test` to run the tests

When starting, the code will check if table is created. If not it will create a new table. New dynamodb table takes some minutes to become `ACTIVE`. Please wait until it's active. Otherwise, it won't work

#### Improvements

• Caching hot URLs in memory or in memcached. Or even better with CDN. The is especially important as most of the traffic is `read` (read heavy system)

• Wait until the newly created become `ACTIVE`

• Health check

• Dockerize the app
