import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class Tooltip extends RtlMixin(LitElement) {

	static get properties() {
		return {
			boundary: { type: Object },
			delay: { type: Number },
			disableFocusLock: { type: Boolean, attribute: 'disable-focus-lock' },
			for: { type: String },
			forceShow: { type: Boolean, attribute: 'force-show' },
			offset: { type: Number }, /* tooltipOffset */
			position: { type: String }, /* Deprecated, use boundary instead. Valid values are: 'top', 'bottom', 'left' and 'right' */
			showing: { type: Boolean, reflect: true, attribute: 'showing' },
			state: { type: String, reflect: true }, /* Valid values are: 'info' and 'error' */
			_maxHeight: { type: Number },
			_maxWidth: { type: Number },
			_openDir: { type: String, reflect: true, attribute: '_open-dir' },
			_targetRect: { type: Object },
			_tooltipShift: { type: Number },
			_viewportMargin: { type: Number }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				--d2l-tooltip-background-color: var(--d2l-color-ferrite); /* Deprecated, use state attribute instead */
				box-sizing: border-box;
				color: white;
				display: none;
				position: absolute;
				text-align: left;
				white-space: normal;
				z-index: 1000; /* position on top of floating buttons */
			}

			:host([state="error"]) {
				--d2l-tooltip-background-color: var(--d2l-color-cinnabar);
			}

			:host([dir="rtl"]) {
				text-align: right;
			}

			:host([showing]) {
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

			:host([_open-dir="top"]) .d2l-tooltip-pointer,
			:host([_open-dir="bottom"]) .d2l-tooltip-pointer {
				left: calc(50% - 7px);
			}

			:host([_open-dir="top"]) .d2l-tooltip-pointer {
				clip: rect(9px, 21px, 22px, -3px);
				bottom: -7px;
			}

			:host([_open-dir="bottom"]) .d2l-tooltip-pointer {
				clip: rect(-5px, 21px, 8px, -7px);
				top: -7px;
			}

			:host([_open-dir="left"]) .d2l-tooltip-pointer,
			:host([_open-dir="right"]) .d2l-tooltip-pointer {
				top: calc(50% - 7px);
			}

			:host([_open-dir="left"]) .d2l-tooltip-pointer {
				clip: rect(-3px, 21px, 21px, 9px);
				right: -7px;
			}

			:host([_open-dir="right"]) .d2l-tooltip-pointer {
				clip: rect(-3px, 9px, 21px, -3px);
				left: -7px;
			}

			.d2l-tooltip-pointer > div {
				-webkit-transform: rotate(45deg);
				background-color: var(--d2l-tooltip-background-color);
				border-radius: 0.1rem;
				box-shadow: -4px -4px 12px -5px rgba(73, 76, 78, .2); /* ferrite */
				height: 16px;
				transform: rotate(45deg);
				width: 16px;
			}

			:host([_open-dir="top"]) .d2l-tooltip-pointer > div {
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
				background-color: var(--d2l-tooltip-background-color);
				border-radius: 0.3rem;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
				box-sizing: border-box;
				padding: 9px 15px;
				position: absolute;
				overflow: hidden;
			}

			:host([_open-dir="top"]) .d2l-tooltip-position {
				bottom: 100%;
			}

			:host([_open-dir="left"]) .d2l-tooltip-position {
				right: 100%;
			}
			:host([dir="rtl"][_open-dir="right"]) .d2l-tooltip-position {
				left: 100%;
			}

			.d2l-tooltip-container {
				height: 100%;
				width: 100%;
			}

			:host([_open-dir="bottom"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-bottom-animation 200ms ease;
				animation: d2l-tooltip-bottom-animation 200ms ease;
			}

			:host([_open-dir="top"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-top-animation 200ms ease;
				animation: d2l-tooltip-top-animation 200ms ease;
			}

			:host([_open-dir="left"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-left-animation 200ms ease;
				animation: d2l-tooltip-left-animation 200ms ease;
			}

			:host([_open-dir="right"]) .d2l-tooltip-container {
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

		this._onMouseEnter = this._onMouseEnter.bind(this);
		this._onMouseLeave = this._onMouseLeave.bind(this);
		this._onFocus = this._onFocus.bind(this);
		this._onBlur = this._onBlur.bind(this);
		this._onResize = this._onResize.bind(this);

		this.delay = 0;
		this.disableFocusLock = false;
		this.forceShow = false;
		this.offset = 20;
		this.showing = false;
		this.state = 'info';

		this._isFocusing = false;
		this._isHovering = false;
		this._viewportMargin = 12;
	}

	get for() {
		return this._for;
	}
	set for(val) {
		const oldVal = this._for;
		if (oldVal !== val) {
			this._for = val;
			this.requestUpdate('for', oldVal);
			this._updateTarget();
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
			this._updateShowing();
		}
	}

	get showing() {
		return this._showing;
	}
	set showing(val) {
		const oldVal = this._showing;
		if (oldVal !== val) {
			this._showing = val;
			this.requestUpdate('showing', oldVal);
			this._showingChanged(val);
		}
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('resize', this._onResize);

		requestAnimationFrame(() => {
			this._updateTarget();
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this._onResize);
	}

	render() {

		const targetPositionStyle = {
			left: this._targetRect ? `${this._targetRect.x}px` : null,
			top: this._targetRect ? `${this._targetRect.y}px` : null,
			width: this._targetRect ? `${this._targetRect.width}px` : null,
			height: this._targetRect ? `${this._targetRect.height}px` : null,
		};

		const tooltipPositionStyle = {
			maxWidth: this._maxWidth ? `${this._maxWidth}px` : '',
			maxHeight: this._maxHeight ? `${this._maxHeight}px` : '',
			width: this._maxWidth ? `${this._maxWidth}px` : '',
			height: this._maxHeight ? `${this._maxHeight}px` : ''
		};

		if (this._tooltipShift !== undefined) {
			if (this._isAboveOrBelow()) {
				const isRtl = this.getAttribute('dir') === 'rtl';
				tooltipPositionStyle.left = !isRtl ? `${this._tooltipShift}px` : null;
				tooltipPositionStyle.right = !isRtl ? null : `${this._tooltipShift}px`;
			} else {
				tooltipPositionStyle.top = `${this._tooltipShift}px`;
			}
		}

		const contentStyle = {
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

	hide() {
		this._isHovering = false;
		this._isFocusing = false;
		this._updateShowing();
	}

	show() {
		this.showing = true;
	}

	_updateTarget() {
		this._removeListeners();
		const target = this._findTarget();
		if (target) {
			this.id = this.id || getUniqueId();
			target.setAttribute('aria-describedby', this.id);
		}
		this._target = target;
		this._addListeners();

		if (this.showing) {
			this._layoutTooltip();
		}
	}

	_findTarget() {
		const parentNode = this.parentNode;
		const ownerRoot = this.getRootNode();

		let target;
		if (this.for) {
			const targetSelector = `#${this.for}`;
			target = ownerRoot.querySelector(targetSelector);
			target = target || (ownerRoot && ownerRoot.host && ownerRoot.host.querySelector(targetSelector));
		} else {
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}
		return target;
	}

	_addListeners() {
		if (!this._target) {
			return;
		}
		this._target.addEventListener('mouseenter', this._onMouseEnter);
		this._target.addEventListener('mouseleave', this._onMouseLeave);
		this._target.addEventListener('focus', this._onFocus);
		this._target.addEventListener('blur', this._onBlur);

		this._targetSizeObserver = new ResizeObserver(() => this._layoutTooltip());
		this._targetSizeObserver.observe(this._target);
	}

	_removeListeners() {
		if (!this._target) {
			return;
		}
		this._target.removeEventListener('mouseenter', this._onMouseEnter);
		this._target.removeEventListener('mouseleave', this._onMouseLeave);
		this._target.removeEventListener('focus', this._onFocus);
		this._target.removeEventListener('blur', this._onBlur);

		if (this._targetSizeObserver) {
			this._targetSizeObserver.disconnect();
			this._targetSizeObserver = null;
		}
	}

	_onMouseEnter() {
		this._hoverTimeout = setTimeout(() => {
			this._isHovering = true;
			this._updateShowing();
		}, this.delay);
	}

	_onMouseLeave() {
		clearTimeout(this._hoverTimeout);
		this._isHovering = false;
		this._updateShowing();
	}

	_onFocus() {
		if (this.disableFocusLock) {
			this.showing = true;
		} else {
			this._isFocusing = true;
			this._updateShowing();
		}
	}

	_onBlur() {
		this._isFocusing = false;
		this._updateShowing();
	}

	_onResize() {
		if (!this.showing) {
			return;
		}
		this._layoutTooltip();
	}

	_updateShowing() {
		this.showing = this._isFocusing || this._isHovering || this.forceShow;
	}

	async _showingChanged(newValue) {
		clearTimeout(this._hoverTimeout);
		if (newValue) {
			await this.updateComplete;
			await this._layoutTooltip();
			this._dismissibleId = setDismissible(() => this.hide());
		} else {
			if (this._dismissibleId) {
				clearDismissible(this._dismissibleId);
				this._dismissibleId = null;
			}
		}
	}

	_getContent() {
		return this.shadowRoot.querySelector('.d2l-tooltip-content');
	}

	_getTargetPosition() {
		return this.shadowRoot.querySelector('.d2l-tooltip-target-position');
	}

	async _layoutTooltip() {

		const target = this._target;
		if (!target) {
			return;
		}

		const targetRect =  target.getBoundingClientRect();
		const spaceAround = this._constrainSpaceAround({
			above: targetRect.top - this._viewportMargin,
			below: window.innerHeight - (targetRect.top + targetRect.height) - this._viewportMargin,
			left: targetRect.left - this._viewportMargin,
			right: document.documentElement.clientWidth - (targetRect.left + targetRect.width) - this._viewportMargin
		});

		// Compute the size of the spaces above, below, left and right and find which space to fit the tooltip in
		const content = this._getContent();
		const spaces = this._computeAvailableSpaces(targetRect, spaceAround);
		const space = await this._fitContentToSpace(content, spaces);

		const contentRect = content.getBoundingClientRect();
		this._maxWidth = Math.max(contentRect.width, content.scrollWidth);
		this._maxHeight = contentRect.height;
		this._openDir = space.dir;

		// Compute how much the tooltip is shifted relative to its pointer
		const isVertical = this._isAboveOrBelow();
		let spaceLeft, spaceRight, centerDelta;
		if (isVertical) {
			const isRtl = this.getAttribute('dir') === 'rtl';
			spaceLeft = !isRtl ? spaceAround.left : spaceAround.right;
			spaceRight = !isRtl ? spaceAround.right : spaceAround.left;
			centerDelta = contentRect.width - targetRect.width;
		} else {
			spaceLeft = spaceAround.above;
			spaceRight = spaceAround.below;
			centerDelta = contentRect.height - targetRect.height;
		}
		this._tooltipShift = this._computeTooltipShift(centerDelta, spaceLeft, spaceRight);

		// Compute the x and y position of the tooltip relative to its target
		const targetPosition = this._getTargetPosition();
		const tooltipRect = targetPosition.getBoundingClientRect();
		const top = targetRect.top - tooltipRect.top + targetPosition.offsetTop;
		const left = targetRect.left - tooltipRect.left + targetPosition.offsetLeft;

		if (this._isAboveOrBelow()) {
			this._targetRect = {
				x: left,
				y: this._openDir === 'top' ? top - this.offset : top + targetRect.height + this.offset,
				width: targetRect.width,
				height: 0,
			};
		} else {
			this._targetRect = {
				x: this._openDir === 'left' ? left - this.offset : left + targetRect.width + this.offset,
				y: top,
				height: targetRect.height,
				width: 0,
			};
		}
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

	_computeAvailableSpaces(targetRect, spaceAround) {
		const verticalWidth = Math.max(spaceAround.left + targetRect.width + spaceAround.right, 0);
		const horizontalHeight = Math.max(spaceAround.above + targetRect.height + spaceAround.below, 0);
		const spaces = [
			{ dir: 'top', width: verticalWidth, height: Math.max(spaceAround.above - this.offset, 0) },
			{ dir: 'bottom', width: verticalWidth, height: Math.max(spaceAround.below - this.offset, 0) },
			{ dir: 'right', width: Math.max(spaceAround.right - this.offset, 0), height: horizontalHeight },
			{ dir: 'left', width: Math.max(spaceAround.left - this.offset, 0), height: horizontalHeight }
		];
		if (this.getAttribute('dir') === 'rtl') {
			const tmp = spaces[2];
			spaces[2] = spaces[3];
			spaces[3] = tmp;
		}
		return spaces;
	}

	async _fitContentToSpace(content, spaces) {
		// Legacy manual positioning based on the position attribute to allow for backwards compatibility
		let space = await this._fitByManualPosition(spaces);
		if (space) {
			return space;
		}
		space = await this._fitByBestFit(content, spaces);
		if (space) {
			return space;
		}
		return this._fitByLargestSpace(spaces);
	}

	async _fitByManualPosition(spaces) {
		const space = spaces.filter(space => space.dir === this.position)[0];
		if (!space) {
			return undefined;
		}
		this._maxWidth = space.width;
		this._maxHeight = null;
		await this.updateComplete;
		return space;
	}

	async _fitByBestFit(content, spaces) {
		for (let i = 0; i < spaces.length; ++i) {
			const space = spaces[i];
			this._maxWidth = space.width;
			this._maxHeight = space.height;
			await this.updateComplete;

			if (content.scrollWidth <= this._maxWidth && content.scrollHeight <= this._maxHeight) {
				return space;
			}
		}
		return undefined;
	}

	async _fitByLargestSpace(spaces) {
		let largest = spaces[0];
		for (let i = 1; i < spaces.length; ++i) {
			const space = spaces[i];
			if (space.width * space.height > largest.width * largest.height) {
				largest = space;
			}
		}
		this._maxWidth = largest.width;
		this._maxHeight = null;
		await this.updateComplete;
		return largest;
	}

	_computeTooltipShift(centerDelta, spaceLeft, spaceRight) {

		const contentXAdjustment = centerDelta / 2;
		if (centerDelta <= 0) {
			return contentXAdjustment * -1;
		}
		if (spaceLeft > contentXAdjustment && spaceRight > contentXAdjustment) {
			// center with target
			return contentXAdjustment * -1;
		}
		if (spaceLeft < contentXAdjustment) {
			// shift content right (not enough space to center)
			return spaceLeft * -1;
		} else if (spaceRight < contentXAdjustment) {
			// shift content left (not enough space to center)
			return (centerDelta * -1) + spaceRight;
		}
		return undefined;
	}

	_isAboveOrBelow() {
		return this._openDir === 'bottom' || this._openDir === 'top';
	}
}
customElements.define('d2l-tooltip', Tooltip);
