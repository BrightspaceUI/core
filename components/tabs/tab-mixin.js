import '../colors/colors.js';
import { css, html } from 'lit';
import { getFlag } from '../../helpers/flags.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

export const TabMixin = superclass => class extends SkeletonMixin(superclass) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			hidden: { type: Boolean, reflect: true },
			/**
			 * Use to select the tab. Only one tab can be selected at a time.
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			role: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			tabIndex: { type: Number, reflect: true, attribute: 'tabindex' },
			_clicked: { type: Boolean, reflect: true },
		};
	}

	static get styles() {
		const styles = [ css`
			:host {
				box-sizing: border-box;
				display: inline-block;
				max-width: 200px;
				outline: none;
				position: relative;
				vertical-align: middle;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-tab-content {
				margin: 0.5rem;
			}
			:host(:first-child) .d2l-tab-content {
				margin-inline-start: 0;
			}
			.d2l-tab-selected-indicator {
				border-top: 4px solid var(--d2l-color-celestine);
				border-top-left-radius: 4px;
				border-top-right-radius: 4px;
				bottom: 0;
				display: none;
				margin: 1px 0.6rem 0 0.6rem;
				position: absolute;
				transition: box-shadow 0.2s;
				width: calc(100% - 1.2rem);
			}
			:host(:first-child) .d2l-tab-selected-indicator {
				margin-inline-start: 0;
				width: calc(100% - 0.6rem);
			}
			:host([selected]:focus) {
				text-decoration: none;
			}
			:host(:hover) {
				color: var(--d2l-color-celestine);
				cursor: pointer;
			}
			:host([_clicked]) {
				color: var(--d2l-color-celestine);
			}
			:host([selected]:hover) {
				color: inherit;
				cursor: default;
			}
			:host([selected]) .d2l-tab-selected-indicator {
				display: block;
			}
			:host([skeleton]) .d2l-tab-selected-indicator {
				position: absolute !important; /* make sure skeleton styles do not override this */
			}

		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.hidden = false;
		this.role = 'tab';
		this.selected = false;
		this.tabIndex = -1;

		this._clicked = false;
		this._noInitialSelectedEvent = getFlag('GAUD-8605-tab-no-initial-selected-event', true);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('click', this.#handleClick);
		this.addEventListener('keydown', this.#handleKeydown);
		this.addEventListener('keyup', this.#handleKeyup);

		this.#hasInitialized = true;
	}

	render() {
		return html`
			<div class="d2l-skeletize d2l-tab-content">${this.renderContent()}</div>
			<div class="d2l-tab-selected-indicator d2l-skeletize-container"></div>
		`;
	}

	update(changedProperties) {
		super.update(changedProperties);

		if (changedProperties.has('selected')) {
			this.ariaSelected = `${this.selected}`;
			if (!this.#hasInitialized && this._noInitialSelectedEvent) return; // Only fire events if selected changes after initial render

			if (this.selected) {
				/** Dispatched when a tab is selected */
				this.dispatchEvent(new CustomEvent(
					'd2l-tab-selected', { bubbles: true, composed: true }
				));
			} else {
				/** @ignore */
				this.dispatchEvent(new CustomEvent(
					'd2l-tab-deselected', { bubbles: true }
				));
			}
		}
		if (changedProperties.has('hidden') && changedProperties.get('hidden') !== undefined) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent(
				'd2l-tab-hidden-change', { bubbles: true }
			));
		}
	}

	/**
	 * IMPORTANT: Call this in any consumer when anything changes that could impact the tab's size
	 * Notifies the parent d2l-tabs component of a change so that it can update virtual scrolling calculations
	 * */
	dispatchContentChangeEvent() {
		this.dispatchEvent(new CustomEvent(
			'd2l-tab-content-change', { bubbles: true, composed: true }
		));
	}

	renderContent() {
		console.warn('Subclasses to implement/override renderContent');
		return html`<div>Default Tab Content</div>`;
	}

	#hasInitialized = false;

	#handleClick() {
		if (this.selected) return;

		this._clicked = true;
		const beforeSelectedEvent = new CustomEvent('d2l-tab-before-selected', {
			detail: {
				select: () => { this.selected = true; this._clicked = false; },
				reset: () => this._clicked = false
			},
			cancelable: true,
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(beforeSelectedEvent);
		if (beforeSelectedEvent.defaultPrevented) return;

		this.selected = true;
		this._clicked = false;
	};

	#handleKeydown(e) {
		if (e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.ENTER) {
			e.stopPropagation();
			e.preventDefault();
		}
	};

	#handleKeyup(e) {
		if (e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.ENTER) {
			this.#handleClick();
		}
	};

};
