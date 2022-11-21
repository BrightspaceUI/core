import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import glob from 'glob-all';
import resolve from '@rollup/plugin-node-resolve';

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
			}],
		}),
		resolve(),
		dynamicImportVars(),
	],
};
