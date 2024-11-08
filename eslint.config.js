import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});
const gitignorePath = path.resolve(__dirname, '.gitignore');
const files = ['**/*.js', '**/*.html'];
export default [
	includeIgnoreFile(gitignorePath),
	...compat.extends('brightspace/lit-config').map(c => ({
		...c,
		files: c.files ?? files
	})),
	{
		languageOptions: {
			globals: {
				Prism: false,
			},
		},
	},
	...compat.extends('brightspace/testing-config').map(config => ({
		...config,
		files: ['**/test/*'],
	})),
	...compat.extends('brightspace/node-config').map(config => ({
		...config,
		files: ['cli/*'],
		rules: { 'no-console':0 }
	})),
];
