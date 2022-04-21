import { css, html } from 'lit';
import { findComposedAncestor, isComposedAncestor } from '../helpers/dom.js';
import { getNextFocusable } from '../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';

const keyCodes = {
	ENTER: 13,
	ESCAPE: 27
};

export const InteractiveMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_hasInteractiveAncestor: { state: true },
			_interactive: { state: true }
		};
	}

	static get styles() {
		return css`
			.interactive-container:focus-visible {
				border-radius: 6px;
				outline: 2px solid var(--d2l-color-celestine);
				outline-offset: 2px;
			}
		`;
	}

	constructor() {
		super();
		this._hasInteractiveAncestor = false;
		this._interactive = false;
	}

	connectedCallback() {
		super.connectedCallback();

		const parentGrid = findComposedAncestor(this.parentNode, node => {
			return ((node.tagName === 'D2L-LIST' && node.grid) || node.role === 'grid');
		});
		this._hasInteractiveAncestor = (parentGrid !== null);
		this._hasInteractiveAncestor = true;
	}

	_handleInteractiveContentFocusIn() {
		this._interactive = true;
	}

	_handleInteractiveContentFocusOut(e) {
		if (isComposedAncestor(this.shadowRoot.querySelector('.interactive-container-content'), e.relatedTarget)) return;
		// focus moved out of the interactive content
		this._interactive = false;
	}

	_handleInteractiveEndFocus() {
		// focus moved to trap-end either forwards from contents or backwards from outside - focus interactive toggle
		this.shadowRoot.querySelector('.interactive-container').focus();
	}

	async _handleInteractiveKeyDown(e) {
		if (!this._hasInteractiveAncestor) return;
		if (!this._interactive && e.keyCode === keyCodes.ENTER) {
			this._interactive = true;
			await this.updateComplete;
			this.focus();
		} else if (this._interactive && e.keyCode === keyCodes.ESCAPE) {
			this._interactive = false;
			await this.updateComplete;
			this.shadowRoot.querySelector('.interactive-container').focus();
		}
	}

	async _handleInteractiveStartFocus(e) {
		if (e.relatedTarget === this.shadowRoot.querySelector('.interactive-container')) {
			// focus moved to trap-start while non-interactive - focus next focusable after this component
			const nextFocusable = getNextFocusable(this.shadowRoot.querySelector('.interactive-trap-end'));
			if (nextFocusable) nextFocusable.focus();
		} else {
			// focus moved to trap-start backwards from within contents - toggle to non-interactive and apply focus
			this._interactive = false;
			await this.updateComplete;
			this.shadowRoot.querySelector('.interactive-container').focus();
		}
	}

	_renderInteractiveContainer(inner) {
		if (!this._hasInteractiveAncestor) return inner;
		return html`
			<div class="interactive-container"
				@keydown="${this._handleInteractiveKeyDown}"
				tabindex="${ifDefined(this._hasInteractiveAncestor && !this._interactive ? '0' : undefined)}">
					<span class="interactive-trap-start" @focus="${this._handleInteractiveStartFocus}" tabindex="${ifDefined(this._hasInteractiveAncestor ? '0' : undefined)}"></span>
					<div class="interactive-container-content" @focusin="${this._handleInteractiveContentFocusIn}" @focusout="${this._handleInteractiveContentFocusOut}">${inner}</div>
					<span class="interactive-trap-end" @focus="${this._handleInteractiveEndFocus}" tabindex="${ifDefined(this._hasInteractiveAncestor ? '0' : undefined)}"></span>
			</div>
		`;
	}

};
