import '../input-search.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`<d2l-input-search label="search"></d2l-input-search>`;
const valueSetFixture = html`<d2l-input-search value="foo"></d2l-input-search>`;
const noClearFixture = html`<d2l-input-search value="foo" no-clear></d2l-input-search>`;

describe('d2l-input-search', () => {

	function assertSearchVisibility(elem, isVisible) {
		const visibleButton = elem.shadowRoot.querySelector('d2l-button-icon');
		if (isVisible) {
			expect(visibleButton.getAttribute('icon')).to.equal('tier1:search');
		} else {
			expect(visibleButton.getAttribute('icon')).to.equal('tier1:close-default');
		}
	}

	function getClearButton(elem) {
		return elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:close-default"]');
	}

	function getSearchButton(elem) {
		return elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:search"]');
	}

	function pressEnter(elem) {
		const event = new CustomEvent('keypress', {
			detail: 0,
			bubbles: true,
			cancelable: true,
			composed: true
		});
		event.keyCode = 13;
		event.code = 13;
		elem.shadowRoot.querySelector('.d2l-input').dispatchEvent(event);
	}

	describe('accessibility', () => {

		it('should pass all aXe tests (normal)', async() => {
			const elem = await fixture(normalFixture);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (with value)', async() => {
			const elem = await fixture(valueSetFixture);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (disabled)', async() => {
			const elem = await fixture(html`<d2l-input-search label="search" disabled></d2l-input-search>`);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (invalid)', async() => {
			const elem = await fixture(html`<d2l-input-search label="search" aria-invalid="true"></d2l-input-search>`);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (focused)', async() => {
			const elem = await fixture(normalFixture);
			elem.focus();
			await expect(elem).to.be.accessible();
		});

	});

	describe('default property values', () => {

		it('should default "disabled" to false', async() => {
			const elem = await fixture(normalFixture);
			expect(elem.disabled).to.be.false;
		});

		it('should default "noClear" to false', async() => {
			const elem = await fixture(normalFixture);
			expect(elem.noClear).to.be.false;
		});

	});

	describe('value and lastSearchValue', () => {

		it('should default both to empty string', async() => {
			const elem = await fixture(normalFixture);
			expect(elem.value).to.equal('');
			expect(elem.lastSearchValue).to.equal('');
		});

		it('should initially match lastSearchValue with value', async() => {
			const elem = await fixture(valueSetFixture);
			expect(elem.value).to.equal('foo');
			expect(elem.lastSearchValue).to.equal('foo');
		});

		it('should not persist value to lastSearchValue', async() => {
			const elem = await fixture(normalFixture);
			elem.value = 'bar';
			await elem.updateComplete;
			expect(elem.lastSearchValue).to.equal('');
		});

		it('should persist value to lastSearchValue when search is performed', async() => {
			const elem = await fixture(normalFixture);
			elem.value = 'bar';
			await elem.updateComplete;
			getSearchButton(elem).click();
			await elem.updateComplete;
			expect(elem.value).to.equal('bar');
			expect(elem.lastSearchValue).to.equal('bar');
		});

		it('should clear both when cleared', async() => {
			const elem = await fixture(valueSetFixture);
			getClearButton(elem).click();
			await elem.updateComplete;
			expect(elem.value).to.equal('');
			expect(elem.lastSearchValue).to.equal('');
		});

		it('should ignore lastSearchValue setter', async() => {
			const elem = await fixture(valueSetFixture);
			elem.lastSearchValue = 'new value';
			expect(elem.lastSearchValue).to.equal('foo');
		});

	});

	describe('search & clear button visibility', () => {

		it('should show search if no value is set', async() => {
			const elem = await fixture(normalFixture);
			assertSearchVisibility(elem, true);
		});

		[undefined, null, ''].forEach((val) => {
			it(`should show search if "${val}" value is set`, async() => {
				const elem = await fixture(normalFixture);
				elem.value = val;
				await elem.updateComplete;
				assertSearchVisibility(elem, true);
			});
		});

		it('should show clear if a value is set', async() => {
			const elem = await fixture(valueSetFixture);
			assertSearchVisibility(elem, false);
		});

		it('should NOT show clear if value is set in no-clear mode', async() => {
			const elem = await fixture(noClearFixture);
			assertSearchVisibility(elem, true);
		});

		it('should show search if value is modified', async() => {
			const elem = await fixture(valueSetFixture);
			elem.value = 'foobar';
			await elem.updateComplete;
			assertSearchVisibility(elem, true);
		});

		it('should show search if value is cleared', async() => {
			const elem = await fixture(valueSetFixture);
			getClearButton(elem).click();
			await elem.updateComplete;
			assertSearchVisibility(elem, true);
		});

		it('should show search if empty search is performed', async() => {
			const elem = await fixture(normalFixture);
			getSearchButton(elem).click();
			assertSearchVisibility(elem, true);
		});

		it('should show clear if modified value is searched', async() => {
			const elem = await fixture(valueSetFixture);
			elem.value = 'foobar';
			await elem.updateComplete;
			getSearchButton(elem).click();
			await elem.updateComplete;
			assertSearchVisibility(elem, false);
		});

		it('should NOT show clear if modified value is searched in no-clear mode', async() => {
			const elem = await fixture(noClearFixture);
			elem.value = 'foobar';
			getSearchButton(elem).click();
			await elem.updateComplete;
			assertSearchVisibility(elem, true);
		});

	});

	describe('events', () => {

		it('should fire "search" event when search button is clicked', async() => {
			const elem = await fixture(normalFixture);
			elem.value = 'bar';
			setTimeout(() => getSearchButton(elem).click());
			const { detail } = await oneEvent(elem, 'd2l-input-search-searched');
			expect(detail.value).to.equal('bar');
		});

		it('should fire "search" event when ENTER is pressed', async() => {
			const elem = await fixture(normalFixture);
			elem.value = 'bar';
			setTimeout(() => pressEnter(elem));
			const { detail } = await oneEvent(elem, 'd2l-input-search-searched');
			expect(detail.value).to.equal('bar');
		});

		it('should fire "search" event when clear button is pressed', async() => {
			const elem = await fixture(valueSetFixture);
			setTimeout(() => getClearButton(elem).click());
			const { detail } = await oneEvent(elem, 'd2l-input-search-searched');
			expect(detail.value).to.equal('');
		});

		it('should fire "search" event on empty value search', async() => {
			const elem = await fixture(valueSetFixture);
			elem.value = '';
			await elem.updateComplete;
			setTimeout(() => getSearchButton(elem).click());
			const { detail } = await oneEvent(elem, 'd2l-input-search-searched');
			expect(detail.value).to.equal('');
		});

	});

});
