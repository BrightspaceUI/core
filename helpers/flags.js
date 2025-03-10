export const getFlag = (key, defaultValue) => window.D2L?.LP?.Web?.UI?.Flags.Flag(key, defaultValue) ?? defaultValue;
