import { css, html } from 'lit';

export const InputInlineHelpMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_hasInlineHelp: { type: Boolean, reflect: true, attribute: '_has-inline-help' }
		};
	}

	static get styles() {
		return [ super.styles, css`
			:host([_has-inline-help]) .d2l-input-inline-help {
				display: block;
			}
			.d2l-input-inline-help {
				display: none;
				margin-top: 0.5rem;
			}
		`
		];
	}

	constructor() {
		super();
		this._hasInlineHelp = false;
	}

	_renderInlineHelp(id) {
		return html`
			<div id="${id}" class="d2l-body-small d2l-input-inline-help">
				<slot name="inline-help" @slotchange="${this._handleInlineHelpSlotChange}"></slot>
			</div>
		`;
	}

	_handleInlineHelpSlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });
		this._hasInlineHelp = content?.length > 0;
	}

};
