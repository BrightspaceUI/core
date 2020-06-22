import { findComposedAncestor } from '../../helpers/dom.js';

export const ListItemMixin = superclass => class extends superclass {

	static get properties() {
		return {
			role: { type: String, reflect: true }
		};
	}

	connectedCallback() {
		super.connectedCallback();

		const parent = findComposedAncestor(this.parentNode, node => node && node.tagName === 'D2L-LIST');
		if (!parent) return;
		this.role = parent.grid ? 'rowgroup' : 'listitem';
	}
};
