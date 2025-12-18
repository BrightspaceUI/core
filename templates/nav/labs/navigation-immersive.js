import '../../../components/colors/colors.js';
import './navigation.js';
import './navigation-link-back.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../../../components/typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getFlag } from '../../../helpers/flags.js';
import { navigationSharedStyle } from './navigation-shared-styles.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit/directives/style-map.js';

const mediaQueryList = window.matchMedia('(max-width: 615px)');
const immersiveNavTextSpacingFlag = getFlag('GAUD-8465-immersive-nav-text-spacing', true);

class NavigationImmersive extends LitElement {

	static get properties() {
		return {
			allowOverflow: {
				attribute: 'allow-overflow',
				type: Boolean,
				reflect: true
			},
			backLinkHref: {
				attribute: 'back-link-href',
				type: String
			},
			backLinkText: {
				attribute: 'back-link-text',
				type: String
			},
			backLinkTextShort: {
				attribute: 'back-link-text-short',
				type: String
			},
			widthType: {
				attribute: 'width-type',
				type: String,
				reflect: true
			},
			_dynamicSpacingHeight: { state: true },
			_spacingUseHeightVar: { attribute: '_spacing-use-height-var', type: Boolean, reflect: true },
			_middleHidden: { state: true },
			_middleNoRightBorder: { state: true },
			_smallWidth: { state: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, navigationSharedStyle, css`
			:host {
				--d2l-labs-navigation-immersive-height-main: 3.1rem;
				--d2l-labs-navigation-immersive-height-responsive: 2.8rem;
			}
			.d2l-navigiation-immersive-fixed {
				background-color: white;
				left: 0;
				position: fixed;
				right: 0;
				top: 0;
				z-index: 2; /* higher than skeletons which could scroll behind immersive nav */
			}
			d2l-labs-navigation {
				border-bottom: 1px solid var(--d2l-color-mica);
			}
			.d2l-labs-navigation-immersive-margin {
				display: flex;
				justify-content: center;
				margin: 0 30px;
			}

			.d2l-labs-navigation-immersive-container {
				display: flex;
				height: var(--d2l-labs-navigation-immersive-height-main);
				justify-content: space-between;
				margin: 0 -7px;
				max-width: 100%;
				overflow: hidden;
				width: 100%;
			}

			:host([width-type="normal"]) .d2l-labs-navigation-immersive-container {
				max-width: 1230px;
			}

			:host([allow-overflow]) .d2l-labs-navigation-immersive-container {
				overflow: visible;
			}

			.d2l-labs-navigation-immersive-left ::slotted(*),
			.d2l-labs-navigation-immersive-middle ::slotted(*),
			.d2l-labs-navigation-immersive-right ::slotted(*) {
				height: var(--d2l-labs-navigation-immersive-height-main);
			}

			.d2l-labs-navigation-immersive-left {
				color: var(--d2l-color-tungsten);
				letter-spacing: 0.2px;
				padding-left: 7px;
			}

			.d2l-labs-navigation-immersive-right {
				padding-right: 7px;
			}

			.d2l-labs-navigation-immersive-left,
			.d2l-labs-navigation-immersive-right {
				flex: 0 0 auto;
			}

			.d2l-labs-navigation-immersive-middle {
				border-inline-end: 1px solid var(--d2l-color-gypsum);
				border-inline-start: 1px solid var(--d2l-color-gypsum);
				flex: 0 1 auto;
				margin: 0 24px;
				min-width: 0;
				padding: 0 24px;
				width: 100%;
			}

			.d2l-labs-navigation-immersive-middle.d2l-labs-navigation-immersive-middle-no-right-border {
				border-inline-end: none;
			}

			div.d2l-labs-navigation-immersive-middle-observer,
			div.d2l-labs-navigation-immersive-right-observer {
				height: auto;
			}

			.d2l-labs-navigation-immersive-middle-hidden {
				visibility: hidden;
			}

			.d2l-labs-navigation-immersive-spacing {
				position: unset;
			}

			:host([_spacing-use-height-var]) .d2l-labs-navigation-immersive-spacing {
				height: calc(var(--d2l-labs-navigation-immersive-height-main) + 5px);
			}

			@media (max-width: 929px) {
				.d2l-labs-navigation-immersive-margin {
					margin: 0 24px;
				}
			}

			@media (max-width: 767px) {
				.d2l-labs-navigation-immersive-margin {
					margin: 0 18px;
				}
			}

			@media (max-width: 615px) {
				.d2l-labs-navigation-immersive-container {
					height: var(--d2l-labs-navigation-immersive-height-responsive);
				}
				.d2l-labs-navigation-immersive-left ::slotted(*),
				.d2l-labs-navigation-immersive-middle ::slotted(*),
				.d2l-labs-navigation-immersive-right ::slotted(*) {
					height: var(--d2l-labs-navigation-immersive-height-responsive);
				}
				.d2l-labs-navigation-immersive-spacing {
					height: calc(var(--d2l-labs-navigation-immersive-height-responsive) + 5px);
				}
				.d2l-labs-navigation-immersive-middle {
					margin: 0 18px;
					padding: 0 18px;
				}
			}
		`];
	}

	constructor() {
		super();
		this._handlePageResize = this._handlePageResize.bind(this);
		this._middleHidden = false;
		this._middleNoRightBorder = true;
		this._middleObserver = new ResizeObserver(this._onMiddleResize.bind(this));
		this._rightObserver = new ResizeObserver(this._onRightResize.bind(this));
		this._spacingUseHeightVar = !immersiveNavTextSpacingFlag;

		// Only create navigation observer if feature flag is enabled
		if (immersiveNavTextSpacingFlag) {
			this._navigationObserver = new ResizeObserver(this._onNavigationResize.bind(this));
		}

		this._smallWidth = false;
		this._dynamicSpacingHeight = undefined;
	}

	connectedCallback() {
		super.connectedCallback();
		this._startObserving();
		if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', this._handlePageResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._middleObserver?.disconnect();
		this._rightObserver?.disconnect();
		this._navigationObserver?.disconnect();
		mediaQueryList.removeEventListener?.('change', this._handlePageResize);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._startObserving();
		this._smallWidth = mediaQueryList.matches;
	}

	render() {
		const middleContainerClasses = {
			'd2l-labs-navigation-immersive-middle': true,
			'd2l-labs-navigation-immersive-middle-hidden': this._middleHidden,
			'd2l-labs-navigation-immersive-middle-no-right-border': this._middleNoRightBorder
		};
		const backLinkText = this._smallWidth ? (this.backLinkTextShort || this.backLinkText) : this.backLinkText;
		const spacingStyles = { height: (this._dynamicSpacingHeight ? `${this._dynamicSpacingHeight}px` : undefined) };
		return html`
			<div class="d2l-navigiation-immersive-fixed">
				<d2l-labs-navigation>
					<div class="d2l-labs-navigation-immersive-margin">
						<div class="d2l-labs-navigation-immersive-container">
							<div class="d2l-labs-navigation-immersive-left d2l-body-compact">
								<slot name="left">
									<d2l-labs-navigation-link-back text="${backLinkText}" href="${this.backLinkHref}" @click="${this._handleBackClick}"></d2l-labs-navigation-link-back>
								</slot>
							</div>
							<div class="${classMap(middleContainerClasses)}">
								<div class="d2l-labs-navigation-immersive-middle-observer">
									<slot name="middle"></slot>
								</div>
							</div>
							<div class="d2l-labs-navigation-immersive-right"><div class="d2l-labs-navigation-immersive-right-observer"><slot name="right"></slot></div></div>
						</div>
					</div>
				</d2l-labs-navigation>
			</div>
			<div class="d2l-labs-navigation-immersive-spacing" style="${styleMap(spacingStyles)}"></div>
		`;
	}

	_handleBackClick() {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-labs-navigation-immersive-back-click',
				{ bubbles: false, composed: false }
			)
		);
	}

	_handlePageResize(e) {
		this._smallWidth = e.matches;
	}

	_onMiddleResize(entries) {
		if (!entries || entries.length === 0) {
			return;
		}
		this._middleHidden = (entries[0].contentRect.height < 1);
	}

	_onNavigationResize(entries) {
		if (!entries || entries.length === 0) {
			return;
		}

		const newHeight = entries[0].contentRect.height;
		if (!newHeight) return;

		this._dynamicSpacingHeight = newHeight;
	}

	_onRightResize(entries) {
		if (!entries || entries.length === 0) {
			return;
		}
		this._middleNoRightBorder = (entries[0].contentRect.height < 1);
	}

	_startObserving() {
		const middle = this.shadowRoot?.querySelector('.d2l-labs-navigation-immersive-middle-observer');
		if (middle) {
			this._middleObserver.observe(middle);
		}
		const right = this.shadowRoot?.querySelector('.d2l-labs-navigation-immersive-right-observer');
		if (right) {
			this._rightObserver.observe(right);
		}

		if (this._navigationObserver) {
			// does not need to be nested within if statement after GAUD-8465-immersive-nav-text-spacing is cleaned up
			const navigation = this.shadowRoot?.querySelector('.d2l-navigiation-immersive-fixed');
			if (navigation) {
				this._navigationObserver.observe(navigation);
			}
		}
	}

}
customElements.define('d2l-labs-navigation-immersive', NavigationImmersive);
