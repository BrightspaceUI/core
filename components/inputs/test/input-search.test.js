import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { INPUT_TIMEOUT_MS, SUPPRESS_ENTER_TIMEOUT_MS } from '../input-search.js';
import { useFakeTimers } from 'sinon';

const normalFixture = html`<d2l-input-search label="search"></d2l-input-search>`;
const valueSetFixture = html`<d2l-input-search label="search" value="foo"></d2l-input-search>`;
const noClearFixture = html`<d2l-input-search label="search" value="foo" no-clear></d2l-input-search>`;
const searchOnInputFixture = html`<d2l-input-search label="search" value="foo" search-on-input></d2l-input-search>`;

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

function getTextInput(elem) {
	return elem.shadowRoot.querySelector('d2l-input-text');
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
	elem.shadowRoot.querySelector('d2l-input-text').dispatchEvent(event);
}

describe('d2l-input-search', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-search');
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

		describe('fake timer', () => {

			let clock;
			beforeEach(() => {
				clock = useFakeTimers({ toFake: ['clearTimeout', 'setTimeout'] });
			});

			afterEach(() => clock.restore());

			it('should fire "search" event when search input changes in search-on-input mode', async() => {
				const elem = await fixture(searchOnInputFixture);
				let detail;
				elem.addEventListener('d2l-input-search-searched', (e) => detail = e.detail);
				getTextInput(elem).value = 'foobar';
				getTextInput(elem).dispatchEvent(new Event('input'));
				clock.tick(INPUT_TIMEOUT_MS + 1);
				expect(detail.value).to.equal('foobar');
			});

			it('should fire "search" event only once after two consecutive input events', async() => {
				const elem = await fixture(searchOnInputFixture);
				let searchEventsFired = 0;
				elem.addEventListener('d2l-input-search-searched', () => searchEventsFired += 1);
				getTextInput(elem).dispatchEvent(new Event('input'));
				getTextInput(elem).dispatchEvent(new Event('input'));
				clock.tick(INPUT_TIMEOUT_MS);
				expect(searchEventsFired).to.equal(1);
			});

			it('should NOT fire "search" event when ENTER is pressed twice within 1s', async() => {
				const elem = await fixture(normalFixture);
				let searchEventsFired = 0;
				elem.addEventListener('d2l-input-search-searched', () => searchEventsFired += 1);
				pressEnter(elem);
				pressEnter(elem);
				expect(searchEventsFired).to.equal(1);
			});

			it('should fire "search" event when ENTER is pressed twice within 1s but value changes in between', async() => {
				const elem = await fixture(normalFixture);
				let searchEventsFired = 0;
				elem.addEventListener('d2l-input-search-searched', () => searchEventsFired += 1);
				pressEnter(elem);
				elem.value = 'newval';
				pressEnter(elem);
				expect(searchEventsFired).to.equal(2);
			});

			it('should fire "search" event when ENTER is pressed twice after 1s', async() => {
				const elem = await fixture(normalFixture);
				let searchEventsFired = 0;
				elem.addEventListener('d2l-input-search-searched', () => searchEventsFired += 1);
				pressEnter(elem);
				clock.tick(SUPPRESS_ENTER_TIMEOUT_MS);
				pressEnter(elem);
				expect(searchEventsFired).to.equal(2);
			});

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

});
