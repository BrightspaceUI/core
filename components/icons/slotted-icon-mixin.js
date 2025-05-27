import '../icons/icon.js';
import { css, html, nothing } from 'lit';

export const SlottedIconMixin = superclass => class extends superclass {

	static get properties() {
		return {

			/**
			 * Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: { type: String, reflect: true },
			_hasCustomIcon: { state: true, reflect: true }
		};
	}

	static get styles() {
		const styles = [ css`
			slot[name="icon"]::slotted(*) {
				display: none;
			}
			slot[name="icon"]::slotted(d2l-icon-custom) {
				display: inline-flex;
			}

			d2l-icon.property-icon,
			slot[name="icon"]::slotted(d2l-icon-custom) {
				height: 0.9rem;
				width: 0.9rem;
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		/** @internal */
		this._hasCustomIcon = false;
	}

	hasIcon() {
		return !!(this.icon || this._hasCustomIcon);
	}

	_handleIconSlotChange(e) {
		const icon = e && e.target && e.target.assignedNodes({ flatten: true }).filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && node.tagName === 'D2L-ICON-CUSTOM';
		});
		this._hasCustomIcon = icon.length === 1;
	}

	_renderIcon() {
		const icon = this.icon ? html`<d2l-icon icon="${this.icon}" class="property-icon"></d2l-icon>` : nothing;
		return html`<slot name="icon" @slotchange="${this._handleIconSlotChange}">${icon}</slot>`;
	}
};
