/**
 * This is a draft mixin that may eventually be extended to support
 * themed components, including "dark mode". At that point, the
 * "theme" attribute could resolve automatically based on the user's
 * OS preference. For now, it's only used in menus/dropdowns by
 * the media player.
 */
export const ThemeMixin = superclass => class extends superclass {

	static get properties() {
		return {
			theme: { reflect: true, type: String }
		};
	}

	/**
	 * @attr theme
	 * @type {string}
	 */
	get theme() { return this._theme; }
	set theme(value) {
		const oldValue = this._theme;
		this._theme = value;
		this.requestUpdate('theme', oldValue);
	}

};
