window.D2L = window.D2L || {};
window.D2L.UniqueId = window.D2L.UniqueId || {};

export function getUniqueId() {

	if (window.D2L.UniqueId._unique_index === undefined) {
		window.D2L.UniqueId._unique_index = 0;
	}
	window.D2L.UniqueId._unique_index++;
	return `d2l-uid-${window.D2L.UniqueId._unique_index}`;

}
