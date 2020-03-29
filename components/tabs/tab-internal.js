import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

class Tab extends RtlMixin(LitElement) {

	static get properties() {
		return {
			ariaSelected: { type: String, reflect: true, attribute: 'aria-selected' },
			controlsPanel: { type: String, reflect: true, attribute: 'controls-panel' },
			text: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: inline-block;
				max-width: 200px;
				outline: none;
				position: relative;
				vertical-align: middle;
			}
			.d2l-tab-text {
				margin: 0.6rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			:host(:first-child) .d2l-tab-text {
				margin-left: 0;
			}
			:host([dir="rtl"]:first-child) .d2l-tab-text {
				margin-left: 0.6rem;
				margin-right: 0;
			}
			.d2l-tab-selected-indicator {
				border-top: 4px solid var(--d2l-color-celestine);
				border-top-left-radius: 4px;
				border-top-right-radius: 4px;
				bottom: 0;
				display: none;
				margin: 1px 0.6rem 0 0.6rem;
				position: absolute;
				-webkit-transition: box-shadow 0.2s;
				transition: box-shadow 0.2s;
				width: calc(100% - 1.2rem);
			}
			:host(:first-child) .d2l-tab-selected-indicator {
				margin-left: 0;
				width: calc(100% - 0.6rem);
			}
			:host([dir="rtl"]:first-child) .d2l-tab-selected-indicator {
				margin-left: 0.6rem;
				margin-right: 0;
			}
			:host(:focus) {
				color: var(--d2l-color-celestine);
				text-decoration: underline;
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
			:host([aria-selected="true"]:focus) .d2l-tab-selected-indicator {
				border-top-color: var(--d2l-color-celestine);
				box-shadow: 0 0 0 1px #ffffff, 0 0 0 2px var(--d2l-color-celestine);
			}
		`;
	}

	constructor() {
		super();
		this.ariaSelected = 'false';
		this.role = 'tab';
		this.tabIndex = -1;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('click', () => {
			this.ariaSelected = 'true';
		});
		// perhaps this should be keyup?
		this.addEventListener('keydown', (e) => {
			if (e.keyCode !== keyCodes.ENTER && e.keyCode !== keyCodes.SPACE) return;
			e.stopPropagation();
			e.preventDefault();
			this.ariaSelected = 'true';
		});
	}

	render() {
		return html`
			<div class="d2l-tab-text">${this.text}</div>
			<div class="d2l-tab-selected-indicator"></div>
		`;
	}

	update(changedProperties) {
		super.update(changedProperties);
		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'ariaSelected' && this.ariaSelected === 'true') {
				this.dispatchEvent(new CustomEvent(
					'd2l-tab-selected', { bubbles: true, composed: true }
				));
			} else if (prop === 'text') {
				this.title = this.text;
			}
		});
	}

}

customElements.define('d2l-tab-internal', Tab);
