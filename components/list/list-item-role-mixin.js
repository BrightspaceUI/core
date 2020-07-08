import { findComposedAncestor } from '../../helpers/dom.js';

export const ListItemRoleMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			role: { type: String, reflect: true }
		};
	}

	connectedCallback() {
		super.connectedCallback();

		const parent = findComposedAncestor(this.parentNode, node => node && node.tagName === 'D2L-LIST');
		if (!parent) return;

		const separators = parent.getAttribute('separators');

		this.role = parent.grid ? 'rowgroup' : 'listitem';
		this._separators = separators || undefined;
		this._extendSeparators = parent.hasAttribute('extend-separators');
	}
};
