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

};
