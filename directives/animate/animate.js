import { directive, PartType } from 'lit/directive.js';
import { getComposedActiveElement, getNextFocusable, isFocusVisibleSupported } from '../../helpers/focus.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { isComposedAncestor } from '../../helpers/dom.js';
import { noChange } from 'lit';

const stateMap = new WeakMap();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const showTransitionDuration = 300;
const hideTransitionDuration = 200;
const moveYValue = 20;

function isFocusVisibleApplied(node) {
	if (!node) return false;
	return isFocusVisibleSupported() && node.parentNode?.querySelector(':focus-visible') === node;
}

class AnimationState {

	constructor(partInfo) {
		if (!(partInfo.type === PartType.PROPERTY) || partInfo.name !== 'animate') {
			throw new Error('animate directives must be used with "animate" property');
		}
		this.id = 0;
		this.clone = null;
		this.elem = partInfo.element;
		this.state = 'unknown';
		this.styleAttr = null;
		this.styleAttrUse = false;
	}

	async animate(animInfo) {
		const id = ++this.id;

		if (this.clone === null) {
			this.clone = document.createElement('div');
		}
		this.elem.parentNode.insertBefore(this.clone, this.elem);

		Object.assign(this.clone.style, animInfo.clone.start);
		Object.assign(this.elem.style, animInfo.elem.start);

		if (animInfo.elem.transition) {
			await new Promise((r) => requestAnimationFrame(r));
			Object.assign(this.elem.style, animInfo.elem.transition);
		}

		await new Promise((r) => requestAnimationFrame(r));

		let outerResolve;
		const onTransitionEnd = () => {
			this.clone.removeEventListener('transitionend', onTransitionEnd);
			this.clone.removeEventListener('transitioncancel', onTransitionEnd);
			if (this.id === id) {
				this.clone.remove();
				this.clone = null;
				if (this.styleAttr) {
					this.elem.setAttribute('style', this.styleAttr);
				} else {
					this.elem.removeAttribute('style');
				}
				this.styleAttr = null;
				this.styleAttrUse = false;
				animInfo.onTransitionEnd();
				this.dispatchEvent();
				outerResolve();
			}
		};
		this.clone.addEventListener('transitionend', onTransitionEnd);
		this.clone.addEventListener('transitioncancel', onTransitionEnd);

		Object.assign(this.clone.style, animInfo.clone.end);
		Object.assign(this.elem.style, animInfo.elem.end);

		return new Promise((resolve) => outerResolve = resolve);
	}

	calculateCollapsedMargin(marginParent, marginChild) {
		let margin;
		if (marginParent < 0 && marginChild < 0) {
			margin = Math.min(marginParent, marginChild);
		} else if (marginParent < 0 || marginChild < 0) {
			margin = marginParent + marginChild;
		} else {
			margin = Math.max(marginParent, marginChild);
		}
		return margin;
	}

	dispatchEvent(timeout = 0) {
		// need a timeout as when motion is reduced
		// event fires too quickly to listen for
		// it right after render
		setTimeout(() => {
			this.elem.dispatchEvent(
				new CustomEvent(
					'd2l-animate-complete',
					{ bubbles: true, composed: false }
				)
			);
		}, timeout);
	}

	async getElemInfo() {

		await new Promise((r) => requestAnimationFrame(r));
		const style = window.getComputedStyle(this.elem);

		if (!this.styleAttr && !this.styleAttrUse) {
			this.styleAttr = this.elem.getAttribute('style');
			this.styleAttrUse = true;
		}

		const hasHiddenAttr = this.elem.getAttribute('hidden') !== null;
		if (hasHiddenAttr) {
			this.elem.removeAttribute('hidden');
		}

		const rect = this.elem.getBoundingClientRect();
		const marginsH = (parseInt(style.marginLeft) || 0) + (parseInt(style.marginRight) || 0);
		const originalHeight = rect.height;

		const paddingTemp = 1;

		const paddingTopOriginal = (parseInt(this.elem.style.paddingTop) || 0);
		const marginTParent = (parseInt(style.marginTop) || 0);
		this.elem.style.paddingTop = `${paddingTemp}px`; // forces top margin to NOT collapse between parent and top-most child
		const marginTChild = (this.elem.getBoundingClientRect().height - paddingTemp + paddingTopOriginal - originalHeight || 0);
		const marginT = this.calculateCollapsedMargin(marginTParent, marginTChild);
		if (paddingTopOriginal) {
			this.elem.style.paddingTop = `${paddingTopOriginal}px`;
		} else {
			this.elem.style.removeProperty('padding-top');
		}

		const paddingBottomOriginal = (parseInt(this.elem.style.paddingBottom) || 0);
		const marginBParent = (parseInt(style.marginBottom) || 0);
		this.elem.style.paddingBottom = `${paddingTemp}px`; // forces bottom margin to NOT collapse between parent and bottom-most child
		const marginBChild = (this.elem.getBoundingClientRect().height - paddingTemp + paddingBottomOriginal - originalHeight || 0);
		const marginB = this.calculateCollapsedMargin(marginBParent, marginBChild);
		if (paddingBottomOriginal) {
			this.elem.style.paddingBottom = `${paddingBottomOriginal}px`;
		} else {
			this.elem.style.removeProperty('padding-bottom');
		}

		const marginsV = marginT + marginB;

		const top = this.elem.offsetTop - (this.elem.scrollTop || 0) - marginT;
		const left = this.elem.offsetLeft - (this.elem.scrollLeft || 0);

		let cloneHeight = 0;
		if (this.clone !== null) {
			const cloneRect = this.clone.getBoundingClientRect();
			cloneHeight = cloneRect.height;
		}

		if (hasHiddenAttr) {
			this.elem.setAttribute('hidden', '');
		}

		return {
			clone: {
				height: cloneHeight,
				fullHeight: rect.height + marginsV,
				width: rect.width + marginsH
			},
			elem: {
				height: rect.height,
				left,
				opacity: this.state === 'showing' && this.clone === null ? '0' : style.opacity,
				top,
				width: rect.width
			}
		};

	}

