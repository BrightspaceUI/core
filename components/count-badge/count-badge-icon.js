import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { CountBadgeMixin } from './count-badge-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusRingStyles } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';

class CountBadgeIcon extends FocusMixin(CountBadgeMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: {
				type: String,
				reflect: true
			}
		};
	}

	static get styles() {
		return [super.styles, css`
		${getFocusRingStyles(pseudoClass => `:host([focus-ring]) d2l-icon, d2l-icon:${pseudoClass}`)}
		:host {
			display: inline-block;
			/* symmetrical padding to prevent overflows for most numbers */
			padding-left: 0.5rem;
			padding-right: 0.5rem;
			position: relative;
		}

		:host([size="large"]) {
			--d2l-count-badge-icon-padding-top: 0.7rem;
			padding-top: var(--d2l-count-badge-icon-padding-top);
		}

		:host([size="small"]) {
			--d2l-count-badge-icon-padding-top: 0.55rem;
			padding-top: var(--d2l-count-badge-icon-padding-top);
		}

		d2l-tooltip[_open-dir="top"] {
			margin-top: calc(0px - var(--d2l-count-badge-icon-padding-top));
		}

		d2l-icon {
			--d2l-focus-ring-offset: 0;
			border: 2px solid transparent;
			border-radius: 6px;
		}
		`];
	}

	constructor() {
		super();
		this._badgeId = getUniqueId();
	}

	static get focusElementSelector() {
		return 'd2l-icon';
	}

	render() {
		let numberStyles = {
			border: '2px solid white',
			position: 'absolute',
			visibility: this.skeleton ? 'hidden' : undefined,
		};

		// center long number strings to prevent overflow
		const centerNumber = this.getNumberString().length >= 4;

		if (centerNumber) {
			// left 50% + translateX(-50%) will center for both LTR and RTL
			numberStyles = {
				... numberStyles,
				left: '50%',
				transform: 'translate(-50%, -50%)'
			};
		} else {
			numberStyles = {
				... numberStyles,
				insetInlineEnd: '-0.1rem',
				transform: 'translateY(-50%)'
			};
		}
		const tabbable = (this.tabStop || this.hasTooltip) && !this.skeleton;
		const innerHtml = html`
			${this.renderCount(numberStyles)}
			<div class="d2l-skeletize d2l-count-badge-wrapper">
				<d2l-icon id="${this._badgeId}"
					icon="${this.icon}"
					tabindex="${ifDefined(tabbable ? '0' : undefined)}"
					aria-labelledby="${ifDefined(this.getAriaLabelId())}"
					role="img">
				</d2l-icon>
			</div>
		`;
		return this.renderTooltips(innerHtml, this._badgeId);
	}
}

customElements.define('d2l-count-badge-icon', CountBadgeIcon);
