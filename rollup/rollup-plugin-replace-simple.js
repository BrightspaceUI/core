import { createFilter } from '@rollup/pluginutils';

export default function transformCodePlugin(options = {}) {
	const filter = createFilter(options.include, options.exclude);

	return {
		name: 'replace',
		transform(code, id) {
			if (!filter(id)) return;

			code = typeof code === 'string' ? code : code.toString();
			for (const key in options.values) code = code.replace(key, options.values[key]);

			return { code, map: null };
		}
	};
}
