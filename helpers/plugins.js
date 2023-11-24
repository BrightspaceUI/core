const pluginSets = new Map();

function getPluginSet(setKey) {
	let pluginSet = pluginSets.get(setKey);
	if (pluginSet) return pluginSet;

	pluginSet = { plugins: [], requested: false, requiresSorting: false };
	pluginSets.set(setKey, pluginSet);
	return pluginSet;
}

export function getPlugins(setKey) {
	const pluginSet = getPluginSet(setKey);
	pluginSet.requested = true;
	if (pluginSet.requiresSorting) {
		pluginSet.plugins.sort((item1, item2) => item1.options.sort - item2.options.sort);
		pluginSet.requiresSorting = false;
	}
	return pluginSet.plugins.map(item => item.plugin);
}

export function registerPlugin(setKey, plugin, options) {
	const pluginSet = getPluginSet(setKey);

	if (pluginSet.requested) {
		throw new Error(`Plugin Set "${setKey}" has already been requested. Additional plugin registrations would result in stale consumer plugins.`);
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
}

export function tryGetPluginByKey(setKey, pluginKey) {
	const pluginSet = pluginSets.get(setKey);
	const plugin = pluginSet?.plugins.find(plugin => plugin.options.key === pluginKey)?.plugin;
	return plugin || null;
}
