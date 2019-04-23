/**
 * http
 * 
 * @summary basic http request handler
 * @author wheatup
 */

import axios from 'axios';
import logger from './logger';
import config from './config';

const instance = axios.create({
	timeout: 5000,
	baseURL: config.getConfig('resourceURL')
});

instance.interceptors.response.use(null, ex => {
	if (ex.response) {
		logger.error(ex.response.data);
	} else {
		logger.error(ex.message);
	}
	return Promise.reject(ex);
});

export default {
	get: instance.get,
	post: instance.post,
	put: instance.put,
	delete: instance.delete
};
