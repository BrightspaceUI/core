import '../backdrop/backdrop.js';
import '../button/button.js';
import '../focus-trap/focus-trap.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { findComposedAncestor, getBoundingAncestor, isComposedAncestor, isVisible } from '../../helpers/dom.js';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';
import { tryGetIfrauBackdropService } from '../../helpers/ifrauBackdropService.js';

export const InputInlineHelpMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_hasInlineHelp: { type: Boolean, reflect: true, attribute: '_has-inline-help' }
		};
	}

	static get styles() {
		return [ super.styles, bodySmallStyles, css`
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
