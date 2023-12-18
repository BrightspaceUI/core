import '../colors/colors.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { CountBadgeMixin } from './count-badge-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';

class CountBadge extends FocusMixin(CountBadgeMixin(LitElement)) {

	static get styles() {
		return [super.styles, css`
		:host([focus-ring]) .d2l-count-badge-wrapper,
		:host(:${unsafeCSS(getFocusPseudoClass())}) .d2l-count-badge-wrapper,
		.d2l-count-badge-wrapper:${unsafeCSS(getFocusPseudoClass())} {
			box-shadow: 0 0 0 2px var(--d2l-color-celestine);
		}

		.d2l-count-badge-wrapper {
			border: 2px solid transparent;
		}

		:host([size="small"]) .d2l-count-badge-wrapper {
			border-radius: 0.65rem;
			outline: none;
		}

		:host([size="large"]) .d2l-count-badge-wrapper {
			border-radius: 0.8rem;
			outline: none;
		}
		`];
	}

	constructor() {
		super();
		this._badgeId = getUniqueId();
	}

	static get focusElementSelector() {
		return '.d2l-count-badge-wrapper';
	}

	render() {
		const tabbable = (this.tabStop || this.hasTooltip) && !(this.hideZero && this.number === 0) && !this.skeleton;
		const innerHtml = html`
			<div
			class="d2l-count-badge-wrapper d2l-skeletize"
			id="${this._badgeId}"
			tabindex="${ifDefined(tabbable ? '0' : undefined)}"
			aria-labelledby="${ifDefined(this.getAriaLabelId())}"
			role="img">
				${this.renderCount()}
			</div>
		`;
		return this.renderTooltips(innerHtml, this._badgeId);
	}
}

customElements.define('d2l-count-badge', CountBadge);
