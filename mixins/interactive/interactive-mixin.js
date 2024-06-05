import { css, html } from 'lit';
import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { classMap } from 'lit/directives/class-map.js';
import { getNextFocusable } from '../../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../../components/offscreen/offscreen.js';
import { RtlMixin } from '../rtl/rtl-mixin.js';

const keyCodes = {
	ENTER: 13,
	ESCAPE: 27,
	TAB: 9
};

export function isInteractiveDescendant(node) {
	if (!node) return false;
	return !!findComposedAncestor(node, node => {
		return node.classList && node.classList.contains('interactive-trap');
	});
}

export const InteractiveMixin = superclass => class extends LocalizeCoreElement(RtlMixin(superclass)) {

	static get properties() {
		return {
			_focusingToggle: { state: true },
			_hasInteractiveAncestor: { state: true },
			_interactive: { state: true }
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			.interactive-focusing-toggle {
				border-radius: 6px;
				outline: 2px solid var(--d2l-color-celestine);
				outline-offset: 2px;
			}
		`];
	}

	constructor() {
		super();
		this._focusingToggle = false;
		this._hasInteractiveAncestor = false;
		this._interactive = false;
	}

	connectedCallback() {
		super.connectedCallback();

		const parentGrid = findComposedAncestor(this.parentNode, node => {
			return (node.nodeType === Node.ELEMENT_NODE && (node.hasAttribute('grid') || node.getAttribute('role') === 'grid'));
		});
		this._hasInteractiveAncestor = (parentGrid !== null);
	}

	focus() {
		if (!this.shadowRoot) return;
		if (this._hasInteractiveAncestor && !this._interactive) this.shadowRoot.querySelector('.interactive-toggle').focus();
		else this._focusDelegate();
	}

	renderInteractiveContainer(inner, label, focusDelegate) {
		if (!label) {
			throw new Error(`InteractiveMixin: no label provided for "${this.tagName}"`);
		}
		if (!focusDelegate) {
			throw new Error(`InteractiveMixin: no focus delegate provided for "${this.tagName}"`);
		}

		this._focusDelegate = focusDelegate;
		if (!this._hasInteractiveAncestor) return inner;

		const classes = {
			'interactive-focusing-toggle': this._focusingToggle
		};

		return html`
			<div class="${classMap(classes)}" @keydown="${this._handleInteractiveKeyDown}">
				<button
					class="interactive-toggle d2l-offscreen"
					@blur="${this._handleInteractiveToggleBlur}"
					@click="${this._handleInteractiveToggleClick}"
					@focus="${this._handleInteractiveToggleFocus}"
					tabindex="${ifDefined(this._hasInteractiveAncestor && !this._interactive ? '0' : '-1')}">
					${`${label}, ${this.localize('components.interactive.instructions')}`}
				</button>
				<div class="interactive-trap">
					<span class="interactive-trap-start" @focus="${this._handleInteractiveTrapStartFocus}" tabindex="${ifDefined(this._hasInteractiveAncestor ? '0' : undefined)}"></span>
					<div class="interactive-container-content" @focusin="${this._handleInteractiveContentFocusIn}" @focusout="${this._handleInteractiveContentFocusOut}">${inner}</div>
					<span class="interactive-trap-end" @focus="${this._handleInteractiveTrapEndFocus}" tabindex="${ifDefined(this._hasInteractiveAncestor ? '0' : undefined)}"></span>
				</div>
			</div>
		`;
	}

	_handleInteractiveContentFocusIn() {
		this._interactive = true;
	}

	_handleInteractiveContentFocusOut(e) {
		if (isComposedAncestor(this.shadowRoot.querySelector('.interactive-container-content'), e.relatedTarget)) return;
		// focus moved out of the interactive content
		this._interactive = false;
	}

	async _handleInteractiveKeyDown(e) {
		if (this._interactive) {
			if (e.keyCode === keyCodes.ESCAPE) {
				// TODO: escape closes the dropdown but also exits interactive-mixin. we likely only want it to close the dropdown.
				this._interactive = false;
				await this.updateComplete;
				this.shadowRoot.querySelector('.interactive-toggle').focus();
			} else if (e.keyCode === keyCodes.TAB) {
				e.stopPropagation();
			}
		}
	}

	_handleInteractiveToggleBlur() {
		this._focusingToggle = false;
	}

	async _handleInteractiveToggleClick() {
		this._interactive = true;
		await this.updateComplete;
		this.focus();
	}

	_handleInteractiveToggleFocus() {
		this._focusingToggle = true;
	}

	async _handleInteractiveTrapEndFocus() {
		// focus moved to trap-end either forwards from contents or backwards from outside - focus interactive toggle
		this._interactive = false;
		await this.updateComplete;
		this.shadowRoot.querySelector('.interactive-toggle').focus();
	}

	async _handleInteractiveTrapStartFocus(e) {
		if (e.relatedTarget === this.shadowRoot.querySelector('.interactive-toggle')) {
			// focus moved to trap-start while non-interactive - focus next focusable after this component
			const nextFocusable = getNextFocusable(this.shadowRoot.querySelector('.interactive-trap-end'));
			if (nextFocusable) nextFocusable.focus();
		} else {
			// focus moved to trap-start backwards from within contents - toggle to non-interactive and apply focus
			this._interactive = false;
			await this.updateComplete;
			this.shadowRoot.querySelector('.interactive-toggle').focus();
		}
	}

};
