import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import glob from 'glob-all';
import replace from './rollup-plugin-replace-simple.js';
import resolve from '@rollup/plugin-node-resolve';
import { version } from '../package.json';

const buildDate = new Intl.DateTimeFormat().format(new Date());

const jsGlob = [
	'@(components|controllers|directives|helpers|mixins|templates)/**/*.js',
	'!**/*@(test|axe|visual-diff).js',
];
const nonJsGlob = [
	'@(components|controllers|directives|helpers|mixins|templates)/**/*.*',
	'*.*',
	'!**/*.@(js|md|json)',
	'!**/screenshots/**/*',
];

const copyTransformReplace = config => {
	const replaceInstance = replace(config);
	return (code, id) => replaceInstance.transform(code, id)?.code ?? code;
};

export default {
	input: glob.sync(jsGlob),
	output: { dir: 'build', format: 'es', preserveModules: true },
	external: ['puppeteer', '@brightspace-ui/visual-diff', '@open-wc/testing', 'sinon'],
	plugins: [
		del({ targets: 'build' }),
		copy({
			targets: [{
				src: nonJsGlob,
				dest: 'build',
				rename: (_name, _extension, fullpath) => fullpath,
				transform: copyTransformReplace({
					include: '**/index.html', // The copy plugin doesn't provide paths to the files, so need to match on '**/'.
					values: {
						'__buildDate__': buildDate,
						'__buildVersion__': version,
					},
				}),
			}],
		}),
		resolve(),
		dynamicImportVars(),
	],
};
