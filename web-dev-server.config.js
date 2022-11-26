import { readFileSync } from 'fs';
import replace from './rollup/rollup-plugin-replace-simple.js';

const { version } = JSON.parse(readFileSync('./package.json'));
const buildDate = new Intl.DateTimeFormat().format(new Date());

const webDevReplace = config => {
	const replaceInstance = replace(config);
	return {
		name: 'replace',
		transform: context => replaceInstance.transform(context.body, context.path)?.code ?? context.body,
	};
};

export default {
	plugins: [
		webDevReplace({
			include: ['/', '/index.html'],
			values: {
				'__buildDate__': buildDate,
				'__buildVersion__': version,
			},
		})
	],
};
