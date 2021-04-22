export async function getRect(page, selector) {
	const offsetTop = await page.$eval(selector, (toast) => {
		const elem = toast.shadowRoot.querySelector('.d2l-alert-toast-container');
		return elem.offsetTop;
	});
	return {
		x: 0,
		y: offsetTop - 10,
		width: page.viewport().width,
		height: page.viewport().height - offsetTop + 10
	};
}

export async function open(page, selector) {
	return page.$eval(selector, (toast) => toast.open = true);
}
