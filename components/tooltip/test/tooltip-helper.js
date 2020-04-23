const getEvent = (page, selector, name) => {
	return page.$eval(selector, (elem, name) => {
		return new Promise((resolve) => {
			elem.addEventListener(name, resolve, { once: true });
		});
	}, name);
};

module.exports = {

	getShowEvent(page, selector) {
		return getEvent(page, selector, 'd2l-tooltip-show');
	},

	async show(page, selector) {
		const openEvent = this.getShowEvent(page, selector);
		page.$eval(`${selector} d2l-tooltip`, tooltip => tooltip.show());
		return openEvent;
	}

};
