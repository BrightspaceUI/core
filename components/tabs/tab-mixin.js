import '../colors/colors.js';
import { css, html, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

export const TabMixin = superclass => class extends superclass {

	static get properties() {
		return {
			selected: { type: Boolean, reflect: true },
			tabIndex: { type: Number },
		};
	};

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
            margin-left: 0;
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
			margin-left: 0;
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
		this.role = 'tab';
		this.selected = false;
		this.tabIndex = -1;

		this._handleResize = this._handleResize.bind(this);
		this._resizeObserver = null;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', this._handleClick);
		this.addEventListener('keydown', this._handleKeydown);
		this.addEventListener('keyup', this._handleKeyup);

		this.resizeObserver = new ResizeObserver(() => {
			this.dispatchEvent(new CustomEvent('d2l-tab-resize', { bubbles: true, composed: true }));
		});
		this.resizeObserver.observe(this);
	}

	disconnectedCallback() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
		removeEventListener('click', this._handleClick);
		removeEventListener('keydown', this._handleKeydown);
		removeEventListener('keyup', this._handleKeyup);
		super.disconnectedCallback();
	}

	render() {
		const contentClasses = {
			'd2l-tab-text': true,
		};

		return html`
			<div
				class="${classMap(contentClasses)}"
				aria-selected="${this.selected}"
				role="tab"
				tabindex=${this.tabIndex}>
				${this.renderContent}
			</div>
			<div class="d2l-tab-selected-indicator"></div>
		`;
	}

	update(changedProperties) {
		super.update(changedProperties);
		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'selected' && this.selected === 'true') {
				this.dispatchEvent(new CustomEvent(
					'd2l-tab-selected', { bubbles: true, composed: true }
				));
			} else if (prop === 'text') {
				this.title = this.text;
			}
		});
	}

	renderContent() {
		console.warn('Subclasses to implement/override renderContent');
		return html`<div>Default Tab Content</div>`;
	}

	_handleClick() {
		this.selected = true;
	}

	_handleKeydown(e) {
		if (e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.ENTER) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	_handleKeyup(e) {
		if (e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.ENTER) {
			this._handleClick();
		}
	}

};
