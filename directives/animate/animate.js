import { directive, PropertyPart } from 'lit-html';
import { getComposedActiveElement, getNextFocusable } from '../../helpers/focus.js';
import { isComposedAncestor } from '../../helpers/dom.js';

const stateMap = new WeakMap();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const showTransitionDuration = 300;
const hideTransitionDuration = 200;
const moveYValue = 20;

class AnimationState {

	constructor(propertyPart) {

		if (!(propertyPart instanceof PropertyPart) || propertyPart.committer.name !== 'animate') {
			throw new Error('animation directives must be used with "animate" property');
		}

		this.id = 0;
		this.clone = null;
		this.elem = propertyPart.committer.element;
		this.state = 'unknown';

	}

	async animate(animInfo) {

		if (this.clone === null) {
			this.clone = document.createElement('div');
		}
		this.elem.parentNode.insertBefore(this.clone, this.elem);

		const id = ++this.id;

		let outerResolve;
		const onTransitionEnd = () => {
			this.clone.removeEventListener('transitionend', onTransitionEnd);
			if (this.id === id) {
				this.clone.remove();
				this.clone = null;
				if (animInfo.elem.styleAttr !== null) {
					this.elem.setAttribute('style', animInfo.elem.styleAttr);
				} else {
					this.elem.removeAttribute('style');
				}
				animInfo.onTransitionEnd();
				this.dispatchEvent();
				outerResolve();
			}
		};
		this.clone.addEventListener('transitionend', onTransitionEnd);

		Object.assign(this.clone.style, animInfo.clone.start);
		Object.assign(this.elem.style, animInfo.elem.start);

		if (animInfo.elem.transition) {
			await new Promise((r) => requestAnimationFrame(r));
			Object.assign(this.elem.style, animInfo.elem.transition);
		}

		await new Promise((r) => requestAnimationFrame(r));
		Object.assign(this.clone.style, animInfo.clone.end);
		Object.assign(this.elem.style, animInfo.elem.end);

		return new Promise((resolve) => outerResolve = resolve);

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

		const styleAttr = this.elem.getAttribute('style');
		if (style.display !== 'flex') {
			this.elem.style.display = 'grid'; // forces margins to collapse during size calculation
		}

		const rect = this.elem.getBoundingClientRect();
		const top = this.elem.offsetTop - (this.elem.scrollTop || 0);
		const left = this.elem.offsetLeft - (this.elem.scrollLeft || 0);
		const marginsH = (parseInt(style.marginLeft) || 0) + (parseInt(style.marginRight) || 0);
		const marginsV = (parseInt(style.marginTop) || 0) + (parseInt(style.marginBottom) || 0);

		let cloneHeight = 0;
		if (this.clone !== null) {
			const cloneRect = this.clone.getBoundingClientRect();
			cloneHeight = cloneRect.height;
		}

		this.elem.style.removeProperty('display');

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
				styleAttr,
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
		if (activeElem && activeElem.classList.contains('focus-visible')) {
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
				},
				styleAttr: elemInfo.elem.styleAttr
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
				},
				styleAttr: elemInfo.elem.styleAttr
			},
			onTransitionEnd: () => this.state = 'shown'
		});

	}

}

async function helper(part, action, opts) {
	let state = stateMap.get(part);
	if (state === undefined) {
		state = new AnimationState(part);
		stateMap.set(part, state);
	}
	opts = opts || {};
	if (action === 'show') {
		state.show(opts);
	} else if (action === 'hide') {
		state.hide(opts);
	}
}

export const hide = directive((opts) => async(part) => helper(part, 'hide', opts));

export const show = directive((opts) => async(part) => helper(part, 'show', opts));
