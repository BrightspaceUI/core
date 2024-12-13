import { addExtensions, litConfig, nodeConfig, setDirectoryConfigs, testingConfig } from 'eslint-config-brightspace';

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
	},
];
