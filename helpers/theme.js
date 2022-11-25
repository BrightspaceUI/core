
class ThemeController {

	constructor() {
		const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		if (themeMediaQuery.addEventListenter) {
			themeMediaQuery.addEventListenter('change', e => this.theme = (e.matches ? 'dark' : 'light'));
		} else if (themeMediaQuery.addListener) {
			themeMediaQuery.addListener(e => this.theme = (e.matches ? 'dark' : 'light'));
		}

		this._listeners = [];
		this.theme = (themeMediaQuery.matches ? 'dark' : 'light');
	}

	get theme() { return document.documentElement.dataset.theme; }
	set theme(val) {
		if (val === document.documentElement.dataset.theme) return;
		document.documentElement.dataset.theme = val;
		this._listeners.forEach(cb => cb(val));
	}

	addChangeListener(cb) {
		this._listeners.push(cb);
	}

	removeChangeListener(cb) {
		const index = this._listeners.indexOf(cb);
		if (index < 0) return;
		this._listeners.splice(index, 1);
	}

}

export const themeController = new ThemeController();
