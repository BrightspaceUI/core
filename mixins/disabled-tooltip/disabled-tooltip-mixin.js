import { css, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const disabledTooltipMaskStyles = css`
	:host([disabled]) .d2l-disabled-tooltip {
		cursor: default;
		opacity: 1;
		position: relative;
	}
	:host([disabled]) .d2l-disabled-tooltip::before {
		background-color: var(--d2l-theme-background-color-base);
		border-radius: inherit;
		content: "";
		inset: var(--d2l-disabled-tooltip-mask-inset, 0);
		opacity: var(--d2l-theme-opacity-disabled-control);
		position: absolute;
	}
`;
export const DisabledTooltipMixin = superclass => class extends superclass {
	static properties = {
		/**
		 * Disables the control
		 * @type {boolean}
		 */
		disabled: { type: Boolean, reflect: true },
		/**
		 * Tooltip text when disabled
		 * @type {string}
		 */
		disabledTooltip: { type: String, attribute: 'disabled-tooltip' }
	};

	constructor() {
		super();
		this.disabled = false;
	}

	get _ariaDisabledAttribute() {
		return ifDefined(this._hasDisabledTooltip ? 'true' : undefined);
	}

	get _disabled() {
		return this.disabled && !this.disabledTooltip;
	}

	get _hasDisabledTooltip() {
		return this.disabled && this.disabledTooltip;
	}

	_renderDisabledTooltip(controlId, { align = undefined, forceShow = false, position = undefined } = {}) {
		if (!this.disabled || !this.disabledTooltip) return nothing;
		return html`<d2l-tooltip
			align=${ifDefined(align)}
			class="vdiff-target"
			for="${controlId}"
			?force-show=${forceShow}
			position=${ifDefined(position)}>
			${this.disabledTooltip}
		</d2l-tooltip>`;
	}
};
