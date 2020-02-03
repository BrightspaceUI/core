const getEvent = (page, selector, name) => {
	return page.$eval(selector, (elem, name) => {
		return new Promise((resolve) => {
			elem.addEventListener(name, resolve, { once: true });
		});
	}, name);
};

const asyncSetTimeout = (delay) => {
	return new Promise(resolve => setTimeout(resolve, delay));
};

module.exports = {

	getOpenEvent(page, selector) {
		return getEvent(page, selector, 'd2l-dropdown-open');
	},

	async open(page, selector) {
		const openEvent = this.getOpenEvent(page, selector);
		await page.$eval(selector, (dropdown) => {
			dropdown.toggleOpen();
		});
		// 300ms fade-in animation on open
		await asyncSetTimeout(300);
		return openEvent;
	},

};
