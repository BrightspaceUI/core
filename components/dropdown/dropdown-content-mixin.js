import { findComposedAncestor } from '../../helpers/dom.js';
import { html } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

export const DropdownContentMixin = superclass => class extends superclass {

	static get properties() {
		return {
			minWidth: {
				type: Number,
				reflect: true,
				attribute: 'min-width'
			},
			maxWidth: {
				type: Number,
				reflect: true,
				attribute: 'max-width'
			},
			noAutoClose: {
				type: Boolean,
				reflect: true
			},
			noAutoFit: {
				type: Boolean,
				reflect: true
			},
			noAutoFocus: {
				type: Boolean,
				reflect: true
			},
			noPadding: {
				type: Boolean,
				reflect: true
			},
			noPointer: {
				type: Boolean,
				reflect: true
			},
			align: {
				type: String,
				reflect: true
			},
			boundary: {
				type: Object,
			},
			opened: {
				type: Boolean,
				reflect: true
			},
			openedAbove: {
				type: Boolean,
				reflect: true
			},
			/**
			 * Whether to render the content immediately. By default, the content rendering
			 * is deferred.
			 */
			renderContent: {
				type: Boolean
			},
			verticalOffset: {
				type: String,
				attribute: 'vertical-offset'
			}
		};
	}

	constructor() {
		super();
		this.__applyFocus = true;
	}

	async __openedChanged(newValue) {

		const doOpen = () => {

			const content = this.__getContentContainer();

			if (!this.noAutoFit) {
				content.scrollTop = 0;
			}

			this.__position();
		};

		if (newValue) {

			await this.forceRender();
			doOpen();
		}
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.__content = this.__getContentContainer();
	}

	_renderContentContainer(innerHtml) {
		const styles = {};
		if (this.minWidth) {
			styles.minWidth = `${this.minWidth}px`;
		}

		return html`
            <div class="d2l-dropdown-content-container" style=${styleMap(styles)}>
                ${innerHtml()}
            </div>
        `;
	}

	_renderWidthContainer(innerHtml) {
		const styles = {};
		if (this.maxWidth) {
			styles.maxWidth = `${this.maxWidth}px`;
		}
		if (this.minWidth) {
			styles.minWidth = `${this.minWidth}px`;
		}
		return html`
            <div class="d2l-dropdown-content-width" style=${styleMap(styles)}>
                ${innerHtml()}
            </div>
        `;
	}

	/**
	 * Toggles the opened/closed state of the dropdown.  If closed, it will open, and vice versa.
	 * @param {Boolean} applyFocus Whether focus should be automatically moved to first focusable upon opening.
	 */
	toggleOpen(applyFocus) {
		if (this.opened) {
			this.close();
		} else {
			this.open(applyFocus);
		}
	}

	/**
	 * Opens/shows the dropdown.
	 * @param {Boolean} applyFocus Whether focus should be automatically move to first focusable upon opening.
	 */
	open(applyFocus) {
		this.__applyFocus = applyFocus !== undefined ? applyFocus : true;
		this.opened = true;
		this.__openedChanged(this.opened);
	}

	/**
     * Closes/hides the dropdown.
     */
	close() {
		this.opened = false;
		this.__openedChanged(this.opened);
	}

	async forceRender() {
		await this.requestUpdate();
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

	__getOpener() {
		const opener = findComposedAncestor(this, (elem) => {
			if (elem.isDropdownOpener) {
				return true;
			}
		});
		return opener;
	}

	__position(ignoreVertical, contentRect) {

		const opener = this.__getOpener();
		if (!opener) {
			return;
		}
		const target = opener.getOpenerElement();
		if (!target) {
			return;
		}

		const content = this.__getContentContainer();
		const position = this.__getPositionContainer();
		const widthContainer = this.__getWidthContainer();

		if (!this.noAutoFit) {
			content.style.maxHeight = 'none';
		}

		const adjustPosition = () => {

			const targetRect = target.getBoundingClientRect();
			contentRect = contentRect ? contentRect : content.getBoundingClientRect();

			const spaceAround = {
				above: targetRect.top - 50,
				below: window.innerHeight - targetRect.bottom - 80,
				left: targetRect.left - 20,
				right: document.documentElement.clientWidth - targetRect.right - 15
			};

			if (this.boundary) {
				spaceAround.above = this.boundary.above >= 0 ? Math.min(spaceAround.above, this.boundary.above) : spaceAround.above;
				spaceAround.below = this.boundary.below >= 0 ? Math.min(spaceAround.below, this.boundary.below) : spaceAround.below;
				spaceAround.left = this.boundary.left >= 0 ? Math.min(spaceAround.left, this.boundary.left) : spaceAround.left;
				spaceAround.right = this.boundary.right >= 0 ? Math.min(spaceAround.right, this.boundary.right) : spaceAround.right;
			}

			const spaceRequired = {
				height: contentRect.height + 20,
				width: contentRect.width
			};

			let maxHeight;

			if (!ignoreVertical) {
				if (
					(spaceAround.below < spaceRequired.height)
			&& (
				(spaceAround.above > spaceRequired.height)
				|| (spaceAround.above > spaceAround.below)
			)
				) {
					this.openedAbove = true;
				} else {
					this.openedAbove = false;
				}
			}

			if (this.openedAbove) {
				maxHeight = Math.floor(spaceAround.above);
			} else {
				maxHeight = Math.floor(spaceAround.below);
			}

			if ((this.align === 'start' && !this.__isRTL) || (this.align === 'end' && this.__isRTL)) {
				spaceAround.left = 0;
			} else if ((this.align === 'start' && this.__isRTL) || (this.align === 'end' && !this.__isRTL)) {
				spaceAround.right = 0;
			}

			const centerDelta = contentRect.width - targetRect.width;
			const contentXAdjustment = centerDelta / 2;
			if (centerDelta > 0) {
				// content wider than target, so slide left/right as needed
				if (!this.__isRTL) {
					if (spaceAround.left > contentXAdjustment && spaceAround.right > contentXAdjustment) {
						// center with target
						position.style.left = `${contentXAdjustment * -1}px`;
					} else if (spaceAround.left < contentXAdjustment) {
						// slide content right (not enough space to center)
						position.style.left = `${(spaceAround.left) * -1}px`;
					} else if (spaceAround.right < contentXAdjustment) {
						// slide content left (not enough space to center)
						position.style.left = `${((contentRect.width - targetRect.width) * -1) + spaceAround.right}px`;
					}
				} else {
					if (spaceAround.left > contentXAdjustment && spaceAround.right > contentXAdjustment) {
						// center with target
						position.style.right = `${contentXAdjustment * -1}px`;
					} else if (spaceAround.left < contentXAdjustment) {
						// slide content right (not enough space to center)
						position.style.right = `${((contentRect.width - targetRect.width) * -1) + spaceAround.left}px`;
					} else if (spaceAround.right < contentXAdjustment) {
						// slide content left (not enough space to center)
						position.style.right = `${(spaceAround.right) * -1}px`;
					}
				}
			} else {
				// content narrower than target, so slide in
				if (!this.__isRTL) {
					position.style.left = `${contentXAdjustment * -1}px`;
				} else {
					position.style.right = `${contentXAdjustment * -1}px`;
				}
			}

			if (!this.noAutoFit && maxHeight && maxHeight > 0) {
				content.style.maxHeight = `${maxHeight}px`;
				this.__toggleOverflowY(contentRect.height > maxHeight);
			}

			this.dispatchEvent(new CustomEvent('d2l-dropdown-position', { bubbles: true, composed: true }));

		};

		/* don't let dropdown content horizontally overflow viewport */
		widthContainer.style.width = '';
		content.style.width = '';

		let width = window.innerWidth - 40;
		if (width > content.scrollWidth) {
			width = content.scrollWidth;
		}
		/* add 2 to width since scrollWidth does not include border */
		widthContainer.style.width = `${width + 20}px`;
		/* set width of content too so IE will render scroll inside border */
		content.style.width = `${width + 18}px`;

		adjustPosition();
	}

	__toggleOverflowY(isOverflowing) {
		if (!this.__content || !this.__content.style || !this.__content.style.maxHeight) {
			return;
		}

		const maxHeight = parseInt(this.__content.style.maxHeight, 10);
		if (!maxHeight) {
			return;
		}

		if (isOverflowing || this.__content.scrollHeight > maxHeight) {
			this.__content.style.overflowY = 'auto';
		} else {
			/* needed for IE */
			this.__content.style.overflowY = 'hidden';
		}
	}
};
