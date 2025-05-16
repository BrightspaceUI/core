const flagOverrides = new Map();

export function getFlag(key, defaultValue) {
	if (flagOverrides.has(key)) {
		return flagOverrides.get(key);
	}
	return globalThis.D2L?.LP?.Web?.UI?.Flags.Flag(key, defaultValue) ?? defaultValue;
}

export function mockFlag(key, value) {
	flagOverrides.set(key, value);
}

export function resetFlag(key) {
	flagOverrides.delete(key);
}
