import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { TabMixin } from './tab-mixin.js';

function handleSlotChange(e) {
	const slot = e.target;
	if (!slot || !slot.assignedElements || slot.assignedElements().length === 0) return;
	const elems = slot.assignedElements({ flatten: true }).filter((node) => (getComputedStyle(node).display !== 'none' || node.hasAttribute('data-hide')));
	if (!elems) return;

	for (let i = 0; i < elems.length; i++) {
		if (i === 0) {
			elems[i].removeAttribute('data-hide');
		} else {
			elems[i].setAttribute('data-hide', 'data-hide');
		}
	}
}

/**
 * @attr {string} id - REQUIRED: Unique identifier for the tab
 * @fires d2l-tab-content-change - Dispatched when the text attribute is changed. Triggers virtual scrolling calculations in parent d2l-tabs.
 * @slot before - Slot for content to be displayed before the tab text. Supports `d2l-icon`, `d2l-icon-custom`, and `d2l-count-badge`. Only the *first* item assigned to this slot will be shown.
 * @slot after - Slot for content to be displayed after the tab text. Supports `d2l-icon`, `d2l-icon-custom`, and `d2l-count-badge`. Only the *first* item assigned to this slot will be shown.
 */
class Tab extends TabMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: REQUIRED: The text used for the tab and for labelling the corresponding panel
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	static get styles() {
		const styles = [ css`
			.d2l-tab-text-inner-content {
				display: flex;
				padding: 0.1rem;
			}
			:host(:${unsafeCSS(getFocusPseudoClass())}) .d2l-tab-text-inner-content {
				border-radius: 0.3rem;
				color: var(--d2l-color-celestine);
				outline: 2px solid var(--d2l-color-celestine);
			}
			:host(:${unsafeCSS(getFocusPseudoClass())}) ::slotted(d2l-icon) {
				color: var(--d2l-color-celestine);
			}
			slot {
				align-items: center;
				display: flex;
			}
			::slotted([slot="before"]) {
				padding-inline-end: 0.3rem;
			}
			::slotted([slot="after"]) {
				padding-inline-start: 0.3rem;
			}
			:host(:not([selected]):hover) ::slotted(d2l-icon) {
				color: var(--d2l-color-celestine);
			}
			span {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.d2l-tab-text-skeletize-override {
				min-width: 50px;
			}
			:host([skeleton]) .d2l-tab-content.d2l-skeletize::before {
				inset-block: 0.15rem;
			}
			::slotted([slot="before"]:not(d2l-icon):not(d2l-count-badge):not(d2l-icon-custom)),
			::slotted([slot="after"]:not(d2l-icon):not(d2l-count-badge):not(d2l-icon-custom)) {
				display: none;
			}
			::slotted([data-hide]) {
				display: none;
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('text')) {
			this.dispatchContentChangeEvent();
		}
	}

	renderContent() {
		const overrideSkeletonText = this.skeleton && (!this.text || this.text.length === 0);
		const contentClasses = {
			'd2l-tab-text': true,
			'd2l-tab-text-skeletize-override': overrideSkeletonText
		};

		return html`
			<div class="d2l-tab-text-inner-content">
				<slot name="before" @slotchange="${handleSlotChange}"></slot>
				<span class="${classMap(contentClasses)}">${overrideSkeletonText ? html`&nbsp;` : this.text}</span>
				<slot name="after" @slotchange="${handleSlotChange}"></slot>
			</div>
		`;
	}
}

customElements.define('d2l-tab', Tab);
