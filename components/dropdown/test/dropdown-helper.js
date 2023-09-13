import { oneEvent } from '@brightspace-ui/visual-diff';

export function getOpenEvent(page, selector) {
	return oneEvent(page, selector, 'd2l-dropdown-open');
}

export async function open(page, selector) {
	const openEvent = getOpenEvent(page, selector);
	await page.$eval(selector, dropdown => dropdown.toggleOpen());
	return openEvent;
}

export async function reset(page, selector) {
	await page.$eval(selector, (dropdown) => {
		return new Promise((resolve) => {
			const content = dropdown.querySelector('[dropdown-content]');
			content.scrollTo(0);
			if (content.opened) {
				content.addEventListener('d2l-dropdown-close', () => resolve(), { once: true });
				content.opened = false;
			} else {
				resolve();
			}
		});
	});
}
