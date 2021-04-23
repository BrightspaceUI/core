import '../html-block.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { provideInstance } from '../../../mixins/provider-mixin.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

provideInstance(document, 'html-block-renderers', [
	async elem => {

		const elemsToReplace = elem.querySelectorAll('[data-replace-id]');
		if (elemsToReplace.length === 0) return elem;

		elemsToReplace.forEach(elemToReplace => {
			const someId = elemToReplace.getAttribute('data-replace-id');
			elemToReplace.removeAttribute('data-replace-id');
			if (!someId) return;
			elemToReplace.innerText = someId;
		});

		return elem;

	},
	async elem => {

		const elemsToReplace = elem.querySelectorAll('[data-async-replace-id]');
		if (elemsToReplace.length === 0) return elem;

		// simulate async task such as loading a dependency
		const asyncValue = await new Promise(resolve => {
			setTimeout(() => {
				resolve('async value');
			}, 50);
		});

		elemsToReplace.forEach(elemToReplace => {
			const someId = elemToReplace.getAttribute('data-async-replace-id');
			elemToReplace.removeAttribute('data-async-replace-id');
			if (!someId) return;
			elemToReplace.innerText = `${someId}: ${asyncValue}`;
		});

		// just for test so it can wait
		setTimeout(() => {
			document.dispatchEvent(new CustomEvent('d2l-test-replacement-complete'));
		}, 0);

		return elem;

	}
]);

describe('d2l-html-block', () => {

	const emptyReplacementFixture = html`
		<d2l-html-block>
			<template></template>
		</d2l-html-block>
	`;

	const replacementFixture = html`
		<d2l-html-block>
			<template><span data-replace-id="1">first</span><span data-replace-id="2">second</span></template>
		</d2l-html-block>
	`;
	const asyncReplacementFixture = html`
		<d2l-html-block>
			<template><span data-async-replace-id="1">first</span><span data-async-replace-id="2">second</span></template>
		</d2l-html-block>
	`;

	it('should construct', () => {
		runConstructor('d2l-html-block');
	});

	it('should not explode if no replacements', async() => {
		const htmlBlock = await fixture(emptyReplacementFixture);
		await htmlBlock.updateComplete; // legacy edge
		expect(htmlBlock.shadowRoot.querySelector('.d2l-html-block-rendered').innerHTML)
			.to.equal('');
	});

	it('should do replacements', async() => {
		const htmlBlock = await fixture(replacementFixture);
		await htmlBlock.updateComplete; // legacy edge
		expect(htmlBlock.shadowRoot.querySelector('.d2l-html-block-rendered').innerHTML)
			.to.equal('<span>1</span><span>2</span>');
	});

	it('should do async replacements', async() => {
		const htmlBlock = await fixture(asyncReplacementFixture);
		await oneEvent(document, 'd2l-test-replacement-complete');
		expect(htmlBlock.shadowRoot.querySelector('.d2l-html-block-rendered').innerHTML)
			.to.equal('<span>1: async value</span><span>2: async value</span>');
	});

});
