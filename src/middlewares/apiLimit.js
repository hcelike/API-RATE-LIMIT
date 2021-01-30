const config = require("config");
const { APIAccess } = require("../database/models/apiaccess");
const { APIKey } = require("../database/models/apikey");

/**
 * 
 * @param {*} req Express Request Object
 * @param {*} res Express Response Object
 * @param {*} next Next handler to handle the request
 * 
 *  - check if if there is the api_key in the request
 *  - check if the API key is available
 *  - once the API key is available, find access logs from the db
 *  - if the number of accesses is over the limit defined in config, return 429 status with retryAfter(in secs) 
 *  - else, forword the request to next handler
 */

async function checkAPIAvailability(req, res, next) {
    try {
        const { api_key } = req.query;
        if (api_key === undefined) {
            res.status(403).send(`API key has not be provided`);
            return;
        }

        const key = await APIKey.findOne({ key: api_key });
        if (!key) {
            res.status(403).send(`API key is not valid`);
            return;
        }

        const now = new Date();
        const aMoment24hrsAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // get accesses in the recent 24hrs
        const lastAccesses = await APIAccess.find({
            key: key._id,
            served: true,
            createdAt: {
                $gte: aMoment24hrsAgo,
            },
        }).sort({ createdAt: "ascending" });

        const limit = config.get('API_LIMIT');

        // if API key is available and number of access doesn't exceed the limitation
        if (limit > lastAccesses.length) {    
            await APIAccess.create({ key: key._id, served: true });
            res.header("X-Rate-Limit", limit);
            res.header("X-Rate-Limit-Remaining", limit - lastAccesses.length);
            next();
        } else {
            const nextAvailableMoment = new Date(
                new Date(lastAccesses[0].createdAt).getTime() + 24 * 60 * 60 * 1000
            );

            const retryAfter = Math.ceil((nextAvailableMoment.getTime() - now.getTime()) / 1000);
            await APIAccess.create({ key: key._id, served: false });
            res.header("Retry-After", retryAfter);
            res
            .status(429)
            .send(
                `The request cannot be served due to the rate limit having been exhausted for the resource`
            );
        }
    } catch (error) {
        return res.status(500).send(`Something went wrong in server side`);
    }
}

exports.checkAPIAvailability = checkAPIAvailability;
