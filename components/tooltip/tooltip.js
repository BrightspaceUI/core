import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { isComposedAncestor } from '../../helpers/dom.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class Tooltip extends RtlMixin(LitElement) {

	static get properties() {
		return {
			for: { type: String },
			showing: { type: Boolean, reflect: true },
			openedAbove: { type: Boolean, reflect: true, attribute: 'opened-above' },
			openDir: { type: String, reflect: true, attribute: 'open-dir' },
			state: { type: String, reflect: true }, /* Valid values are: 'info' and 'error' */
			boundary: { type: Object },
			forceShow: { type: Boolean, attribute: 'force-show' },
			_viewportMargin: { type: Number },
			_maxWidth: { type: Number },
			_maxHeight: { type: Number },
			_targetRect: { type: Object },
			offset: { type: Number },
			_position: { type: Number },
			_opens: {type: Number },
			_focused: { type: Boolean },
			_clicked: { type: Boolean }
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

			:host([showing]),
			:host([force-show]) {
				display: inline-block;
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

			:host([open-dir="bottom"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-bottom-animation 200ms ease;
				animation: d2l-tooltip-bottom-animation 200ms ease;
			}

			:host([open-dir="top"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-top-animation 200ms ease;
				animation: d2l-tooltip-top-animation 200ms ease;
			}

			:host([open-dir="left"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-left-animation 200ms ease;
				animation: d2l-tooltip-left-animation 200ms ease;
			}

			:host([open-dir="right"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-right-animation 200ms ease;
				animation: d2l-tooltip-right-animation 200ms ease;
			}

			@keyframes d2l-tooltip-top-animation {
				0% { transform: translate(0,-10px); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@keyframes d2l-tooltip-bottom-animation {
				0% { transform: translate(0,10px); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@keyframes d2l-tooltip-left-animation {
				0% { transform: translate(-10px,0); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
			@keyframes d2l-tooltip-right-animation {
				0% { transform: translate(10px,0); opacity: 0; }
				100% { transform: translate(0,0); opacity: 1; }
			}
		`];
	}

	constructor() {
		super();
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this._onResize = this._onResize.bind(this);
		this._onAutoCloseClick = this._onAutoCloseClick.bind(this);
		this.offset = 20;
		this._viewportMargin = 12;
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

	get forceShow() {
		return this._forceShow;
	}
	set forceShow(val) {
		const oldVal = this._forceShow;
		if (oldVal !== val) {
			this._forceShow = val;
			this.requestUpdate('force-show', oldVal);
			this._openedChanged(val || this.showing);
		}
	}

	get showing() {
		return this.__showing;
	}

	set showing(val) {
		const oldVal = this.__showing;
		if (oldVal !== val) {
			this.__showing = val;
			this.requestUpdate('showing', oldVal);
			this._openedChanged(val || this.forceShow);
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
				<div class="d2l-tooltip-container">
					<div class="d2l-tooltip-position" style=${styleMap(tooltipPositionStyle)}>
						<div class="d2l-tooltip-content d2l-body-compact" style=${styleMap(contentStyle)}>
							<slot></slot>
						</div>
					</div>
					<div class="d2l-tooltip-pointer">
						<div></div>
					</div>
				</div>
			</div>`
		;
	}

	connectedCallback() {
		super.connectedCallback();
		document.body.addEventListener('click', this._onAutoCloseClick);
		window.addEventListener('resize', this._onResize);

		requestAnimationFrame(() => {
			this._targetChanged();
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.body.removeEventListener('click', this._onAutoCloseClick);
		window.removeEventListener('resize', this._onResize);
	}

	_targetChanged() {
		this._removeListeners();
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
		} else {
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}
		return target;
	}

	show() {
		this._opens += 1;
		this.showing = this._opens > 0;
	}

	hide() {
		this._opens = Math.max(this._opens - 1, 0);
		this.showing = this._opens > 0;
		if (!this.showing) {
			this._clicked = false;
		}
	}

	_forceClose() {
		this._opens = 0;
		this._clicked = false;
		this.showing = false;
	}

	_onResize() {
		if (!this.showing && !this.forceShow) {
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

			this._dismissibleId = setDismissible(() => {
				this._forceClose();
			});
		} else {
			if (this._dismissibleId) {
				clearDismissible(this._dismissibleId);
				this._dismissibleId = null;
			}
		}
	}

	async __position() {

		const target = this._target;
		if (!target && !this.customTarget) {
			return;
		}
		const tooltipTarget = this.__getTooltipTarget();
		if (!tooltipTarget) {
			return;
		}
		const targetRect =  target.getBoundingClientRect();
		const spaceAround = this._constrainSpaceAround({
			above: targetRect.top - this._viewportMargin,
			below: document.documentElement.clientHeight - (targetRect.top + targetRect.height) - this._viewportMargin,
			left: targetRect.left - this._viewportMargin,
			right: document.documentElement.clientWidth - (targetRect.left + targetRect.width) - this._viewportMargin
		});

		const verticalWidth = Math.max(spaceAround.left + targetRect.width + spaceAround.right, 1);
		const horizontalHeight = Math.max(spaceAround.above + targetRect.height + spaceAround.below, 1);

		const spaces = [
			{ dir: 'top', width: verticalWidth, height: Math.max(spaceAround.above - this.offset, 1) },
			{ dir: 'bottom', width: verticalWidth, height: Math.max(spaceAround.below - this.offset, 1) },
			{ dir: 'right', width: Math.max(spaceAround.right - this.offset, 1), height: horizontalHeight },
			{ dir: 'left', width: Math.max(spaceAround.left - this.offset, 1), height: horizontalHeight }
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
				y: this.openDir === 'top' ? top - this.offset : top + targetRect.height + this.offset,
				width: targetRect.width,
				height: 0,
			};
		} else {
			this._targetRect = {
				x: this.openDir === 'left' ? left - this.offset : left + targetRect.width + this.offset,
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

	_onAutoCloseClick(e) {
		if (this._clicked) {
			this._forceClose();
		} else {
			const rootTarget = e.composedPath()[0];
			if (this._target && isComposedAncestor(this._target, rootTarget)) {
				this.show();
				this._clicked = true;
			}
		}
	}

	_addListeners() {
		if (this._target) {
			this._target.addEventListener('mouseenter', this.show);
			this._target.addEventListener('mouseleave', this.hide);
			this._target.addEventListener('focus', this.show);
			this._target.addEventListener('blur', this.hide);
		}
	}

	_removeListeners() {
		if (this._target) {
			this._target.removeEventListener('mouseenter', this.show);
			this._target.removeEventListener('mouseleave', this.hide);
			this._target.removeEventListener('focus', this.show);
			this._target.removeEventListener('blur', this.hide);
		}
	}
}
customElements.define('d2l-tooltip', Tooltip);
