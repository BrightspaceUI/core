import '../html-block.js';
import '../../../tools/mathjax-test-context.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const content = `
	Just a text node...
	<h1>heading 1</h1>
	<h2>heading 2</h2>
	<h3>heading 3</h3>
	<h4>heading 4</h4>
	<h5>heading 5</h5>
	<h6>heading 6</h6>
	<div><strong>strong</strong></div>
	<div><b>bold</b></div>
	<div>text</div>
	<pre>preformatted</pre>
	<p>paragraph</p>
	<ul>
		<li>unordered item 1</li>
		<li>unordered item 2</li>
	</ul>
	<ol>
		<li>ordered item 1</li>
		<li>ordered item 2</li>
	</ol>
	<div><a href="https://d2l.com">anchor</a></div>
	<p dir="rtl">rtl paragraph</p>
`;

describe('d2l-html-block', () => {

	const viewport = { width: 376 };

	it('empty', async() => {
		const elem = await fixture(html`<d2l-html-block></d2l-html-block>`, { viewport });
		await expect(elem).to.be.golden();
	});

	['print', 'screen'].forEach((media) => {
		it(`typography-${media}`, async() => {
			const elem = await fixture(
				html`<d2l-html-block html="${content}"></d2l-html-block>`,
				{ media, viewport }
			);
			await expect(elem).to.be.golden();
		});
	});

	it('compact', async() => {
		const elem = await fixture(html`<d2l-html-block html="${content}" compact></d2l-html-block>`, { viewport });
		await expect(elem).to.be.golden();
	});

	/*it('inline', async() => {
		const elem = await fixture(html`
			<div style="width: 500px;">
				<span>Here's an inline html-block:</span>
				<d2l-html-block inline html="I'm inline!"></d2l-html-block>
				<span>Pretty cool!</span>
			</div>
		`, { viewport });
		await expect(elem).to.be.golden();
	});*/

	/*[
		{ name: 'inline-no-deferred-rendering', selector: '#inline-no-deferred-rendering' },
		{ name: 'large-font-size', selector: '#large-font-size' },
		{ name: 'overflowing', selector: '#overflowing' },
		{ name: 'update-content', selector: '#update-content', action: selector => page.$eval(selector, elem => elem.html = 'after update') },
		{ name: 'math (block)', selector: '#math-block' },
		{ name: 'math (inline)', selector: '#math-inline' },
		{ name: 'code (block)', selector: '#code-block' },
		{ name: 'code (inline)', selector: '#code-inline' },
		{ name: 'math (block) and code (block)', selector: '#math-block-and-code-block' }
	].forEach((info) => {

		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await new Promise(resolve => setTimeout(resolve, 0));
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});*/

});
