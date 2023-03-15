import { focusWithKeyboard } from '@brightspace-ui/visual-diff';

export async function open(page, selector) {
	const openEvent = page.$eval(selector, (elem) => {
		return new Promise((resolve) => {
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown');
			dropdown.addEventListener('d2l-dropdown-open', resolve, { once: true });
			dropdown.toggleOpen();
		});
	});

	return openEvent;
}

export async function reset(page, selector) {
	await page.$eval(selector, (elem) => {
		const dropdown = elem.shadowRoot.querySelector('d2l-dropdown');
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

export async function resetInnerTimeInput(page, selector) {
	await page.$eval(selector, (elem) => {
		const timeInput = elem.shadowRoot.querySelector('d2l-input-time');
		const dropdown = timeInput.shadowRoot.querySelector('d2l-dropdown');
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

export function getRect(page, selector) {
	return page.$eval(selector, (elem) => {
		const content = elem.shadowRoot.querySelector('[dropdown-content]');
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

export function getRectTooltip(page, selector, tooltipIndex) {
	return page.$eval(selector, (elem, tooltipIndex) => {
		const content = elem.shadowRoot.querySelectorAll('d2l-tooltip')[tooltipIndex ? tooltipIndex : 0];
		const contentWidth = content.shadowRoot.querySelector('.d2l-tooltip-content');
		const openerRect = elem.getBoundingClientRect();
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
	}, tooltipIndex);
}

export async function focusOnInput(page, selector, inputSelector) {
	setTimeout(() => focusWithKeyboard(page, [selector, inputSelector]));
	return page.$eval(selector, (elem) => {
		elem.blur();
		return new Promise((resolve) => {
			elem.addEventListener('d2l-tooltip-show', () => requestAnimationFrame(resolve), { once: true });
		});
	});
}
