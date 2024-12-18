import '../colors/colors.js';
import { css, html, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

export const TabMixin = superclass => class extends SkeletonMixin(superclass) {
	static get properties() {
		return {
			selected: { type: Boolean, reflect: true },
		};
	}

	static styles = css`
		:host {
			box-sizing: border-box;
			display: inline-block;
			max-width: 200px;
			outline: none;
			position: relative;
			vertical-align: middle;
		}
		.d2l-tab-text {
			margin: 0.5rem;
			overflow: hidden;
			padding: 0.1rem;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		:host(:first-child) .d2l-tab-text {
			margin-inline-end: 0.6rem;
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
			margin-inline-end: 0.6rem;
			margin-inline-start: 0;
			width: calc(100% - 0.6rem);
		}
		:host(:${unsafeCSS(getFocusPseudoClass())}) > .d2l-tab-text {
			border-radius: 0.3rem;
			box-shadow: 0 0 0 2px var(--d2l-color-celestine);
			color: var(--d2l-color-celestine);
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
    `;

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
		const overrideSkeletonText = this.skeleton && (!this.text || this.text.length === 0);
		const contentClasses = {
			'd2l-tab-text': true,
			'd2l-skeletize': true,
			'd2l-tab-text-skeletize-override': overrideSkeletonText
		};

		return html`
			<div class="${classMap(contentClasses)}">
				${this.renderContent}
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
			} else if (prop === 'text') {
				this.title = this.text;
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
