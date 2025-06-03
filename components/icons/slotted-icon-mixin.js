import '../icons/icon.js';
import { css, html, nothing } from 'lit';

export const SlottedIconMixin = superclass => class extends superclass {

	static get properties() {
		return {

			/**
			 * Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: {
				type: String,
				reflect: true,
				required: {
					validator: (_value, elem, hasValue) => hasValue || elem._hasCustomIcon || !elem._iconRequired
				}
			},
			_hasCustomIcon: { state: true }
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
		this._iconRequired = false;
	}

	hasIcon() {
		return !!(this.icon || this._hasCustomIcon);
	}

	_renderIcon() {
		const icon = this.icon ? html`<d2l-icon icon="${this.icon}" class="property-icon"></d2l-icon>` : nothing;
		return html`<slot name="icon" @slotchange="${this.#handleIconSlotChange}">${icon}</slot>`;
	}

	#handleIconSlotChange(e) {
		const icon = e.target.assignedElements({ flatten: true }).filter((node) => node.tagName === 'D2L-ICON-CUSTOM');
		this._hasCustomIcon = icon.length === 1;
	}
};
