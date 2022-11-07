const { request } = require('undici');
const logger = require('../../logger');
const { ApiCallManager } = require('../apiCallManager');

async function getMods(modIds) {
	for (let i = 3; i > 0; i--) {
		ApiCallManager.trackCall('curseforge');
		try {
			const responseData = await request(`https://api.curseforge.com/v1/mods`, {
				body: JSON.stringify({ 'modIds': modIds }),
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'x-api-key': process.env.CF_API_KEY,
				},
			});
		} catch (error) {
			logger.debug(`A ${error.name} occurred while requesting data from CurseForge (Get Mods)`);
		}
	}
	return null;
}

module.exports = { getMods };
