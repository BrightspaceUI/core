import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
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
			_y: { type: Number },
			_targetRect: { type: Object },
			_offsetVertical: { type: Number },
			_position: { type: Number }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				box-sizing: border-box;
				color: white;
				display: none;
				position: absolute;
				text-align: left;
				z-index: 1000; /* position on top of floating buttons */
			}

			:host([opened]) {
				display: inline-block;
			}

			.d2l-tooltip-target-position {
				display: inline-block;
				position: absolute;
			}

			.d2l-tooltip-pointer {
				clip: rect(-5px, 21px, 8px, -7px);
				display: inline-block;
				left: calc(50% - 7px);
				position: absolute;
				top: -7px;
				z-index: 1;
			}

			.d2l-tooltip-pointer > div {
				-webkit-transform: rotate(45deg);
				background-color: var(--d2l-color-ferrite);
				border-radius: 0.1rem;
				box-shadow: -4px -4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
				height: 16px;
				transform: rotate(45deg);
				width: 16px;
			}

			:host([opened-above]) .d2l-tooltip-pointer {
				bottom: -7px;
				clip: rect(9px, 21px, 22px, -3px);
				top: auto;
			}

			:host([opened-above]) .d2l-tooltip-pointer > div {
				box-shadow: 4px 4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
			}

			.d2l-tooltip-position {
				display: inline-block;
				position: absolute;
				width: 100vw;
			}

			.d2l-tooltip-content {
				background-color: var(--d2l-color-ferrite);
				border-radius: 0.3rem;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
				box-sizing: border-box;
				padding: 9px 15px;
				position: absolute;
			}

			:host([opened-above]) .d2l-tooltip-content {
				bottom: 100%;
			}
		`];
	}

	constructor() {
		super();
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this._onResize = this._onResize.bind(this);
		this._offsetVertical = 20;
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

		const targetPositionStyle = {};
		if (this._targetRect) {
			targetPositionStyle.left = `${this._targetRect.x}px`,
			targetPositionStyle.top = `${this._targetRect.y}px`,
			targetPositionStyle.width = `${this._targetRect.width}px`;
		}

		const tooltipPositionStyle = {};
		if (this._position) {
			tooltipPositionStyle.left = `${this._position}px`;
			tooltipPositionStyle.width = this._width ? `${this._width + 20}px` : '';
		}

		const contentStyle = {
			/* add 2 to content width since scrollWidth does not include border */
			width: this._width ? `${this._width + 20}px` : ''
		};

		return html`
			<div class="d2l-tooltip-target-position" style=${styleMap(targetPositionStyle)}>
				<div class="d2l-tooltip-position" style=${styleMap(tooltipPositionStyle)}>
					<div class="d2l-tooltip-content d2l-body-compact" style=${styleMap(contentStyle)}>
						<slot></slot>
					</div>
				</div>
				<div class="d2l-tooltip-pointer">
					<div></div>
				</div>
			</div>`
		;
	}

	connectedCallback() {
		super.connectedCallback();

		window.addEventListener('resize', this._onResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this._onResize);
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

	_onResize() {
		if (!this.opened) {
			return;
		}
		this.__position();
	}

	__getContentContainer() {
		return this.shadowRoot.querySelector('.d2l-tooltip-content');
	}

	__getTooltipTarget() {
		return this.shadowRoot.querySelector('.d2l-tooltip-target-position');
	}

	async _openedChanged(newValue) {
		if (newValue) {
			await this.updateComplete;
			await this.__position();
		}
	}

	async __position() {

		const target = this._target;
		if (!target) {
			return;
		}
		const tooltipTarget = this.__getTooltipTarget();
		if (!tooltipTarget) {
			return;
		}

		/* don't let dropdown content horizontally overflow viewport */
		this._width = null;
		await this.updateComplete;

		const content = this.__getContentContainer();
		this._width = this._getWidth(content.scrollWidth);
		await this.updateComplete;

		const targetRect = target.getBoundingClientRect();
		const tooltipRect = tooltipTarget.getBoundingClientRect();
		const contentRect = content.getBoundingClientRect();

		const top = targetRect.top - tooltipRect.top + tooltipTarget.offsetTop;
		const left = targetRect.left - tooltipRect.left + tooltipTarget.offsetLeft;

		const spaceAround = {
			above: targetRect.top - 50,
			below: window.innerHeight - targetRect.bottom - 80,
			left: targetRect.left - 20,
			right: document.documentElement.clientWidth - targetRect.right - 15
		};

		const spaceRequired = {
			height: contentRect.height + this._offsetVertical,
			width: contentRect.width
		};

		this.openedAbove = this._getOpenedAbove(spaceAround, spaceRequired);

		const centerDelta = contentRect.width - targetRect.width;
		const position = this._getPosition(spaceAround, centerDelta);
		if (position) {
			this._position = position;
		}

		this._targetRect = {
			x: left,
			y: this.openedAbove ? top - this._offsetVertical : top + targetRect.height + this._offsetVertical,
			width: targetRect.width
		};

	}

	_getWidth(scrollWidth) {
		let width = document.body.clientWidth - 40;
		if (width > scrollWidth) {
			width = scrollWidth;
		}
		return width;
	}

	_getPosition(spaceAround, centerDelta) {

		const contentXAdjustment = centerDelta / 2;
		if (centerDelta <= 0) {
			return contentXAdjustment * -1;
		}
		if (spaceAround.left > contentXAdjustment && spaceAround.right > contentXAdjustment) {
			// center with target
			return contentXAdjustment * -1;
		}
		const isRTL = this.getAttribute('dir') === 'rtl';
		if (!isRTL) {
			if (spaceAround.left < contentXAdjustment) {
				// slide content right (not enough space to center)
				return spaceAround.left * -1;
			} else if (spaceAround.right < contentXAdjustment) {
				// slide content left (not enough space to center)
				return (centerDelta * -1) + spaceAround.right;
			}
		} else {
			if (spaceAround.left < contentXAdjustment) {
				// slide content right (not enough space to center)
				return (centerDelta * -1) + spaceAround.left;
			} else if (spaceAround.right < contentXAdjustment) {
				// slide content left (not enough space to center)
				return spaceAround.right * -1;
			}
		}
		return null;
	}

	_getOpenedAbove(spaceAround, spaceRequired) {
		return (spaceAround.below < spaceRequired.height) && (
			(spaceAround.above > spaceRequired.height) ||
			(spaceAround.above > spaceAround.below)
		);
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
