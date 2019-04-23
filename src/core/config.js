/**
 * config
 * 
 * @summary website config
 * @author wheatup
 */

import http from './http';
import logger from './logger';
import _ from 'lodash';

export let config = null;

export function getConfig(conf) {
	if (config) {
		return _.get(config, conf);
	}
}

export async function init() {
	try {
		let result = await http.get(`/config/config.json`);
		config = result.data;
	} catch (ex) {
		logger.error(`Failed to load config!`);
	}
}

export default { getConfig, init };
