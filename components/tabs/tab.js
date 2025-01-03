import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { TabMixin } from './tab-mixin.js';

class Tab extends TabMixin(LitElement) {

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
				margin-inline-end: 0.6rem;
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

	renderContent() {
		const contentClasses = {
			'd2l-tab-handler': true,
			'd2l-tab-text': true,
		};

		return html`
			<div class="${classMap(contentClasses)}">
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('d2l-tab-wip', Tab);
