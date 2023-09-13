import '../link.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`<d2l-link href="https://www.d2l.com">Link Test</d2l-link>`;

function getAnchor(elem) {
	return elem.shadowRoot.querySelector('a');
}

describe('d2l-link', () => {

	describe('attribute binding', () => {

		['download', 'href'].forEach((attrName) => {
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

		it('should bind "main" attribute to CSS class', async() => {
			const elem = await fixture(html`<d2l-link main>Link</d2l-link>`);
			expect(getAnchor(elem).classList.contains('d2l-link-main')).to.be.true;
		});

		it('should bind "small" attribute to CSS class', async() => {
			const elem = await fixture(html`<d2l-link small>Link</d2l-link>`);
			expect(getAnchor(elem).classList.contains('d2l-link-small')).to.be.true;
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

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-link');
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

	describe('new-window', () => {
		it('should add new window icon', async() => {
			const elem = await fixture(html`<d2l-link new-window></d2l-link>`);
			expect(elem.shadowRoot.querySelector('d2l-icon')).to.exist;
		});

		it('should bind _blank to anchor target', async() => {
			const elem = await fixture(html`<d2l-link new-window></d2l-link>`);
			expect(getAnchor(elem).getAttribute('target')).to.equal('_blank');
		});

		it('should add hidden span new window term for screen readers', async() => {
			const elem = await fixture(html`<d2l-link new-window></d2l-link>`);
			expect(getAnchor(elem).querySelector('span').innerText).to.equal('Opens in a new window.');
		});
	});

});
