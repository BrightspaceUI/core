import { directive, PropertyPart } from 'lit-html';
import { getComposedActiveElement, getNextFocusable } from '../../helpers/focus.js';
import { getComposedParent, isComposedAncestor } from '../../helpers/dom.js';

const stateMap = new WeakMap();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const showTransitionDuration = 300;
const hideTransitionDuration = 200;
const moveYValue = 20;

class AnimationState {

	constructor(propertyPart) {

		if (!(propertyPart instanceof PropertyPart) || propertyPart.committer.name !== 'animate') {
			throw new Error('animation directives must be used with "animation" property');
		}

		this.id = 0;
		this.clone = null;
		this.elem = propertyPart.committer.element;
		this.state = 'unknown';

	}

	async animate(info) {

		if (this.clone === null) {
			this.clone = document.createElement('div');
		}
		this.elem.parentNode.insertBefore(this.clone, this.elem);

		const id = ++this.id;

		let outerResolve;
		const onTransitionEnd = (event) => {
			if (event.target === this.clone) {
				this.clone.removeEventListener('transitionend', onTransitionEnd);
				if (this.id === id) {
					this.clone.remove();
					this.clone = null;
					info.onTransitionEnd();
					['height', 'left', 'opacity', 'position', 'top', 'transform', 'transition', 'width']
						.forEach((prop) => this.elem.style.removeProperty(prop));
					outerResolve();
				}
			}
		};
		this.clone.addEventListener('transitionend', onTransitionEnd);

		Object.assign(this.clone.style, info.clone.start);
		Object.assign(this.elem.style, info.elem.start);

		if (info.elem.transition) {
			await new Promise((r) => requestAnimationFrame(r));
			Object.assign(this.elem.style, info.elem.transition);
		}

		await new Promise((r) => requestAnimationFrame(r));
		Object.assign(this.clone.style, info.clone.end);
		Object.assign(this.elem.style, info.elem.end);

		return new Promise((resolve) => outerResolve = resolve);

	}

	async getElemInfo() {

		await new Promise((r) => requestAnimationFrame(r));
		const style = window.getComputedStyle(this.elem);

		if (style.display !== 'flex') {
			this.elem.style.display = 'grid'; // forces margins to collapse during size calculation
		}

		const rect = this.elem.getBoundingClientRect();

		let top = 0;
		let left = 0;
		const offsetParent = this.elem.offsetParent;
		let e = this.elem;
		while (e && e !== document && !(e instanceof DocumentFragment)) {
			if (e === offsetParent) {
				break;
			}
			top += e.offsetTop - (e.scrollTop || 0);
			left += e.offsetLeft - (e.scrollLeft || 0);
			e = getComposedParent(e);
		}

		this.elem.style.removeProperty('display');

		const marginsH = (parseInt(style.marginLeft) || 0) + (parseInt(style.marginRight) || 0);
		const marginsV = (parseInt(style.marginTop) || 0) + (parseInt(style.marginBottom) || 0);

		let cloneHeight = 0;
		if (this.clone !== null) {
			const cloneRect = this.clone.getBoundingClientRect();
			cloneHeight = cloneRect.height;
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

		// if focus is inside, move it to next focusable
		const activeElem = getComposedActiveElement();
		const focusIsInside = isComposedAncestor(this.elem, activeElem);
		if (focusIsInside) {
			const nextFocusable = getNextFocusable(activeElem);
			if (nextFocusable) nextFocusable.focus();
		}

		if (reduceMotion || opts.skip === true) {
			this.state = 'hidden';
			this.elem.setAttribute('hidden', '');
			return;
		}

		const info = await this.getElemInfo();

		return this.animate({
			clone: {
				start: {
					height: `${info.clone.height || info.clone.fullHeight}px`,
					transition: `height ${hideTransitionDuration}ms ease-out`,
					width: `${info.clone.width}px`
				},
				end: {
					height: '0'
				}
			},
			elem: {
				start: {
					height: `${info.elem.height}px`,
					left: `${info.elem.left}px`,
					opacity: info.elem.opacity,
					position: 'absolute',
					top: `${info.elem.top}px`,
					transitionProperty: 'height, opacity, transform',
					transitionDuration: `${hideTransitionDuration}ms`,
					transitionTimingFunction: 'ease-out',
					width: `${info.elem.width}px`
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
			return;
		}

		const info = await this.getElemInfo();

		this.elem.removeAttribute('hidden');

		return this.animate({
			clone: {
				start: {
					height: `${info.clone.height}px`,
					transition: `height ${showTransitionDuration}ms ease-out`,
					width: `${info.clone.width}px`
				},
				end: {
					height: `${info.clone.fullHeight}px`
				}
			},
			elem: {
				start: {
					height: `${info.elem.height}px`,
					left: `${info.elem.left}px`,
					opacity: info.elem.opacity,
					position: 'absolute',
					top: `${info.elem.top}px`,
					transform: `translateY(-${moveYValue}px)`,
					width: `${info.elem.width}px`
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
