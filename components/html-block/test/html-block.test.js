import '../html-block.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { provideInstance } from '../../../mixins/provider/provider-mixin.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

class TestRenderer {
	async render(elem) {
		const elemsToReplace = elem.querySelectorAll('[data-replace-id]');
		if (elemsToReplace.length === 0) return elem;

		elemsToReplace.forEach(elemToReplace => {
			const someId = elemToReplace.getAttribute('data-replace-id');
			if (!someId) return;
			elemToReplace.innerText = someId;
		});

		// just for test so it can wait
		setTimeout(() => {
			document.dispatchEvent(new CustomEvent('d2l-test-replacement-complete'));
		}, 0);

		return elem;
	}
}

class TestAsyncRenderer {
	async render(elem) {
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
			if (!someId) return;
			elemToReplace.innerText = `${someId}: ${asyncValue}`;
		});

		// Don't need a setTimeout because this renderer is already async.
		document.dispatchEvent(new CustomEvent('d2l-test-replacement-complete'));
		return elem;
	}
}

class TestNoInlineRenderer {
	async render(elem, options) {
		if (options.noDeferredRendering) return elem;

		const elemsToReplace = elem.querySelectorAll('[data-no-inline-replace-id]');
		if (elemsToReplace.length === 0) return elem;

		elemsToReplace.forEach(elemToReplace => elemToReplace.remove());

		// just for test so it can wait
		setTimeout(() => {
			document.dispatchEvent(new CustomEvent('d2l-test-replacement-complete'));
		}, 0);

		return elem;
	}
}

class TestSecondaryRenderer {
	async render(elem) {
		const elemsToReplace = elem.querySelectorAll('[data-secondary-replace-id]');
		if (elemsToReplace.length === 0) return elem;

		elemsToReplace.forEach(elemToReplace => {
			const someId = elemToReplace.getAttribute('data-secondary-replace-id');
			if (!someId) return;
			elemToReplace.innerText = `${someId}: secondary`;
		});

		// just for test so it can wait
		setTimeout(() => {
			document.dispatchEvent(new CustomEvent('d2l-test-secondary-replacement-complete'));
		}, 0);

		return elem;
	}
}

provideInstance(document, 'html-block-renderer-loader', {
	getRenderers() {
		return [
			new TestRenderer(),
			new TestAsyncRenderer(),
			new TestNoInlineRenderer(),
			new TestSecondaryRenderer()
		];
	}
});

describe('d2l-html-block', () => {

	const emptyReplacementFixture = html`
		<d2l-html-block></d2l-html-block>
	`;
	const replacementFixture = html`
		<d2l-html-block>
			<span data-replace-id="1">first</span><span data-replace-id="2">second</span>
		</d2l-html-block>
	`;
	const asyncReplacementFixture = html`
		<d2l-html-block>
			<span data-async-replace-id="1">first</span><span data-async-replace-id="2">second</span>
		</d2l-html-block>
	`;
	const noDeferredRenderingReplacementFixture = html`
		<d2l-html-block no-deferred-rendering>
			<div><span data-replace-id="1">first</span><span data-no-inline-replace-id="2">second</span></div>
		</d2l-html-block>
	`;
	const multipleRendererReplacementsFixture = html`
		<d2l-html-block>
			<span data-replace-id="1">first</span><span data-secondary-replace-id="2">second</span>
		</d2l-html-block>
	`;

	it('should construct', () => {
		runConstructor('d2l-html-block');
	});

	it('should not explode if no replacements', async() => {
		const htmlBlock = await fixture(emptyReplacementFixture);
		// Wait a frame for rendering to finish, since we temporarily add elements to the DOM
		requestAnimationFrame(() => {
			expect(htmlBlock.shadowRoot.querySelector('.d2l-html-block-rendered').innerHTML)
				.to.equal('');
		});
	});

	it('should do replacements', async() => {
		const replacementComplete = oneEvent(document, 'd2l-test-replacement-complete');
		const htmlBlock = await fixture(replacementFixture);
		await replacementComplete;
		const spans = htmlBlock.shadowRoot.querySelectorAll('span');
		expect(spans[0].innerHTML).to.equal('1');
		expect(spans[1].innerHTML).to.equal('2');
	});

	it('should do async replacements', async() => {
		const replacementComplete = oneEvent(document, 'd2l-test-replacement-complete');
		const htmlBlock = await fixture(asyncReplacementFixture);
		await replacementComplete;
		const spans = htmlBlock.shadowRoot.querySelectorAll('span');
		expect(spans[0].innerHTML).to.equal('1: async value');
		expect(spans[1].innerHTML).to.equal('2: async value');
	});

	it('should do inline replacements only when not deferred', async() => {
		const replacementComplete = oneEvent(document, 'd2l-test-replacement-complete');
		const htmlBlock = await fixture(noDeferredRenderingReplacementFixture);
		await replacementComplete;
		const spans = htmlBlock.querySelectorAll('span');
		expect(spans[0].innerHTML).to.equal('1');
		expect(spans[1].innerHTML).to.equal('second');
	});

	it('should do multiple renderer replacements', async() => {
		const replacementComplete = Promise.all([
			oneEvent(document, 'd2l-test-replacement-complete'),
			oneEvent(document, 'd2l-test-secondary-replacement-complete')
		]);
		const htmlBlock = await fixture(multipleRendererReplacementsFixture);
		await replacementComplete;
		const spans = htmlBlock.shadowRoot.querySelectorAll('span');
		expect(spans[0].innerHTML).to.equal('1');
		expect(spans[1].innerHTML).to.equal('2: secondary');
	});

});
