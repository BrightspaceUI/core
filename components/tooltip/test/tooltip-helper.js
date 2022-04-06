import { oneEvent } from '@brightspace-ui/visual-diff';

export async function hide(page, selector) {
	const hideEvent = oneEvent(page, selector, 'd2l-tooltip-hide');
	page.$eval(`${selector} d2l-tooltip`, tooltip => tooltip.hide());
	return hideEvent;
}

export async function show(page, selector) {
	const openEvent = oneEvent(page, selector, 'd2l-tooltip-show');
	page.$eval(`${selector} d2l-tooltip`, tooltip => tooltip.show());
	return openEvent;
}

export function getRect(page, selector) {
	return page.$eval(selector, elem => {
		let x, y, width, height;
		const openerRect = elem.getBoundingClientRect();
		const content = elem.querySelector('d2l-tooltip');
		if (!content.showing) {
			x = openerRect.x;
			y = openerRect.y;
			width = openerRect.right - x;
			height = openerRect.bottom - y;
		} else {
			const contentWidth = content.shadowRoot.querySelector('.d2l-tooltip-content');
			const contentRect = contentWidth.getBoundingClientRect();
			x = Math.min(openerRect.x, contentRect.x);
			y = Math.min(openerRect.y, contentRect.y);
			width = Math.max(openerRect.right, contentRect.right) - x;
			height = Math.max(openerRect.bottom, contentRect.bottom) - y;
		}
		return {
			x: x - 10,
			y: y - 10,
			width: width + 20,
			height: height + 20
		};
	});
}
