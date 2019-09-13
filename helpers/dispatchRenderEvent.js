export function dispatchRenderEvent(elem) {
	const e = new CustomEvent('d2l-element-render', {
		bubbles: false,
		composed: false
	});
	requestAnimationFrame(
		() => elem.dispatchEvent(e)
	);
}
