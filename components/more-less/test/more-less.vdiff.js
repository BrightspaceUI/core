import '../more-less.js';
import { clickElem, expect, fixture, focusElem, html, nextFrame, sendKeys } from '@brightspace-ui/testing';
import { nothing } from 'lit';

const viewport = { width: 326 };

const content = (withLink = false) => html`
	<p>${withLink ? html`<a href="https://d2l.com">d2l</a> ` : nothing}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.${withLink ? html`<br><br><a href="https://d2l.com">d2l</a> ` : nothing}</p>
`;

describe('more-less', () => {
	it('collapsed', async() => {
		const elem = await fixture(html`<d2l-more-less>${content()}</d2l-more-less>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('expands on click', async() => {
		const elem = await fixture(html`<d2l-more-less>${content()}</d2l-more-less>`, { viewport });
		await clickElem(elem.shadowRoot.querySelector('d2l-button-subtle'));
		await expect(elem).to.be.golden();
	});

	it('expanded', async() => {
		const elem = await fixture(html`<d2l-more-less expanded>${content()}</d2l-more-less>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('collapses on click', async() => {
		const elem = await fixture(html`<d2l-more-less expanded>${content()}</d2l-more-less>`, { viewport });
		await clickElem(elem.shadowRoot.querySelector('d2l-button-subtle'));
		await expect(elem).to.be.golden();
	});

	it('grows with content when expanded', async() => {
		const elem = await fixture(html`<d2l-more-less expanded>${content()}</d2l-more-less>`, { viewport });
		elem.querySelector('p').textContent += 'Some content appended after component first render.';
		await nextFrame();
		await expect(elem).to.be.golden();
	});

	it('does not grow with content when collapsed', async() => {
		const elem = await fixture(html`<d2l-more-less>${content()}</d2l-more-less>`, { viewport });
		elem.querySelector('p').textContent += 'Some content appended after component first render.';
		await nextFrame();
		await expect(elem).to.be.golden();
	});

	it('auto-expands on focus-in when scrolled', async() => {
		const elem = await fixture(html`<d2l-more-less>${content({ withLinks: true })}</d2l-more-less>`, { viewport });
		await focusElem(elem.querySelectorAll('a')[1]);
		await expect(elem).to.be.golden();
	});

	it('does not auto-expand on focus-in when not scrolled', async() => {
		const elem = await fixture(html`<d2l-more-less>${content({ withLinks: true })}</d2l-more-less>`, { viewport });
		await focusElem(elem.querySelector('a'));
		await expect(elem).to.be.golden();
	});

	it('auto-collapses on focus-out', async() => {
		const elem = await fixture(html`<d2l-more-less>${content({ withLinks: true })}</d2l-more-less>`, { viewport });
		await focusElem(elem.querySelectorAll('a')[1]);
		await sendKeys('press', 'Shift+Tab');
		await sendKeys('press', 'Shift+Tab');
		await expect(elem).to.be.golden();
	});

	it('does not auto-collapse on focus-out when still active', async() => {
		const elem = await fixture(html`<d2l-more-less>${content({ withLinks: true })}</d2l-more-less>`, { viewport });
		await focusElem(elem.querySelectorAll('a')[1]);
		await sendKeys('press', 'Shift+Tab');
		await expect(elem).to.be.golden();
	});

	it('with custom height', async() => {
		const elem = await fixture(html`<d2l-more-less height="3em">${content()}</d2l-more-less>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('with custom blur', async() => {
		const elem = await fixture(html`<d2l-more-less blur-color="#f00">${content()}</d2l-more-less>`, { viewport });
		await expect(elem).to.be.golden();
	});
});
