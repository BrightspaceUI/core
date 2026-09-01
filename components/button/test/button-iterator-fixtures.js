import '../button-iterator.js';
import { focusElem, hoverElem, oneEvent } from '@brightspace-ui/testing';
import { html } from 'lit';

export function getPrevious(elem) {
	return elem.shadowRoot.querySelector('.previous');
}

export function getNext(elem) {
	return elem.shadowRoot.querySelector('.next');
}

export function getNextOnly(elem) {
	return elem.shadowRoot.querySelector('.next-only');
}

export async function hoverNext(elem) {
	const next = getNext(elem);
	hoverElem(next);
	if (!next.disabled) {
		await oneEvent(elem, 'd2l-tooltip-show');
	}
}

export async function hoverPrevious(elem) {
	const previous = getPrevious(elem);
	hoverElem(previous);
	if (!previous.disabled) {
		await oneEvent(elem, 'd2l-tooltip-show');
	}
}

export async function focusNext(elem) {
	const next = getNext(elem);
	focusElem(next);
	if (!next.disabled) {
		await oneEvent(elem, 'd2l-tooltip-show');
	}
}

export async function focusPrevious(elem) {
	const previous = getPrevious(elem);
	focusElem(previous);
	if (!previous.disabled) {
		await oneEvent(elem, 'd2l-tooltip-show');
	}
}

export const buttonIteratorFixtures = {
	default: html`<d2l-button-iterator></d2l-button-iterator>`,
	custom: html`<d2l-button-iterator previous-text="Go Back" next-text="Go Forward"></d2l-button-iterator>`,
	description: html`<d2l-button-iterator description="Step 1 of 3"></d2l-button-iterator>`,
	disabled: html`<d2l-button-iterator previous-disabled next-disabled></d2l-button-iterator>`,
	disabledPrev: html`<d2l-button-iterator previous-disabled></d2l-button-iterator>`,
	nextOnly: html`<d2l-button-iterator next-only></d2l-button-iterator>`
};
