import { css, html } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

export const InputInlineHelpMixin = superclass => class extends SkeletonMixin(superclass) {

	static get properties() {
		return {
			_hasInlineHelp: { type: Boolean, reflect: true, attribute: '_has-inline-help' }
		};
	}

	static get styles() {
		const styles = [ bodySmallStyles, css`
			:host([_has-inline-help]) .d2l-input-inline-help {
				display: block;
			}
			.d2l-input-inline-help {
				display: none;
				margin-top: 0.3rem !important;
				overflow-wrap: anywhere;
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._hasInlineHelp = false;
	}

	_handleInlineHelpSlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });
		this._hasInlineHelp = content?.length > 0;
	}

	_renderInlineHelp(id) {
		return html`
			<div id="${id}" class="d2l-body-small d2l-input-inline-help d2l-skeletize">
				<slot name="inline-help" @slotchange="${this._handleInlineHelpSlotChange}"></slot>
			</div>
		`;
	}
};
