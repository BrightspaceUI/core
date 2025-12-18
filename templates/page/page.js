import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { d2lTemplateScrollStyles } from '../shared/scroll-styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

const isWindows = window.navigator.userAgent.indexOf('Windows') > -1;

/**
 * D2L page template with header and optional footer
 * @slot header - Page header content
 * @slot footer - Page footer content
 * @slot content - Main page content
 */
class TemplatePage extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			sticky: { type: Boolean, attribute: 'sticky', reflect: true },
			/**
			 * Whether content fills the screen or not
			 * @type {'fullscreen'|'normal'}
			 */
			widthType: { type: String, attribute: 'width-type', reflect: true },
			_hasFooter: { type: Boolean, attribute: false },
			_noScroll: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [d2lTemplateScrollStyles, css`
			:host {
				bottom: 0;
				left: 0;
				overflow: hidden;
				position: absolute;
				right: 0;
				top: 0;
			}

			:host([hidden]) {
				display: none;
			}
			:host([width-type="normal"]) .d2l-template-primary-secondary-content,
			:host([width-type="normal"]) .d2l-template-primary-secondary-footer {
				margin: 0 auto;
				max-width: 1230px;
				width: 100%;
			}
			.d2l-template-primary-secondary-container {
				height: 100%;
				overflow: auto;
				width: 100%;
			}
			:host([sticky]) .d2l-template-primary-secondary-container {
				display: flex;
				flex-direction: column;
			}
			:host([sticky]) .d2l-template-primary-secondary-container,
			.d2l-template-primary-secondary-container[data-no-scroll="true"] {
				overflow: unset;
			}
			:host([sticky]) .d2l-template-primary-secondary-content {
				flex-grow: 1;
				overflow: hidden;
			}

			footer {
				background-color: white;
				box-shadow: 0 -2px 4px rgba(32, 33, 34, 0.2); /* ferrite */
				padding: 0.75rem 1rem;
				z-index: 1; /* ensures the footer box-shadow is over main areas with background colours set */
			}
			header {
				z-index: 14; /* ensures the header box-shadow is over main areas with background colours set, and opt-in on top of sticky header */
			}
		`];
	}

	constructor() {
		super();

		this._noScroll = false;
		this.sticky = false;
		this.widthType = 'fullscreen';
	}

	connectedCallback() {
		super.connectedCallback();
		this._onMobileMenuOpen = () => {
			this._noScroll = true;
		};
		this.addEventListener('d2l-mobile-menu-open', this._onMobileMenuOpen);
		this._onMobileMenuClose = () => {
			this._noScroll = false;
		};
		this.addEventListener('d2l-mobile-menu-close', this._onMobileMenuClose);
	}

	disconnectedCallback() {
		this.removeEventListener('d2l-mobile-menu-open', this._onMobileMenuOpen);
		this.removeEventListener('d2l-mobile-menu-close', this._onMobileMenuClose);
		super.disconnectedCallback();
	}

	render() {
		const scrollClasses = {
			'd2l-template-scroll': isWindows,
			'd2l-template-primary-secondary-container': true
		};

		return html`
			<div class="${classMap(scrollClasses)}" data-no-scroll="${this._noScroll}">
				<header><slot name="header"></slot></header>
				<div class="d2l-template-primary-secondary-content">
					<slot name="content"></slot>
				</div>
				<footer ?hidden="${!this._hasFooter}">
					<div class="d2l-template-primary-secondary-footer"><slot name="footer" @slotchange="${this._handleFooterSlotChange}"></slot></div>
				</footer>
			</div>
		`;
	}

	_handleFooterSlotChange(e) {
		const nodes = e.target.assignedNodes();
		this._hasFooter = (nodes.length !== 0);
	}

}

customElements.define('d2l-template-page', TemplatePage);
