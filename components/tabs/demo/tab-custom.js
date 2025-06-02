import { css, html, LitElement } from 'lit';
import { getFocusPseudoClass, getFocusRingStyles } from '../../../helpers/focus.js';
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
			${getFocusRingStyles(
				`:host(:${getFocusPseudoClass()}) .d2l-tab-custom-content`,
				{ noFocusPseudoClass:true, baseOffset:'0', extraStyles:'border-radius: 0.3rem;' }
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
