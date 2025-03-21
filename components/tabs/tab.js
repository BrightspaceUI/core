import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { TabMixin } from './tab-mixin.js';

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
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('text')) {
			/** Dispatched when the text attribute is changed */
			this.dispatchEvent(new CustomEvent(
				'd2l-tab-content-change', { bubbles: true, composed: true, detail: { text: this.text } }
			));
		}
	}

	renderContent() {
		const contentClasses = {
			'd2l-tab-text': true,
		};

		return html`
			<div class="${classMap(contentClasses)}">
				${this.text}
			</div>
		`;
	}
}

customElements.define('d2l-tab', Tab);
