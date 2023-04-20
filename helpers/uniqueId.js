let uniqueIndex = 0;

export function getUniqueId() {
	uniqueIndex++;
	return `d2l-uid-${uniqueIndex}`;
}
