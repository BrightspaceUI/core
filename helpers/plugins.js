const pluginSets = new Map();

export function getPlugin(setKey, pluginKey) {
	const pluginSet = pluginSets.get(setKey);
	return pluginSet?.plugins.find(plugin => plugin.options.key === pluginKey)?.plugin;
}

export function getPlugins(setKey) {
	const pluginSet = pluginSets.get(setKey);
	if (!pluginSet) return [];
	if (pluginSet.requiresSorting) {
		pluginSet.plugins.sort((item1, item2) => item1.options.sort - item2.options.sort);
		pluginSet.requiresSorting = false;
	}
	return pluginSet.plugins.map(item => item.plugin);
}

export function registerPlugin(setKey, plugin, options) {
	let pluginSet = pluginSets.get(setKey);
	if (!pluginSet) {
		pluginSet = { plugins: [], requiresSorting: false };
		pluginSets.set(setKey, pluginSet);
	}
	pluginSet.plugins.push({ plugin, options: Object.assign({ key: undefined, sort: 0 }, options) });
	pluginSet.requiresSorting = pluginSet.requiresSorting || (options?.sort !== undefined);
}
