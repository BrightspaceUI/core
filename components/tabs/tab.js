import { css, html, LitElement, unsafeCSS } from 'lit';
import { getFocusPseudoClass, getFocusRingStyles } from '../../helpers/focus.js';
import { classMap } from 'lit/directives/class-map.js';
import { overflowEllipsisDeclarations } from '../../helpers/overflow.js';
import { TabMixin } from './tab-mixin.js';

const focusRingStyles = getFocusRingStyles(
	pseudoClass => `:host(:${pseudoClass}) .d2l-tab-text-inner-content`,
	{ extraStyles: css`border-radius: 0.3rem; color: var(--d2l-color-celestine);` }
);

/**
 * @attr {string} id - REQUIRED: Unique identifier for the tab
 * @fires d2l-tab-content-change - Dispatched when the text attribute is changed. Triggers virtual scrolling calculations in parent d2l-tabs.
 * @slot before - Slot for content to be displayed before the tab text. Supports `d2l-icon`, `d2l-icon-custom`, and `d2l-count-badge`. Only the *first* item assigned to this slot will be shown.
 * @slot after - Slot for content to be displayed after the tab text. Supports `d2l-icon`, `d2l-icon-custom`, and `d2l-count-badge`. Only the *last* item assigned to this slot will be shown.
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
				--d2l-focus-ring-offset: 0;
				display: flex;
				padding: 0.1rem;
			}
			${focusRingStyles}
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
				${overflowEllipsisDeclarations}
			}
			.d2l-tab-text-skeletize-override {
				min-width: 50px;
			}
			:host([skeleton]) .d2l-tab-content.d2l-skeletize::before {
				inset-block: 0.15rem;
			}

			/**
			 * Only allow d2l-icon, d2l-count-badge, and d2l-icon-custom in the before/after slots
			 * Only show the first item in the before slot and the last item in the after slot
			 */
			::slotted([slot]:not(d2l-icon):not(d2l-count-badge):not(d2l-icon-custom)),
			::slotted([slot="before"]:not(:first-child)),
			::slotted([slot="after"]:not(:last-child)) {
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
				<slot name="before"></slot>
				<span class="${classMap(contentClasses)}">${overrideSkeletonText ? html`&nbsp;` : this.text}</span>
				<slot name="after"></slot>
			</div>
		`;
	}
}

customElements.define('d2l-tab', Tab);
