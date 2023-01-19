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
			::slotted(:last-child), slot :last-child {
				--d2l-object-property-list-item-separator-display: none;
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

	render() {
		const slotContents = this.skeleton && this.skeletonCount > 0 ? [...Array(this.skeletonCount)].map(() => html`
			<d2l-object-property-list-item text="${this.localize('components.object-property-list.item-placeholder-text')}" skeleton></d2l-object-property-list-item>
		`) : nothing;

		return html`
			<div class="d2l-body-small">
				<slot name="status"></slot>
				<d2l-screen-reader-pause></d2l-screen-reader-pause>
				<slot>${slotContents}</slot>
			</div>
		`;
	}
}

customElements.define('d2l-object-property-list', ObjectPropertyList);
