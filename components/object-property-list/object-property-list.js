import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A dot-separated list of object properties.
 * @slot - Items of the type d2l-object-property-list-item* to be added to the container
 */
class ObjectPropertyList extends SkeletonMixin(LitElement) {
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
			:host, slot {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			::slotted(:last-child) {
				--d2l-object-property-list-item-separator-display: none;
			}
		`];
	}

	render() {

		return !this.skeleton || !this.skeletonCount > 0 ?
			html`<slot class="d2l-body-small"></slot>` :
			[...Array(this.skeletonCount)].map(() => html`<d2l-object-property-list-item text='' skeleton></d2l-object-property-list-item>`);
	}
}

customElements.define('d2l-object-property-list', ObjectPropertyList);
