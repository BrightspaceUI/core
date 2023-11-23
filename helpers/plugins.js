const pluginSets = new Map();
const pluginsRequested = new Set();

export function getPlugins(setKey) {
	if (!pluginsRequested.has(setKey)) pluginsRequested.add(setKey);
	const pluginSet = pluginSets.get(setKey);
	if (!pluginSet) return [];
	if (pluginSet.requiresSorting) {
		pluginSet.plugins.sort((item1, item2) => item1.options.sort - item2.options.sort);
		pluginSet.requiresSorting = false;
	}
	return pluginSet.plugins.map(item => item.plugin);
}

export function registerPlugin(setKey, plugin, options) {
	if (pluginsRequested.has(setKey)) {
		throw new Error(`Plugin Set "${setKey}" has already been requested. Additional plugin registrations would result in stale consumer plugins.`);
	}

	let pluginSet = pluginSets.get(setKey);
	if (!pluginSet) {
		pluginSet = { plugins: [], requiresSorting: false };
		pluginSets.set(setKey, pluginSet);
	} else if (options?.key !== undefined) {
		if (pluginSet.plugins.find(registeredPlugin => registeredPlugin.options.key === options?.key)) {
			throw new Error(`Plugin Set "${setKey}" already has a plugin with the key "${options.key}".`);
		}
	}

	pluginSet.plugins.push({ plugin, options: Object.assign({ key: undefined, sort: 0 }, options) });
	pluginSet.requiresSorting = pluginSet.requiresSorting || (options?.sort !== undefined);
}

// Do not import! Testing only!!
export function resetPlugins() {
	pluginSets.clear();
	pluginsRequested.clear();
}

export function tryGetPluginByKey(setKey, pluginKey) {
	const pluginSet = pluginSets.get(setKey);
	const plugin = pluginSet?.plugins.find(plugin => plugin.options.key === pluginKey)?.plugin;
	return plugin || null;
}
