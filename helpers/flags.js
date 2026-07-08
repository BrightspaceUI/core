const knownFlags = new Map();
const flagOverrides = new Map();

export function getWarnMessage(key) {
	return `mockFlag called after getFlag for '${key}'. This is likely to result in unexpected behaviour.`;
}

export function getFlag(key, defaultValue) {
	let value;
	if (flagOverrides.has(key)) {
		value = flagOverrides.get(key);
	} else {
		value = globalThis.D2L?.LP?.Web?.UI?.Flags.Flag(key, defaultValue) ?? defaultValue;
	}
	addKnownFlag(key, value, defaultValue);
	return value;
}

export function getFlagOverrides() {
	return flagOverrides;
}

export function getKnownFlags() {
	return knownFlags;
}

export function mockFlag(key, value) {
	if (!globalThis.isD2LTestPage && knownFlags.has(key)) {
		console.warn(getWarnMessage(key));
	}
	flagOverrides.set(key, value);
}

export function resetFlag(key) {
	flagOverrides.delete(key);
}

let dispatchingKnownFlags = false;

function addKnownFlag(key, value, defaultValue) {
	if (!knownFlags.has(key)) knownFlags.set(key, { value, defaultValue });

	if (globalThis.document?.dispatchEvent === undefined) return;

	if (dispatchingKnownFlags) return;
	dispatchingKnownFlags = true;
	setTimeout(() => {
		globalThis.document.dispatchEvent(new CustomEvent('d2l-flags-known', {
			detail: { flagOverrides, knownFlags }
		}));
		dispatchingKnownFlags = false;
	});
}
