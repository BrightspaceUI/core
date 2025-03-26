import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { TabMixin } from './tab-mixin.js';

/**
 * @fires d2l-tab-content-change - Dispatched when the text attribute is changed. Triggers virtual scrolling calculations in parent d2l-tabs.
 */
class Tab extends TabMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: REQUIRED: The text used for the tab, as well as labelling the panel.
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	static get styles() {
		const styles = [ css`
			.d2l-tab-text {
				margin: 0.5rem;
				overflow: hidden;
				padding: 0.1rem;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			:host(:first-child) .d2l-tab-text {
				margin-inline-start: 0;
			}
			:host(:${unsafeCSS(getFocusPseudoClass())}) > .d2l-tab-text {
				border-radius: 0.3rem;
				box-shadow: 0 0 0 2px var(--d2l-color-celestine);
				color: var(--d2l-color-celestine);
			}
			.d2l-tab-text-skeletize-override {
				min-width: 50px;
			}
			:host([skeleton]) .d2l-tab-text.d2l-skeletize::before {
				bottom: 0.15rem;
				top: 0.15rem;
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
			'd2l-skeletize': true,
			'd2l-tab-text-skeletize-override': overrideSkeletonText
		};

		return html`
			<div class="${classMap(contentClasses)}">${overrideSkeletonText ? html`&nbsp;` : this.text}</div>
		`;
	}
}

customElements.define('d2l-tab', Tab);
