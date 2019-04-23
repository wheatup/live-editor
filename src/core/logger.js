/**
 * logger
 * 
 * @summary logging messages to the browser & console
 * @author wheatup
 */

function log(message) {
	console.log(message);
}

function error(message) {
	console.error(message);
}

export default { log, error };
