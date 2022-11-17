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
			/**
			 * @ignore
			 */
			theme: { reflect: true, type: String }
		};
	}

	constructor() {
		super();
		const theme = document.documentElement.dataset.theme;
		// todo: dark-mode - maybe observe changes to the html element's theme attribute
		this.theme = theme;
	}

};
