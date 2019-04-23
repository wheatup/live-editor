/**
 * i18n
 *
 * @summary internationalization by user language
 * @author wheatup
 */

import http from './http';
import logger from './logger';
import _ from 'lodash';
import config from './config';

export let text = null;
export let defaultText = null;
export let info = null;
export let defaultInfo = null;

export function i18n(path) {
	// Find in current language pack
	let result = _.get(text, path);
	if(result === undefined){
		// Find in default language pack
		result = _.get(defaultText, path);
		if(result === undefined){
			// Ain't got shit, return the path
			result = path;
		}
	}
	return result;
}

export async function init(lang) {
	if (!defaultText) {
		let defaultLang = config.getConfig('defaultLanguage');
		let defaultTextData = await http.get(`/locales/${defaultLang}/text.json`);
		defaultText = defaultTextData.data;
		let defaultInfoData = await http.get(`/locales/${defaultLang}/info.json`);
		defaultInfo = defaultInfoData.data;
	}
	if (lang) {
		localStorage.setItem('lang', lang);
	}
	lang = lang || localStorage.getItem('lang') || navigator.language;
	if (lang === 'zh') {
		lang = 'zh-CN';
	}
	try {
		let result = await http.get(`/locales/${lang}/text.json`);
		text = result.data;
		let infoResult = await http.get(`/locales/${lang}/info.json`);
		info = infoResult.data;
	} catch (ex) {
		let defaultLang = config.getConfig('defaultLanguage');
		logger.error(`Failed to load language ${lang}, using ${defaultLang} instead`);
		lang = defaultLang;
		localStorage.setItem('lang', lang);
		text = defaultText;
		info = defaultInfo;
	}
	return text;
}

export default { i18n, init, text, info };
