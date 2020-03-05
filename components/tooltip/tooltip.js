import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class Tooltip extends RtlMixin(LitElement) {

	static get properties() {
		return {
			for: { type: String },
			opened: { type: Boolean, reflect: true },
			openedAbove: { type: Boolean, reflect: true, attribute: 'opened-above' },
			openDir: { type: String, reflect: true, attribute: 'open-dir' },
			state: { type: String, reflect: true }, /* Valid values are: 'info' and 'error' */
			_maxWidth: { type: Number },
			_maxHeight: { type: Number },
			_targetRect: { type: Object },
			_offsetVertical: { type: Number },
			_position: { type: Number },
			_opens: {type: Number }
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
				opacity: 0;
			}

			.d2l-tooltip-pointer > div,
			.d2l-tooltip-content {
				background-color: var(--d2l-color-ferrite);
			}

			:host([state="error"]) .d2l-tooltip-pointer > div,
			:host([state="error"]) .d2l-tooltip-content {
				background-color: var(--d2l-color-cinnabar);
			}

			:host([dir="rtl"]) {
				text-align: right;
			}

			:host([opened]) {
				display: inline-block;
				opacity: 1;
			}

			.d2l-tooltip-target-position {
				display: inline-block;
				position: absolute;
			}

			.d2l-tooltip-pointer {
				display: inline-block;
				position: absolute;
				z-index: 1;
			}

			:host([open-dir="top"]) .d2l-tooltip-pointer,
			:host([open-dir="bottom"]) .d2l-tooltip-pointer {
				left: calc(50% - 7px);
			}

			:host([open-dir="top"]) .d2l-tooltip-pointer {
				clip: rect(9px, 21px, 22px, -3px);
				bottom: -7px;
			}

			:host([open-dir="bottom"]) .d2l-tooltip-pointer {
				clip: rect(-5px, 21px, 8px, -7px);
				top: -7px;
			}

			:host([open-dir="left"]) .d2l-tooltip-pointer,
			:host([open-dir="right"]) .d2l-tooltip-pointer {
				top: calc(50% - 7px);
			}

			:host([open-dir="left"]) .d2l-tooltip-pointer {
				clip: rect(-3px, 21px, 21px, 9px);
				right: -7px;
			}

			:host([open-dir="right"]) .d2l-tooltip-pointer {
				clip: rect(-3px, 9px, 21px, -3px);
				left: -7px;
			}

			.d2l-tooltip-pointer > div {
				-webkit-transform: rotate(45deg);
				border-radius: 0.1rem;
				box-shadow: -4px -4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
				height: 16px;
				transform: rotate(45deg);
				width: 16px;
			}

			:host([open-dir="top"]) .d2l-tooltip-pointer > div {
				box-shadow: 4px 4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
			}

			.d2l-tooltip-position {
				display: inline-block;
				position: absolute;
				width: 100vw;
				height: 100vh;
								overflow: hidden;
			}

			.d2l-tooltip-content {
				border-radius: 0.3rem;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
				box-sizing: border-box;
				padding: 9px 15px;
				position: absolute;
				overflow: hidden;
			}

			:host([open-dir="top"]) .d2l-tooltip-position {
				bottom: 100%;
			}

			:host([open-dir="left"]) .d2l-tooltip-position {
				right: 100%;
			}
		`];
	}

	constructor() {
		super();
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this._onResize = this._onResize.bind(this);
		this._offsetVertical = 20;
		this._opens = 0;
		this.state = 'info';
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
			targetPositionStyle.height = `${this._targetRect.height}px`;
		}

		const tooltipPositionStyle = {
			maxWidth: this._maxWidth ? `${this._maxWidth}px` : '',
			maxHeight: this._maxHeight ? `${this._maxHeight}px` : ''
		};
		if (this._position) {
			if (this._isVerticalOpen()) {
				tooltipPositionStyle.left = `${this._position}px`;
			} else {
				tooltipPositionStyle.top = `${this._position}px`;
			}
		}

		const contentStyle = {
			/* add 2 to content width since scrollWidth does not include border */
			maxWidth: this._maxWidth ? `${this._maxWidth}px` : '',
			maxHeight: this._maxHeight ? `${this._maxHeight}px` : ''
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
		this._opens -= 1;
		this.opened = this._opens > 0;
	}

	open() {
		this._opens += 1;
		this.opened = this._opens > 0;
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

		const targetRect = target.getBoundingClientRect();
		const spaceAround = {
			above: targetRect.top - 12,
			below: document.documentElement.clientHeight - targetRect.bottom - 12,
			left: targetRect.left - 12,
			right: document.documentElement.clientWidth - targetRect.right - 12
		};

		const verticalWidth = Math.max(spaceAround.left + targetRect.width + spaceAround.right, 1);
		const horizontalHeight = Math.max(spaceAround.above + targetRect.height + spaceAround.below, 1);

		const spaces = [
			{ dir: 'top', width: verticalWidth, height: Math.max(spaceAround.above - this._offsetVertical, 1) },
			{ dir: 'bottom', width: verticalWidth, height: Math.max(spaceAround.below - this._offsetVertical, 1) },
			{ dir: 'right', width: Math.max(spaceAround.right - this._offsetVertical, 1), height: horizontalHeight },
			{ dir: 'left', width: Math.max(spaceAround.left - this._offsetVertical, 1), height: horizontalHeight }
		];
		let space = null;
		const content = this.__getContentContainer();
		for (let i = 0; i < spaces.length; ++i) {
			if (await this._canFitSpace(content, spaces[i])) {
				space = spaces[i];
				break;
			}
		}
		if (space === null) {
			space = spaces[0];
			console.log('NO SPACES FIT');
		}

		const contentRect = content.getBoundingClientRect();

		this._maxWidth = contentRect.width;
		this._maxHeight = contentRect.height;
		this.openDir = space.dir;
		await this.updateComplete;

		const tooltipRect = tooltipTarget.getBoundingClientRect();

		let position;
		if (this._isVerticalOpen()) {
			const centerDelta = contentRect.width - targetRect.width;
			position = this._getPosition(spaceAround, centerDelta);
		} else {
			const centerDelta = contentRect.height - targetRect.height;
			position = this._getPositionHorizontal(spaceAround, centerDelta);
		}
		if (position !== null) {
			this._position = position;
		}

		const top = targetRect.top - tooltipRect.top + tooltipTarget.offsetTop;
		const left = targetRect.left - tooltipRect.left + tooltipTarget.offsetLeft;

		if (this._isVerticalOpen()) {
			this._targetRect = {
				x: left,
				y: this.openDir === 'top' ? top - this._offsetVertical : top + targetRect.height + this._offsetVertical,
				width: targetRect.width,
				height: 0,
			};
		} else {
			this._targetRect = {
				x: this.openDir === 'left' ? left - this._offsetVertical : left + targetRect.width + this._offsetVertical,
				y: top,
				height: targetRect.height,
				width: 0,
			};
		}

	}

	async _canFitSpace(content, space) {

		this._maxWidth = space.width;
		this._maxHeight = space.height;
		await this.updateComplete;
		return content.scrollWidth <= this._maxWidth && content.scrollHeight <= this._maxHeight;
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

	_getPositionHorizontal(spaceAround, centerDelta) {

		const contentXAdjustment = centerDelta / 2;
		if (centerDelta <= 0) {
			// target height is larger than content height
			return contentXAdjustment * -1;
		}
		if (spaceAround.above >= contentXAdjustment && spaceAround.below >= contentXAdjustment) {
			// center with target
			return contentXAdjustment * -1;
		}
		if (spaceAround.above < contentXAdjustment) {
			// slide content right (not enough space to center)
			return spaceAround.above * -1;
		} else if (spaceAround.below < contentXAdjustment) {
			// slide content left (not enough space to center)
			return (centerDelta * -1) + spaceAround.below;
		}
		return null;
	}

	_isVerticalOpen() {
		return this.openDir === 'bottom' || this.openDir === 'top';
	}

	_addListeners() {
		if (this._target) {
			this._target.addEventListener('mouseenter', this.open);
			this._target.addEventListener('mouseleave', this.close);
			this._target.addEventListener('focus', this.open);
			this._target.addEventListener('blur', this.close);
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
