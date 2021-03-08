import { dedupeMixin } from '@open-wc/dedupe-mixin';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const transitionDuration = 300;
const moveYValue = 10;

export const VisibilityMixin = dedupeMixin(superclass => class extends superclass {
	static get properties() {
		return {
			animate: { type: String }
		};
	}

	firstUpdated() {
		this.opacityOriginal = window.getComputedStyle(this).opacity;
		this.transformOriginal = window.getComputedStyle(this).transform;
		this.displayOriginal = window.getComputedStyle(this).display;
		this.transitionOriginal = window.getComputedStyle(this).transition;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('animate')) {
			if (this.animate === 'show') {
				this._animateShow();
			} else if (this.animate === 'hide') {
				this._animateHide();
			} else if (this.animate === 'remove') {
				this._animateRemove();
			}
		}
	}

	_animateHide() {
		if (reduceMotion) {
			this.style.display = 'none';
			return;
		}

		const thisOnTransitionStart = () => {
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-hide-start',
				{ bubbles: true, composed: false }
			));
		};
		const cloneOnTransitionEnd = () => {
			this.clone.parentNode.insertBefore(this, this.clone);
			this.clone.remove();
			this.style.display = 'none';
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-hide-end',
				{ bubbles: true, composed: false }
			));
		};
		this._animateHideRemove(thisOnTransitionStart, cloneOnTransitionEnd);
	}

	_animateHideRemove(thisOnTransitionStart, cloneOnTransitionEnd) {
		const animateHideRemoveStyle = {
			initial: {
				transition: `all ${transitionDuration}ms ease`,
				opacity: `${this.opacityOriginal}`,
				transform: `${this.transformOriginal}`
			},
			initialClone: {
				transition: `height ${transitionDuration}ms ease ${transitionDuration / 3}ms`,
				height: `calc(${this.scrollHeight}px + ${window.getComputedStyle(this).marginTop} + ${window.getComputedStyle(this).marginBottom})`
			},
			final: {
				opacity: '0',
				transform: `translateY(-${moveYValue}px)`
			},
			finalClone: {
				height: '0'
			},
			thisOnTransitionStart: thisOnTransitionStart,
			cloneOnTransitionEnd: cloneOnTransitionEnd
		};
		this._animateVisibility(animateHideRemoveStyle);
	}

	_animateRemove() {
		if (reduceMotion) {
			this.remove();
			return;
		}

		const thisOnTransitionStart = () => {
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-remove-start',
				{ bubbles: true, composed: false }
			));
		};
		const cloneOnTransitionEnd = () => {
			this.clone.parentNode.insertBefore(this, this.clone);
			this.clone.remove();
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-remove-end',
				{ bubbles: true, composed: false }
			));
			this.remove();
		};
		this._animateHideRemove(thisOnTransitionStart, cloneOnTransitionEnd);
	}

	_animateShow() {
		if (reduceMotion) {
			this.style.display = this.displayOriginal;
			return;
		}

		this.style.display = this.displayOriginal;
		const cloneOnTransitionStart = () => {
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-show-start',
				{ bubbles: true, composed: false }
			));
		};
		const thisOnTransitionEnd = () => {
			this.clone.parentNode.insertBefore(this, this.clone);
			this.clone.remove();
			// done visibility transition, element is in original, fully visible state, so return the original transition to this
			this.style.transition = this.transitionOriginal;
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-show-end',
				{ bubbles: true, composed: false }
			));
		};
		const animateShowStyle = {
			initial: {
				transition: `all ${transitionDuration}ms ease ${transitionDuration / 3}ms`,
				opacity: '0',
				transform: `translateY(-${moveYValue}px)`
			},
			initialClone: {
				transition: `height ${transitionDuration}ms ease`,
				height: '0'
			},
			final: {
				opacity: `${this.opacityOriginal}`,
				transform: `${this.transformOriginal}`
			},
			finalClone: {
				height: `calc(${this.scrollHeight}px + ${window.getComputedStyle(this).marginTop} + ${window.getComputedStyle(this).marginBottom})`
			},
			cloneOnTransitionStart: cloneOnTransitionStart,
			thisOnTransitionEnd: thisOnTransitionEnd
		};

		this._animateVisibility(animateShowStyle);
	}

	async _animateVisibility(animateStyle) {
		this._initClone();
		Object.assign(this.style, animateStyle.initial);
		Object.assign(this.clone.style, animateStyle.initialClone);

		// we are in the middle of an earlier transition
		if (document.body.contains(this.clone)) {
			// preserve the current opacity & transform for when we switch directions of transition
			this.style.opacity = window.getComputedStyle(this).opacity;
			this.style.transform = window.getComputedStyle(this).transform;

			// preserve the current clone height for when we switch directions of transition
			this.clone.style.height = window.getComputedStyle(this.clone).height;
			this.clone.parentNode.insertBefore(this, this.clone);
			this.clone.remove();
		}
		this.parentNode.insertBefore(this.clone, this);
		this.clone.appendChild(this);

		// allow enough time for reflow to occur to ensure that the transition properly runs
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

		if (animateStyle.thisOnTransitionStart) {
			const thisOnTransitionStart = (event) => {
				if (event.target === this && event.propertyName === 'opacity') {
					animateStyle.thisOnTransitionStart();
					this.removeEventListener('transitionstart', thisOnTransitionStart);
				}
			};
			this.addEventListener('transitionstart', thisOnTransitionStart);
		}

		if (animateStyle.cloneOnTransitionStart) {
			const cloneOnTransitionStart = (event) => {
				if (event.target === this.clone) {
					animateStyle.cloneOnTransitionStart();
					this.clone.removeEventListener('transitionstart', cloneOnTransitionStart);
				}
			};
			this.clone.addEventListener('transitionstart', cloneOnTransitionStart);
		}

		if (animateStyle.thisOnTransitionEnd) {
			const thisOnTransitionEnd = (event) => {
				if (event.target === this && event.propertyName === 'opacity') {
					animateStyle.thisOnTransitionEnd();
					this.removeEventListener('transitionend', thisOnTransitionEnd);
				}
			};
			this.addEventListener('transitionend', thisOnTransitionEnd);
		}

		if (animateStyle.cloneOnTransitionEnd) {
			const cloneOnTransitionEnd = (event) => {
				if (event.target === this.clone) {
					animateStyle.cloneOnTransitionEnd();
					this.clone.removeEventListener('transitionend', cloneOnTransitionEnd);
				}
			};
			this.clone.addEventListener('transitionend', cloneOnTransitionEnd);
		}

		Object.assign(this.clone.style, animateStyle.finalClone);
		Object.assign(this.style, animateStyle.final);
	}

	_initClone() {
		if (!this.clone) {
			this.clone = document.createElement('div');
			this.clone.style.overflow = 'hidden';
			this.clone.style.display = 'grid';
		}
	}
});
