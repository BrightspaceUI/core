import { addExtensions, litConfig, nodeConfig, setDirectoryConfigs, testingConfig } from 'eslint-config-brightspace';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default [
	{
		ignores: ['build']
	},
	...setDirectoryConfigs(
		addExtensions(litConfig, ['.js', '.html']),
		{
			'**/test':testingConfig,
			cli: nodeConfig
		}
	),
	{
		languageOptions: {
			globals: {
				Prism: false,
			},
		},
		plugins: {
			unicorn: eslintPluginUnicorn,
		},
	},
	{
		files: [
			'./components/colors/colors.js',
			'./components/typography/styles.js',
			'./helpers/flags.js',
		],
		rules: {
			'no-restricted-globals': ['error', 'document'],
			'unicorn/prefer-global-this': 'error',
		},
	}
];
