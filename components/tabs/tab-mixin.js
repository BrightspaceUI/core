import '../colors/colors.js';
import { css, html } from 'lit';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

export const TabMixin = superclass => class extends SkeletonMixin(superclass) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: REQUIRED: A description to be added to the tab for accessibility when text on tab does not provide enough context
			 * @type {string}
			 */
			description: { type: String },
			selected: { type: Boolean, reflect: true },
			/**
			 * ACCESSIBILITY: REQUIRED: Accessible text for the button
			 * @type {string}
			 */
			text: { type: String }
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
				margin-inline-end: 0.6rem;
				margin-inline-start: 0;
				width: calc(100% - 0.6rem);
			}
			:host([aria-selected="true"]:focus) {
				text-decoration: none;
			}
			:host(:hover) {
				color: var(--d2l-color-celestine);
				cursor: pointer;
			}
			:host([aria-selected="true"]:hover) {
				color: inherit;
				cursor: default;
			}
			:host([aria-selected="true"]) .d2l-tab-selected-indicator {
				display: block;
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.ariaSelected = false;
		this.role = 'tab';
		this.selected = false;
		this.tabIndex = -1;
	}

	connectedCallback() {
		super.connectedCallback();
		this.#addEventHandlers();

		if (!this.#resizeObserver) {
			this.#resizeObserver = new ResizeObserver(() => {
				this.#handleResize();
			});
			this.#resizeObserver.observe(this);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#removeEventHandlers();

		if (this.#resizeObserver) {
			this.#resizeObserver.disconnect();
			this.#resizeObserver = null;
		}
	}

	render() {
		return html`
			<div class="d2l-skeletize">
				${this.renderContent()}
			</div>
			<div class="d2l-tab-selected-indicator d2l-skeletize-container"></div>
		`;
	}

	update(changedProperties) {
		super.update(changedProperties);
		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'selected') {
				this.ariaSelected = this.selected;
				if (this.selected === 'true') {
					this.dispatchEvent(new CustomEvent(
						'd2l-tab-selected', { bubbles: true, composed: true }
					));
				}
			}
		});
	}

	renderContent() {
		console.warn('Subclasses to implement/override renderContent');
		return html`<div>Default Tab Content</div>`;
	}

	#resizeObserver;

	#handleClick = () => {
		this.selected = true;
	};

	#handleKeydown = e => {
		if (e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.ENTER) {
			e.stopPropagation();
			e.preventDefault();
		}
	};

	#handleKeyup = e => {
		if (e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.ENTER) {
			this.#handleClick();
		}
	};

	#addEventHandlers() {
		this.addEventListener('click', this.#handleClick);
		this.addEventListener('keydown', this.#handleKeydown);
		this.addEventListener('keyup', this.#handleKeyup);
	}

	#handleResize() {
		this.dispatchEvent(new CustomEvent('d2l-tab-resize'));
	}

	#removeEventHandlers() {
		this.removeEventListener('click', this.#handleClick);
		this.removeEventListener('keydown', this.#handleKeydown);
		this.removeEventListener('keyup', this.#handleKeyup);
	}

};
