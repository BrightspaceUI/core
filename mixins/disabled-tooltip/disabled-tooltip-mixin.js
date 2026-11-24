import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

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

	get _ariaDisabled() {
		return ifDefined(this.disabled && this.disabledTooltip ? 'true' : undefined);
	}

	get _disabled() {
		return this.disabled && !this.disabledTooltip;
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