	async hide(opts) {

		if (this.state === 'hiding' || this.state === 'hidden') {
			return;
		}
		this.state = 'hiding';

		// if focus is inside and was placed by keyboard, move it to next focusable
		const activeElem = getComposedActiveElement();
		if (activeElem && isFocusVisibleApplied(activeElem)) {
			const focusIsInside = isComposedAncestor(this.elem, activeElem);
			if (focusIsInside) {
				const nextFocusable = getNextFocusable(activeElem);
				if (nextFocusable) nextFocusable.focus();
			}
		}

		if (reduceMotion || opts.skip === true) {
			this.state = 'hidden';
			this.elem.setAttribute('hidden', '');
			this.dispatchEvent(100);
			return;
		}

		const elemInfo = await this.getElemInfo();

		return this.animate({
			clone: {
				start: {
					height: `${elemInfo.clone.height || elemInfo.clone.fullHeight}px`,
					transition: `height ${hideTransitionDuration}ms ease-out`,
					width: `${elemInfo.clone.width}px`
				},
				end: {
					height: '0'
				}
			},
			elem: {
				start: {
					height: `${elemInfo.elem.height}px`,
					left: `${elemInfo.elem.left}px`,
					opacity: elemInfo.elem.opacity,
					position: 'absolute',
					top: `${elemInfo.elem.top}px`,
					transitionProperty: 'height, opacity, transform',
					transitionDuration: `${hideTransitionDuration}ms`,
					transitionTimingFunction: 'ease-out',
					width: `${elemInfo.elem.width}px`
				},
				end: {
					opacity: '0',
					transform: `translateY(-${moveYValue}px)`
				}
			},
			onTransitionEnd: () => {
				this.state = 'hidden';
				this.elem.setAttribute('hidden', '');
			}
		});

	}

	async show(opts) {

		if (this.state === 'showing' || this.state === 'shown') {
			return;
		}
		this.state = 'showing';

		if (reduceMotion || opts.skip === true) {
			this.state = 'shown';
			this.elem.removeAttribute('hidden');
			this.dispatchEvent(100);
			return;
		}

		const elemInfo = await this.getElemInfo();

		this.elem.removeAttribute('hidden');

		return this.animate({
			clone: {
				start: {
					height: `${elemInfo.clone.height}px`,
					transition: `height ${showTransitionDuration}ms ease-out`,
					width: `${elemInfo.clone.width}px`
				},
				end: {
					height: `${elemInfo.clone.fullHeight}px`
				}
			},
			elem: {
				start: {
					height: `${elemInfo.elem.height}px`,
					left: `${elemInfo.elem.left}px`,
					opacity: elemInfo.elem.opacity,
					position: 'absolute',
					top: `${elemInfo.elem.top}px`,
					transform: `translateY(-${moveYValue}px)`,
					width: `${elemInfo.elem.width}px`
				},
				transition: {
					transitionProperty: 'height, opacity, transform',
					transitionDuration: `${showTransitionDuration}ms`,
					transitionTimingFunction: 'ease-out'
				},
				end: {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			onTransitionEnd: () => this.state = 'shown'
		});

	}

}

class Hide extends AsyncDirective {
	render() {
		return noChange;
	}
	update(part, [opts]) {
		opts = opts || {};
		let state = stateMap.get(part.element);
		if (state === undefined) {
			state = new AnimationState(part);
			stateMap.set(part.element, state);
		}
		state.hide(opts);
		return this.render();
	}
}

class Show extends AsyncDirective {
	render() {
		return noChange;
	}
	update(part, [opts]) {
		opts = opts || {};
		let state = stateMap.get(part.element);
		if (state === undefined) {
			state = new AnimationState(part);
			stateMap.set(part.element, state);
		}
		state.show(opts);
		return this.render();
	}
}

export const hide = directive(Hide);
export const show = directive(Show);
