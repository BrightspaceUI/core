import './object-property-list-item.js';
import '../offscreen/screen-reader-pause.js';
import { css, html, LitElement, nothing } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A dot-separated list of object properties.
 * @slot - Items of the type d2l-object-property-list-item* to be added to the container
 */
class ObjectPropertyList extends LocalizeCoreElement(SkeletonMixin(LitElement)) {
	static get properties() {
		return {
			/**
			 * Number of skeleton items to insert
			 * @type {number}
			 */
			skeletonCount: { type: Number, attribute: 'skeleton-count' },
		};
	}

	static get styles() {
		return [super.styles, bodySmallStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			::slotted([slot="status"]) {
				display: none;
			}
			::slotted(d2l-status-indicator[slot="status"]:first-of-type) {
				display: inline-block;
				margin-inline-end: 0.25rem; /* 10px desired margin, subtract 5px arbitrary whitespace. */
			}
		`];
	}

	firstUpdated() {
		this.addEventListener('d2l-object-property-list-item-visibility-change', () => this._onItemsChanged());

		const slot = this.shadowRoot.querySelector('slot:not([name])');
		if (slot.childElementCount) this._setItemSeparatorVisibility(slot);
	}

	render() {
		const slotContents = this.skeleton && this.skeletonCount > 0 ? [...Array(this.skeletonCount)].map(() => html`
			<d2l-object-property-list-item text="${this.localize('components.object-property-list.item-placeholder-text')}" skeleton></d2l-object-property-list-item>
		`) : nothing;

		return html`
			<div class="d2l-body-small">
				<slot name="status"></slot>
				<d2l-screen-reader-pause></d2l-screen-reader-pause>
				<slot @slotchange="${this._onItemsChanged}">${slotContents}</slot>
			</div>
		`;
	}

	_onItemsChanged(e) {
		const slot = e?.target || this.shadowRoot.querySelector('slot:not([name])');
		this._setItemSeparatorVisibility(slot);
	}

	_setItemSeparatorVisibility(slot) {
		const slottedElements = slot.assignedElements();
		const elements = slottedElements.length ? slottedElements : [ ...slot.children ];
		const filtered = elements.filter(item => item.tagName?.toLowerCase().includes('d2l-object-property-list-') && !item.hidden);

		const lastIndex = filtered.length - 1;
		filtered.forEach((item, i) => item._showSeparator = (i !== lastIndex));
	}
}

customElements.define('d2l-object-property-list', ObjectPropertyList);
