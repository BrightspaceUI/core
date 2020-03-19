import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodySmallStyles } from '../typography/styles.js';
import { getOffsetParent } from '../../helpers/dom.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const pointerLength = 16;
const pointerOverhang = 7; /* how far the pointer extends outside the content */

/* rotated 45 degrees */
const pointerRotatedLength = Math.SQRT2 * pointerLength;
const pointerRotatedOverhang = ((pointerRotatedLength - pointerLength) / 2) + pointerOverhang;

const pointerGap = 6; /* spacing between pointer and target */
const defaultViewportMargin = 18;
const contentBorderRadius = 6;

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
			showing: { type: Boolean, reflect: true },
			state: { type: String, reflect: true }, /* Valid values are: 'info' and 'error' */
			_maxWidth: { type: Number },
			_openDir: { type: String, reflect: true, attribute: '_open-dir' },
			_targetRect: { type: Object },
			_tooltipShift: { type: Number },
			_viewportMargin: { type: Number }
		};
	}

	static get styles() {
		return [bodySmallStyles, css`
			:host {
				--d2l-tooltip-background-color: var(--d2l-color-ferrite); /* Deprecated, use state attribute instead */
				box-sizing: border-box;
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
				left: calc(50% - ${pointerOverhang}px);
			}

			:host([_open-dir="top"]) .d2l-tooltip-pointer {
				bottom: -${pointerOverhang}px;
				clip: rect(9px, 21px, 22px, -3px);
			}

			:host([_open-dir="bottom"]) .d2l-tooltip-pointer {
				clip: rect(-5px, 21px, 8px, -7px);
				top: -${pointerOverhang}px;
			}

			:host([_open-dir="left"]) .d2l-tooltip-pointer,
			:host([_open-dir="right"]) .d2l-tooltip-pointer {
				top: calc(50% - ${pointerOverhang}px);
			}

			:host([_open-dir="left"]) .d2l-tooltip-pointer {
				clip: rect(-3px, 21px, 21px, 9px);
				right: -${pointerOverhang}px;
			}

			:host([_open-dir="right"]) .d2l-tooltip-pointer {
				clip: rect(-3px, 9px, 21px, -3px);
				left: -${pointerOverhang}px;
			}

			.d2l-tooltip-pointer > div {
				-webkit-transform: rotate(45deg);
				background-color: var(--d2l-tooltip-background-color);
				border-radius: 0.1rem;
				height: ${pointerLength}px;
				transform: rotate(45deg);
				width: ${pointerLength}px;
			}

			.d2l-tooltip-position {
				display: inline-block;
				height: 0;
				position: absolute;
				width: 17.5rem;
			}

			:host([_open-dir="left"]) .d2l-tooltip-position {
				right: 100%;
			}

			.d2l-tooltip-content {
				background-color: var(--d2l-tooltip-background-color);
				border-radius: ${contentBorderRadius}px;
				box-sizing: border-box;
				color: white;
				min-height: 2.1rem;
				min-width: 2.1rem;
				overflow: hidden;
				padding: 11px 15px;
				position: absolute;
			}

			:host([_open-dir="top"]) .d2l-tooltip-content {
				bottom: 100%;
			}
			:host([_open-dir="left"]) .d2l-tooltip-content {
				right: 0;
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

		this._onTargetBlur = this._onTargetBlur.bind(this);
		this._onTargetFocus = this._onTargetFocus.bind(this);
		this._onTargetMouseEnter = this._onTargetMouseEnter.bind(this);
		this._onTargetMouseLeave = this._onTargetMouseLeave.bind(this);
		this._onTargetResize = this._onTargetResize.bind(this);

		this.delay = 0;
		this.disableFocusLock = false;
		this.forceShow = false;
		this.offset = pointerRotatedOverhang + pointerGap;
		this.showing = false;
		this.state = 'info';

		this._dismissibleId = null;
		this._isFocusing = false;
		this._isHovering = false;
		this._viewportMargin = defaultViewportMargin;
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
		window.addEventListener('resize', this._onTargetResize);

		requestAnimationFrame(() => {
			this._updateTarget();
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeListeners();
		window.removeEventListener('resize', this._onTargetResize);
		clearDismissible(this._dismissibleId);
		this._dismissibleId = null;
	}

	hide() {
		this._isHovering = false;
		this._isFocusing = false;
		this._updateShowing();
	}

	render() {
		const targetPositionStyle = {
			left: this._targetRect ? `${this._targetRect.x}px` : null,
			top: this._targetRect ? `${this._targetRect.y}px` : null,
			width: this._targetRect ? `${this._targetRect.width}px` : null,
			height: this._targetRect ? `${this._targetRect.height}px` : null,
		};

		const contentStyle = {
			maxWidth: this._maxWidth ? `${this._maxWidth}px` : null
		};
		const tooltipPositionStyle = { ...contentStyle };
		if (this._tooltipShift !== undefined) {
			if (this._isAboveOrBelow()) {
				const isRtl = this.getAttribute('dir') === 'rtl';
				tooltipPositionStyle.left = !isRtl ? `${this._tooltipShift}px` : null;
				tooltipPositionStyle.right = !isRtl ? null : `${this._tooltipShift}px`;
			} else {
				tooltipPositionStyle.top = `${this._tooltipShift}px`;
			}
		}

		return html`
			<div class="d2l-tooltip-target-position" style=${styleMap(targetPositionStyle)}>
				<div class="d2l-tooltip-container">
					<div class="d2l-tooltip-position" style=${styleMap(tooltipPositionStyle)}>
						<div class=" d2l-body-small d2l-tooltip-content" style=${styleMap(contentStyle)}>
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

	show() {
		this.showing = true;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'for') {
				this._updateTarget();
			} else if (prop === 'forceShow') {
				this._updateShowing();
			}
		});
	}

	_addListeners() {
		if (!this._target) {
			return;
		}
		this._target.addEventListener('mouseenter', this._onTargetMouseEnter);
		this._target.addEventListener('mouseleave', this._onTargetMouseLeave);
		this._target.addEventListener('focus', this._onTargetFocus);
		this._target.addEventListener('blur', this._onTargetBlur);

		this._targetSizeObserver = new ResizeObserver(this._onTargetResize);
		this._targetSizeObserver.observe(this._target);
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

	_computeSpaceAround(targetRect) {
		const spaceAround = {
			above: targetRect.top - this._viewportMargin,
			below: window.innerHeight - (targetRect.top + targetRect.height) - this._viewportMargin,
			left: targetRect.left - this._viewportMargin,
			right: document.documentElement.clientWidth - (targetRect.left + targetRect.width) - this._viewportMargin
		};
		const offsetParent = getOffsetParent(this);
		if (this.boundary && offsetParent) {
			const parentRect = offsetParent.getBoundingClientRect();
			if (!isNaN(this.boundary.left)) {
				spaceAround.left = Math.min(targetRect.left - parentRect.left - this.boundary.left, spaceAround.left);
			}
			if (!isNaN(this.boundary.right) && (isNaN(this.boundary.left) || this.boundary.right >= this.boundary.left)) {
				spaceAround.right = Math.min(parentRect.left + this.boundary.right - targetRect.right, spaceAround.right);
			}
			if (!isNaN(this.boundary.top)) {
				spaceAround.above = Math.min(targetRect.top - parentRect.top - this.boundary.top, spaceAround.above);
			}
			if (!isNaN(this.boundary.bottom)) {
				spaceAround.below = Math.min(parentRect.bottom - targetRect.bottom - this.boundary.bottom, spaceAround.below);
			}
		}
		return spaceAround;
	}

	_computeTooltipShift(centerDelta, spaceLeft, spaceRight) {

		const contentXAdjustment = centerDelta / 2;
		if (centerDelta <= 0) {
			return contentXAdjustment * -1;
		}
		if (spaceLeft >= contentXAdjustment && spaceRight >= contentXAdjustment) {
			// center with target
			return contentXAdjustment * -1;
		}
		if (spaceLeft <= contentXAdjustment) {
			// shift content right (not enough space to center)
			return spaceLeft * -1;
		} else {
			// shift content left (not enough space to center)
			return (centerDelta * -1) + spaceRight;
		}
	}

	_findTarget() {
		const ownerRoot = this.getRootNode();

		let target;
		if (this.for) {
			const targetSelector = `#${this.for}`;
			target = ownerRoot.querySelector(targetSelector);
			target = target || (ownerRoot && ownerRoot.host && ownerRoot.host.querySelector(targetSelector));
		} else {
			const parentNode = this.parentNode;
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}
		return target;
	}

	async _fitByBestFit(content, spaces) {
		for (let i = 0; i < spaces.length; ++i) {
			const space = spaces[i];
			this._maxWidth = space.width;
			await this.updateComplete;

			if (content.scrollWidth <= this._maxWidth && content.scrollHeight <= space.height) {
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
		await this.updateComplete;
		return largest;
	}

	async _fitByManualPosition(spaces) {
		const space = spaces.filter(space => space.dir === this.position)[0];
		if (!space) {
			return undefined;
		}
		this._maxWidth = space.width;
		await this.updateComplete;
		return space;
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

	_getContent() {
		return this.shadowRoot.querySelector('.d2l-tooltip-content');
	}

	_getTargetPosition() {
		return this.shadowRoot.querySelector('.d2l-tooltip-target-position');
	}

	_isAboveOrBelow() {
		return this._openDir === 'bottom' || this._openDir === 'top';
	}

	async _layoutTooltip() {

		const target = this._target;
		if (!target) {
			return;
		}

		const targetRect = target.getBoundingClientRect();
		const spaceAround = this._computeSpaceAround(targetRect);

		// Compute the size of the spaces above, below, left and right and find which space to fit the tooltip in
		const content = this._getContent();
		const spaces = this._computeAvailableSpaces(targetRect, spaceAround);
		const space = await this._fitContentToSpace(content, spaces);

		const contentRect = content.getBoundingClientRect();
		// + 1 because scrollWidth does not give sub-pixel measurements and half a pixel may cause text to unexpectedly wrap
		this._maxWidth = content.scrollWidth + 1;
		this._openDir = space.dir;
		await this.updateComplete;

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

		// Compute how much the tooltip is shifted relative to its pointer
		let spaceLeft, spaceRight, centerDelta, maxShift, minShift;
		if (this._isAboveOrBelow()) {
			const isRtl = this.getAttribute('dir') === 'rtl';
			spaceLeft = !isRtl ? spaceAround.left : spaceAround.right;
			spaceRight = !isRtl ? spaceAround.right : spaceAround.left;
			centerDelta = this._maxWidth - targetRect.width;
			maxShift = targetRect.width / 2;
			minShift = maxShift - this._maxWidth;
		} else {
			spaceLeft = spaceAround.above;
			spaceRight = spaceAround.below;
			centerDelta = contentRect.height - targetRect.height;
			maxShift = targetRect.height / 2;
			minShift = maxShift - contentRect.height;
		}
		const shift = this._computeTooltipShift(centerDelta, spaceLeft, spaceRight);
		const shiftMargin = (pointerRotatedLength / 2) + contentBorderRadius;
		this._tooltipShift = Math.min(Math.max(shift, minShift + shiftMargin), maxShift - shiftMargin);
	}

	_onTargetBlur() {
		this._isFocusing = false;
		this._updateShowing();
	}

	_onTargetFocus() {
		if (this.disableFocusLock) {
			this.showing = true;
		} else {
			this._isFocusing = true;
			this._updateShowing();
		}
	}

	_onTargetMouseEnter() {
		this._hoverTimeout = setTimeout(() => {
			this._isHovering = true;
			this._updateShowing();
		}, this.delay);
	}

	_onTargetMouseLeave() {
		clearTimeout(this._hoverTimeout);
		this._isHovering = false;
		this._updateShowing();
	}

	_onTargetResize() {
		if (!this.showing) {
			return;
		}
		this._layoutTooltip();
	}

	_removeListeners() {
		if (!this._target) {
			return;
		}
		this._target.removeEventListener('mouseenter', this._onTargetMouseEnter);
		this._target.removeEventListener('mouseleave', this._onTargetMouseLeave);
		this._target.removeEventListener('focus', this._onTargetFocus);
		this._target.removeEventListener('blur', this._onTargetBlur);

		if (this._targetSizeObserver) {
			this._targetSizeObserver.disconnect();
			this._targetSizeObserver = null;
		}
	}

	async _showingChanged(newValue) {
		clearTimeout(this._hoverTimeout);
		if (newValue) {
			await this.updateComplete;
			await this._layoutTooltip();
			this._dismissibleId = setDismissible(() => this.hide());
			this.dispatchEvent(new CustomEvent(
				'd2l-tooltip-show', { bubbles: true, composed: true }
			));
		} else {
			if (this._dismissibleId) {
				clearDismissible(this._dismissibleId);
				this._dismissibleId = null;
			}
			this.dispatchEvent(new CustomEvent(
				'd2l-tooltip-hide', { bubbles: true, composed: true }
			));
		}
	}

	_updateShowing() {
		this.showing = this._isFocusing || this._isHovering || this.forceShow;
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
}
customElements.define('d2l-tooltip', Tooltip);
