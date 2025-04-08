import { css, html, LitElement, unsafeCSS } from 'lit';
import { getFocusPseudoClass } from '../../../helpers/focus.js';
import { TabMixin } from '../tab-mixin.js';

class TabCustom extends TabMixin(LitElement) {

	static get styles() {
		const styles = [ css`
			.d2l-tab-custom-content {
				margin: 0.5rem;
				overflow: hidden;
				padding: 0.1rem;
				white-space: nowrap;
			}
			:host(:first-child) .d2l-tab-custom-content {
				margin-inline-start: 0;
			}
			:host(:${unsafeCSS(getFocusPseudoClass())}) .d2l-tab-custom-content {
				border-radius: 0.3rem;
				color: var(--d2l-color-celestine);
				outline: 2px solid var(--d2l-color-celestine);
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	renderContent() {
		return html`
			<div class="d2l-tab-custom-content">
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('d2l-tab-custom', TabCustom);
