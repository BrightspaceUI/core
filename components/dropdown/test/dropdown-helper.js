const { oneEvent } = require('@brightspace-ui/visual-diff/helpers');

module.exports = {

	getOpenEvent(page, selector) {
		return oneEvent(page, selector, 'd2l-dropdown-open');
	},

	async open(page, selector) {
		const openEvent = this.getOpenEvent(page, selector);
		await page.$eval(selector, dropdown => dropdown.toggleOpen());
		return openEvent;
	},

	async reset(page, selector) {
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
	},

	getRect(page, selector) {
		return page.$eval(`${selector} > [dropdown-content]`, (content) => {
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
	},
};
