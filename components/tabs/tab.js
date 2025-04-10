import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { TabMixin } from './tab-mixin.js';

/**
 * @attr {string} id - REQUIRED: Unique identifier for the tab
 * @fires d2l-tab-content-change - Dispatched when the text attribute is changed. Triggers virtual scrolling calculations in parent d2l-tabs.
 * @slot before - Slot for content to be displayed before the tab text
 * @slot after - Slot for content to be displayed after the tab text
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
			.d2l-tab-inner-content {
				overflow: hidden;
				padding: 0.1rem;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			:host(:${unsafeCSS(getFocusPseudoClass())}) .d2l-tab-inner-content {
				border-radius: 0.3rem;
				color: var(--d2l-color-celestine);
				outline: 2px solid var(--d2l-color-celestine);
			}
			.d2l-tab-inner-content-skeletize-override {
				min-width: 50px;
			}
			:host([skeleton]) .d2l-tab-content.d2l-skeletize::before {
				inset-block: 0.15rem;
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
			'd2l-tab-inner-content': true,
			'd2l-tab-inner-content-skeletize-override': overrideSkeletonText
		};

		return html`
			<div class="${classMap(contentClasses)}">
				<slot name="before"></slot>
				<span>${overrideSkeletonText ? html`&nbsp;` : this.text}</span>
				<slot name="after"></slot>
			</div>
		`;
	}
}

customElements.define('d2l-tab', Tab);
