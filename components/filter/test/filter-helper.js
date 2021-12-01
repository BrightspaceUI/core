export function getOpenEvent(page, selector) {
	return page.$eval(selector, filter => {
		const content = filter.shadowRoot.querySelector('[dropdown-content]');
		return new Promise((resolve) => {
			content.addEventListener('d2l-dropdown-open', () => requestAnimationFrame(resolve), { once: true });
		});
	});
}
export function getShowCompleteEvent(page, selector) {
	return page.$eval(selector, filter => {
		return new Promise((resolve) => {
			filter.addEventListener('d2l-hierarchical-view-show-complete', () => requestAnimationFrame(resolve), { once: true });
		});
	});
}

export async function open(page, selector) {
	const openEvent = getOpenEvent(page, selector);
	await page.$eval(selector, filter => filter.opened = true);
	return openEvent;
}

export async function show(page, selector, dimensionNum) {
	const showCompleteEvent = getShowCompleteEvent(page, selector);
	await page.$eval(selector, (filter, num) => {
		const dims = filter.shadowRoot.querySelectorAll('d2l-menu-item');
		dims[num].click();
	}, dimensionNum);
	return showCompleteEvent;
}

export async function reset(page, selector) {
	await page.$eval(selector, (filter) => {
		const content = filter.shadowRoot.querySelector('[dropdown-content]');
		return new Promise((resolve) => {
			content.scrollTo(0);
			if (content.opened) {
				content.addEventListener('d2l-dropdown-close', () => resolve(), { once: true });
				filter.opened = false;
			} else {
				resolve();
			}
		});
	});
}

export function getRect(page, selector) {
	return page.$eval(selector, (filter) => {
		const content = filter.shadowRoot.querySelector('[dropdown-content]');
		const opener = content.__getOpener();
		const contentWidth = content.shadowRoot.querySelector('.d2l-dropdown-content-width');
		const openerRect = opener.getBoundingClientRect();
		const contentRect = contentWidth.getBoundingClientRect();
		const x = Math.min(openerRect.x, contentRect.x);
		const y = Math.min(openerRect.y, contentRect.y);
		const width = Math.max(openerRect.right, contentRect.right) - x;
		const height = Math.max(openerRect.bottom, contentRect.bottom) - y;
		return {
			x: x - 10,
			y: y - 10,
			width: width + 20,
			height: height + 20
		};
	});
}
