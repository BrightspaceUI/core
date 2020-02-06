import '../link.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';

const normalFixture = html`<d2l-link href="https://www.d2l.com">Link Test</d2l-link>`;

function getAnchor(elem) {
	return elem.shadowRoot.querySelector('a');
}

describe('d2l-link', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const elem = await fixture(normalFixture);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (main)', async() => {
			const elem = await fixture(html`<d2l-link main>Main Link</d2l-link>`);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (small)', async() => {
			const elem = await fixture(html`<d2l-link small>Small Link</d2l-link>`);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (focused)', async() => {
			const elem = await fixture(normalFixture);
			setTimeout(() => getAnchor(elem).focus());
			await oneEvent(elem, 'focus');
			await expect(elem).to.be.accessible();
		});

	});

	describe('attribute binding', () => {

		['download', 'href', 'main', 'small'].forEach((attrName) => {
			it(`should bind "${attrName}" attribute to anchor attribute`, async() => {
				const elem = await fixture(normalFixture);
				elem.setAttribute(attrName, attrName);
				await elem.updateComplete;
				expect(getAnchor(elem).hasAttribute(attrName)).to.be.true;
			});
		});

		it('should bind "aria-label" attribute to anchor attribute', async() => {
			const elem = await fixture(html`<d2l-link aria-label="My Aria Label"></d2l-link>`);
			expect(getAnchor(elem).getAttribute('aria-label')).to.equal('My Aria Label');
		});

		it('should bind "href" attribute to anchor attribute', async() => {
			const elem = await fixture(html`<d2l-link href="https://www.d2l.com"></d2l-link>`);
			expect(getAnchor(elem).getAttribute('href')).to.equal('https://www.d2l.com');
		});

		it('should bind "target" attribute to anchor attribute', async() => {
			const elem = await fixture(html`<d2l-link target="_blank"></d2l-link>`);
			expect(getAnchor(elem).getAttribute('target')).to.equal('_blank');
		});

	});

	describe('attribute reflection', () => {

		['main', 'small'].forEach((attrName) => {
			it(`should reflect "${attrName}" property to attribute`, async() => {
				const elem = await fixture(normalFixture);
				elem[attrName] = true;
				await elem.updateComplete;
				expect(elem.hasAttribute(attrName)).to.be.true;
			});
		});

	});

	describe('default property values', () => {

		['main', 'small'].forEach((attrName) => {
			it(`should default "${attrName}" property to false when unset`, async() => {
				const elem = await fixture(normalFixture);
				expect(elem[attrName]).to.be.false;
				expect(elem.hasAttribute(attrName)).to.be.false;
			});
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const elem = await fixture(html`<d2l-link></d2l-link>`);
			setTimeout(() => getAnchor(elem).click());
			const { target } = await oneEvent(elem, 'click');
			expect(target).to.equal(elem);
		});

	});

	describe('focus management', () => {

		it('should delegate focus to underlying anchor', async() => {
			const elem = await fixture(normalFixture);
			elem.focus();
			const activeElement = getComposedActiveElement();
			expect(activeElement).to.equal(getAnchor(elem));
		});

	});

});
