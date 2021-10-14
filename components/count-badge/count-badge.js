import '../colors/colors.js';
import { CountBadgeMixin, countBadgeStyles } from './count-badge-mixin.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

class CountBadge extends CountBadgeMixin(LitElement) {

	static get styles() {
		return [countBadgeStyles, css`
		:host(.focus-visible) .d2l-count-badge-wrapper,
		:host([focus-ring]) .d2l-count-badge-wrapper,
		.d2l-count-badge-wrapper.focus-visible {
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

	render() {
		return html`
			<div 
			class="d2l-count-badge-wrapper"
			id="${this._badgeId}"
			tabindex="${ifDefined((this.tabStop || this.hasTooltip) && !(this.hideZero && this.number === 0) ? '0' : undefined)}" 
			aria-label="${ifDefined(this.hasTooltip ? undefined : this.text)}"
			aria-atomic="true" 
			aria-relevant="additions removals"
			aria-live="${this.announceChanges ? 'polite' : 'off'}"
			role="img">
				${this.renderCount()}
			</div>
			${this.renderTooltips(this._badgeId)}
		`;
	}
}

customElements.define('d2l-count-badge', CountBadge);
