import { css, html, LitElement } from 'lit';
import { getFocusRingStyles } from '../../../helpers/focus.js';
import { TabMixin } from '../tab-mixin.js';

class TabCustom extends TabMixin(LitElement) {

	static get styles() {
		const styles = [ css`
			.d2l-tab-custom-content {
				--d2l-focus-ring-offset: 0;
				margin: 0.5rem;
				overflow: clip;
				overflow-clip-margin: 1em;
				padding: 0.1rem;
				white-space: nowrap;
			}
			:host(:first-child) .d2l-tab-custom-content {
				margin-inline-start: 0;
			}
			${getFocusRingStyles(
				pseudoClass => `:host(:${pseudoClass}) .d2l-tab-custom-content`,
				{ extraStyles: css`border-radius: 0.3rem; color: var(--d2l-color-celestine);` }
			)}
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
