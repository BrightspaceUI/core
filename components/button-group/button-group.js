import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ButtonGroupMixin } from './button-group-mixin.js';
// import { buttonStyles } from './button-styles.js';
// import { ifDefined } from 'lit-html/directives/if-defined.js';
// import { labelStyles } from '../typography/styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';

/**
 *
 * A button group component that can be used to display a set of buttons 
 *
 * @slot - Buttons, dropdown buttons, links or other items to be added to the container
 */
class ButtonGroup extends ButtonGroupMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * minimum amount of buttons to show
			 */
			minToShow: {
				type: Number
			},
			/**
			 * maximum amount of buttons to show
			 */
			maxToShow: {
				type: Number
			}
		};
	}


	static get styles() {
		return [offscreenStyles,
			css`
			:host .d2l-button-group-container {
				display: flex;
				flex: 0 1 auto;
				flex-wrap: wrap;
			}

			:host .d2l-button-group-container ::slotted(d2l-button),
			:host .d2l-button-group-container ::slotted(d2l-button-subtle),
			:host .d2l-button-group-container ::slotted(d2l-button-icon),
			:host .d2l-button-group-container ::slotted(d2l-link),
			:host .d2l-button-group-container ::slotted(span),
			:host .d2l-button-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host .d2l-button-group-container ::slotted(d2l-dropdown-button),
			:host .d2l-button-group-container ::slotted(d2l-dropdown-button-subtle),
			:host .d2l-button-group-container ::slotted(.d2l-button-group-custom-item) {
				margin-right: 0.75rem;
			}

			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-button),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-button-subtle),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-button-icon),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-link),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(span),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-dropdown-button),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-dropdown-button-subtle),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(.d2l-button-group-custom-item) {
				margin-left: 0.75rem;
				margin-right: 0;
			}

			/* using !important to force override.  ex. consumer has explicitly
			specified display. note: inline styles, and shadow-dom with consumer specified
			css will override this unless !important is specified */
			:host .d2l-button-group-container ::slotted([chomped]) {
				display: none !important;
			}

			:host([mini]) .d2l-dropdown-opener {
				padding-left: 0.5rem;
				padding-right: 0.5rem;
			}
			.d2l-dropdown-opener-text {
				margin-right: 0.3rem;
				vertical-align: middle;
			}

			:host(:dir(rtl)) .d2l-dropdown-opener-text {
				margin-left: 0.3rem;
				margin-right: 0;
			}
			# todo: apply the d2l-offscreen class in mini mode so the text is hidden
			:host([mini]) .d2l-dropdown-opener-text {
				@apply --d2l-offscreen;
			}`
		];
	}

	constructor() {
		super();
		this._handleResize = this._handleResize.bind(this);

		this._overflowMenu = this.shadowRoot.querySelector('.d2l-overflow-dropdown');

	}

	connectedCallback() {
		super.connectedCallback();
		this._addEventListeners();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeEventListeners();
		window.removeEventListener('', this._handleMvcDialogOpen);
	}
	render() {
		return html`
			<div class="d2l-button-group-container">
				<slot id="buttons"></slot>
				<d2l-dropdown class="d2l-overflow-dropdown">
					<d2l-button class="d2l-dropdown-opener">
						<!-- todo: localize this text or provide it as a property -->
						<span class="d2l-dropdown-opener-text">More Actions</span>
						<!-- todo: determine if icon is used/provide it as prop -->
						<!-- <d2l-icon icon="[[icon]]"></d2l-icon> -->
					</d2l-button>
					<d2l-dropdown-menu render-content="">
						<!-- todo: localize this text or provide it as a property -->
						<d2l-menu id="overflowMenu" label="More Actions">
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown>
			</div>
		`;
	}

	_addEventListeners() {
		window.addEventListener('resize', this._handleResize);
	}

	_getItemLayout(item) {

		const layout = {
			width: item.offsetWidth
				+ parseInt(window.getComputedStyle(item).marginLeft.replace('px', ''))
				+ parseInt(window.getComputedStyle(item).marginRight.replace('px', ''))
		};
	}

	_getItems() {
		const items = Array.from(this.shadowRoot.childNodes);
		console.log(items);
		const filteredItems = items.filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
		});
		console.log(filteredItems);

		// return Array.prototype.filter.call(
		// 	dom(this).childNodes,
		// 	function(node) {
		// 		return node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
		// 	}
		// );
	}

	_getWidth() {
		const container = this.shadowRoot.querySelector('.d2l-button-group-container');
		const width = container.clientWidth;
		return width;
	}

	_handleResize() {
		const width = this._getWidth();
		console.log(`width: ${width}`);
	}
	_removeEventListeners() {
		window.removeEventListener('resize', this._handleResize);
	}
}

customElements.define('d2l-button-group', ButtonGroup);
