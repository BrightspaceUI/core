import { oneEvent } from '@brightspace-ui/visual-diff/helpers/index.js';

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
