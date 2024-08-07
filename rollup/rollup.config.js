import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import glob from 'glob-all';
import { readFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

const { version } = JSON.parse(readFileSync('./package.json'));
const buildDate = Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(new Date());

const jsGlob = [
	'@(components|controllers|directives|helpers|mixins|templates|test)/**/*.js',
	'./index.js',
	'!**/*.@(test|axe|vdiff).js',
];
const nonJsGlob = [
	'@(components|controllers|directives|helpers|mixins|templates|test)/**/*.*',
	'*.*',
	'!**/*.@(js|md|json)',
	'!**/golden/**/*',
	'./custom-elements.json',
];

export default {
	input: glob.sync(jsGlob),
	output: { dir: 'build', format: 'es', preserveModules: true },
	external: ['@brightspace-ui/testing', 'sinon'],
	plugins: [
		del({ targets: 'build' }),
		copy({
			targets: [{
				src: nonJsGlob,
				dest: 'build',
				rename: (_name, _extension, fullpath) => fullpath,
			}],
		}),
		replace({
			include: './index.js',
			preventAssignment: false,
			values: {
				'window.__buildDate__': JSON.stringify(buildDate),
				'window.__buildVersion__': JSON.stringify(version),
			},
		}),
		resolve(),
		dynamicImportVars(),
	],
};
