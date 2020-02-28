import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class Tooltip extends LitElement {

	static get properties() {
		return {
			for: { type: String },
			opened: { type: Boolean, reflect: true },
			openedAbove: { type: Boolean, reflect: true, attribute: 'opened-above' },
			_maxHeight: { type: Number },
			_width: { type: Number },
			_x: { type: Number },
			_y: { type: Number }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				color: var(--d2l-color-ferrite);
				display: none;
				left: 0;
				position: absolute;
				text-align: left;
				top: calc(100% + var(--d2l-dropdown-verticaloffset, 20px));
				width: 100%;
				z-index: 1000; /* position on top of floating buttons */
			}

			:host([opened]) {
				display: inline-block;
			}

			:host([opened]) {
				-webkit-animation: d2l-dropdown-animation 300ms ease;
				animation: d2l-dropdown-animation 300ms ease;
			}

			:host([opened-above]) {
				-webkit-animation: d2l-dropdown-above-animation 300ms ease;
				animation: d2l-dropdown-above-animation 300ms ease;
			}

			.d2l-dropdown-content-pointer {
				position: absolute;
				display: inline-block;
				clip: rect(-5px, 21px, 8px, -7px);
				top: -7px;
				z-index: 1;
			}

			.d2l-dropdown-content-pointer > div {
				background-color: #ffffff;
				border: 1px solid var(--d2l-color-mica);
				border-radius: 0.1rem;
				box-shadow: -4px -4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
				height: 16px;
				width: 16px;
				transform: rotate(45deg);
				-webkit-transform: rotate(45deg);
			}

			:host([opened-above]) .d2l-dropdown-content-pointer {
				top: auto;
				clip: rect(9px, 21px, 22px, -3px);
				bottom: -8px;
			}

			:host([opened-above]) .d2l-dropdown-content-pointer > div {
				box-shadow: 4px 4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
			}

			:host([no-pointer]) .d2l-dropdown-content-pointer {
				display: none;
			}

			.d2l-dropdown-content-position {
				border-radius: 0.3rem;
				display: inline-block;
				position: absolute;
			}

			.d2l-dropdown-content-width {
				background-color: #ffffff;
				border: 1px solid var(--d2l-color-mica);
				border-radius: 0.3rem;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
				box-sizing: border-box;
				min-width: 70px;
				max-width: 370px;
				position: absolute;
				width: 100vw;
			}

			.d2l-dropdown-content-container {
				box-sizing: border-box;
				display: inline-block;
				max-width: 100%;
				outline: none;
				padding: 1rem;
				vertical-align: top; /* prevents baseline bloat - fix for github issue #173 */
			}

			.d2l-dropdown-content-top,
			.d2l-dropdown-content-bottom {
				min-height: 5px;
				position: relative;
				z-index: 2;
			}

			.d2l-dropdown-content-header {
				border-bottom: 1px solid var(--d2l-color-mica);
				padding: 1rem;
			}

			.d2l-dropdown-content-footer {
				border-top: 1px solid var(--d2l-color-mica);
				padding: 1rem;
			}

			:host([no-padding]) .d2l-dropdown-content-container,
			:host([no-padding-header]) .d2l-dropdown-content-header,
			:host([no-padding-footer]) .d2l-dropdown-content-footer {
				padding: 0;
			}

			.d2l-dropdown-content-top {
				border-top-left-radius: 0.3rem;
				border-top-right-radius: 0.3rem;
			}

			.d2l-dropdown-content-bottom {
				border-bottom-left-radius: 0.3rem;
				border-bottom-right-radius: 0.3rem;
			}

			.d2l-dropdown-content-top-scroll {
				box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.05);
			}

			.d2l-dropdown-content-bottom-scroll {
				box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.05);
			}

			:host([dir="rtl"]) {
				left: auto;
				right: 0;
				text-align: right;
			}

			@keyframes d2l-dropdown-animation {
				0% { transform: translate(0,-10px); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@keyframes d2l-dropdown-above-animation {
				0% { transform: translate(0,10px); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@-webkit-keyframes d2l-dropdown-animation {
				0% { -webkit-transform: translate(0,-10px); opacity: 0; }
				100% { -webkit-transform: translate(0,0); opacity: 1; }
			}
			@-webkit-keyframes d2l-dropdown-above-animation {
				0% { -webkit-transform: translate(0,10px); opacity: 0; }
				100% { -webkit-transform: translate(0,0); opacity: 1; }
			}
		`;
	}

	constructor() {
		super();
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
	}

	get for() {
		return this._for;
	}
	set for(val) {
		const oldVal = this._for;
		if (oldVal !== val) {
			this._for = val;
			this.requestUpdate('for', oldVal);
			this._targetChanged();
		}
	}

	get opened() {
		return this.__opened;
	}

	set opened(val) {
		const oldVal = this.__opened;
		if (oldVal !== val) {
			this.__opened = val;
			this.requestUpdate('opened', oldVal);
			this._openedChanged(val);
		}
	}

	render() {

		const widthStyle = {
			/* add 2 to content width since scrollWidth does not include border */
			width: this._width ? `${this._width + 20}px` : ''
		};

		const containerStyle = {
			/* set width of content in addition to width container so IE will render scroll inside border */
			width: this._width ? `${this._width + 18}px` : '',
		};

		const positionStyle = {
			left: `${this._x}px`
		};
		if (this.openedAbove) {
			positionStyle.bottom = `${this._y}px`;
		} else {
			positionStyle.top = `${this._y}px`;
		}

		return html`
			<div class="d2l-dropdown-content-position" style=${styleMap(positionStyle)}>
				<div class="d2l-dropdown-content-width" style=${styleMap(widthStyle)}>
					<div class="d2l-dropdown-content-container" style=${styleMap(containerStyle)}>
						<slot></slot>
					</div>
				</div>
			</div>
			<div class="d2l-dropdown-content-pointer">
				<div></div>
			</div>`;
	}

	_targetChanged() {
		const target = this._findTarget();
		if (target) {
			this.id = this.id || getUniqueId();
			target.setAttribute('aria-describedby', this.id);
		}
		this._target = target;
		this._addListeners();
	}

	_findTarget() {
		const parentNode = this.parentNode;
		const ownerRoot = this.getRootNode();

		let target;
		if (this._for) {
			const targetSelector = `#${this.for}`;
			target = ownerRoot.querySelector(targetSelector);
			target = target || (ownerRoot && ownerRoot.host && ownerRoot.host.querySelector(targetSelector));
		} else if (this.customTarget !== undefined) {
			// Set to undefined because it is not used - target is a DOM node, whereas customTarget is an object
			target = undefined;
		} else {
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}
		return target;
	}

	close() {
		// this.opened = false;
	}

	open() {
		this.opened = true;
	}

	__getContentContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-container');
	}

	__getPositionContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-position');
	}

	__getWidthContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-width');
	}

	async _openedChanged(newValue) {
		if (newValue) {
			const content = this.__getContentContainer();
			content.scrollTop = 0;
			await this.__position();
		}
	}

	async __position() {

		const target = this._target;
		if (!target) {
			return;
		}

		const content = this.__getContentContainer();
		const container = this.__getWidthContainer();

		/* don't let dropdown content horizontally overflow viewport */
		this._width = null;
		await this.updateComplete;

		this._width = this._getWidth(content.scrollWidth);
		console.log(content.scrollWidth);
		await this.updateComplete;

		const targetRect = target.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();

		const spaceAround = this._constrainSpaceAround({
			above: targetRect.top - 50,
			below: window.innerHeight - targetRect.bottom - 80,
			left: targetRect.left - 20,
			right: document.documentElement.clientWidth - targetRect.right - 15
		});

		const spaceRequired = {
			height: containerRect.height,
			width: containerRect.width
		};

		console.log(targetRect);
		console.log(containerRect);
		// this._x = targetRect.x - contentRect.x;
		this._y = (targetRect.y - containerRect.y);// + (targetRect.height / 2) + 5;

		// this._y = targetRect.y - containerRect.height;
		// top of the target is 169
		// -

		// console.log(this._x);
		console.log(this._y);

		this.openedAbove = this._getOpenedAbove(spaceAround, spaceRequired);

		if (this.openedAbove) {
			this._y = (containerRect.y - targetRect.y + containerRect.height);
		} else {
			this._y = (targetRect.y - containerRect.y);
		}
	}

	_getWidth(scrollWidth) {
		let width = window.innerWidth - 40;
		if (width > scrollWidth) {
			width = scrollWidth;
		}
		return width;
	}

	_getOpenedAbove(spaceAround, spaceRequired) {
		return (spaceAround.below < spaceRequired.height) && (
			(spaceAround.above > spaceRequired.height) ||
			(spaceAround.above > spaceAround.below)
		);
	}

	_constrainSpaceAround(spaceAround) {
		const constrained = { ...spaceAround };
		if (this.boundary) {
			constrained.above = this.boundary.above >= 0 ? Math.min(spaceAround.above, this.boundary.above) : spaceAround.above;
			constrained.below = this.boundary.below >= 0 ? Math.min(spaceAround.below, this.boundary.below) : spaceAround.below;
			constrained.left = this.boundary.left >= 0 ? Math.min(spaceAround.left, this.boundary.left) : spaceAround.left;
			constrained.right = this.boundary.right >= 0 ? Math.min(spaceAround.right, this.boundary.right) : spaceAround.right;
		}
		return constrained;
	}

	_addListeners() {
		if (this._target) {
			this._target.addEventListener('mouseenter', this.open);
			this._target.addEventListener('mouseleave', this.close);
		}
	}

	_removeListeners() {
		if (this._target) {
			this._target.removeEventListener('mouseenter', this.open);
			this._target.removeEventListener('mouseleave', this.close);
		}
	}
}
customElements.define('d2l-tooltip', Tooltip);
