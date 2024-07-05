import { css, html } from 'lit';
import { _generateBodySmallStyles } from '../typography/styles.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

export const inlineHelpStyles = [
	_generateBodySmallStyles('.d2l-input-inline-help'),
	css`
		.d2l-input-inline-help {
			margin-top: 0.3rem !important;
			overflow-wrap: anywhere;
		}
	`
];

export const InputInlineHelpMixin = superclass => class extends SkeletonMixin(superclass) {

	static get properties() {
		return {
			_hasInlineHelp: { type: Boolean, reflect: true, attribute: '_has-inline-help' }
		};
	}

	static get styles() {
		const styles = [ inlineHelpStyles, css`
			:host([_has-inline-help]) .d2l-input-inline-help {
				display: block;
			}
			.d2l-input-inline-help {
				display: none;
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
			<div id="${id}" class="d2l-input-inline-help d2l-skeletize">
				<slot name="inline-help" @slotchange="${this._handleInlineHelpSlotChange}"></slot>
			</div>
		`;
	}
};
