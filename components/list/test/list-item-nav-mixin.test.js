import '../list.js';
import '../list-item-nav.js';
import { defineCE, expect, fixture, oneEvent, waitUntil } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { ListItemNavMixin } from '../list-item-nav-mixin.js';

const tag = defineCE(
	class extends ListItemNavMixin(LitElement) {
		render() {
			return html`
				${this._renderListItem()}
			`;
		}
	}
);

describe('ListItemNavMixin', () => {

	describe('aria-current', () => {
		it('sets aria-current to "page"" when current attribute is set', async() => {
			const element = await fixture(`<${tag} current label="some label"></${tag}>`);
			await element.updateComplete;
			expect(element.current).to.be.true;
			const button = element.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-current')).to.equal('page');
		});

		it('does not have aria-current set when current attribute is removed', async() => {
			const element = await fixture(`<${tag} current label="some label"></${tag}>`);
			element.removeAttribute('current');
			await element.updateComplete;
			expect(element.current).to.be.false;
			const button = element.shadowRoot.querySelector('button');
			expect(button.hasAttribute('aria-current')).to.be.false;
		});

		it('sets aria-current to "location" when _childCurrent is true', async() => {
			const element = await fixture(`<${tag} label="some label"></${tag}>`);
			element._childCurrent = true;
			await element.updateComplete;
			const button = element.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-current')).to.equal('location');
		});

		it('does not have aria-current set when _childCurrent is false', async() => {
			const element = await fixture(`<${tag} label="some label"></${tag}>`);
			element._childCurrent = false;
			await element.updateComplete;
			const button = element.shadowRoot.querySelector('button');
			expect(button.hasAttribute('aria-current')).to.be.false;
		});
	});

	describe('events', () => {
		it('dispatches d2l-list-item-nav-set-child-current when current is initially set', async() => {
			let e = null;
			document.addEventListener('d2l-list-item-nav-set-child-current', (event) => {
				e = event;
			});
			await fixture(`<${tag} label="some label" current></${tag}>`);
			expect(e.detail.value).to.be.true;
		});

		it('does not dispatch d2l-list-item-nav-set-child-current when current is subsequently set', async() => {
			let dispatched = false;
			const element = await fixture(`<${tag} label="some label"></${tag}>`);
			element.addEventListener('d2l-list-item-nav-set-child-current', () => dispatched = true);
			element.current = true;
			await element.updateComplete;
			expect(dispatched).to.be.false;
		});

		it('dispatches d2l-list-item-nav-set-child-current when dispatchSetChildCurrentEvent is called with param true', async() => {
			const element = await fixture(`<${tag} label="some label"></${tag}>`);
			setTimeout(() => element.dispatchSetChildCurrentEvent(true));
			const e = await oneEvent(element, 'd2l-list-item-nav-set-child-current');
			expect(e.detail.value).to.be.true;
		});

		it('dispatches d2l-list-item-nav-set-child-current when dispatchSetChildCurrentEvent is called with param false', async() => {
			const element = await fixture(`<${tag} label="some label"></${tag}>`);
			setTimeout(() => element.dispatchSetChildCurrentEvent(false));
			const e = await oneEvent(element, 'd2l-list-item-nav-set-child-current');
			expect(e.detail.value).to.be.false;
		});

		it('dispatches d2l-list-item-property-change when current is subsequently set', async() => {
			const element = await fixture(`<${tag} label="some label"></${tag}>`);
			await element.updateComplete;
			setTimeout(() => element.current = true);
			const e = await oneEvent(element, 'd2l-list-item-property-change');
			expect(e.detail.name).to.equal('current');
			expect(e.detail.value).to.be.true;
		});

		it('dispatches d2l-list-item-property-change when current is subsequently removed', async() => {
			const element = await fixture(`<${tag} label="some label" current></${tag}>`);
			await element.updateComplete;
			setTimeout(() => element.current = false);
			const e = await oneEvent(element, 'd2l-list-item-property-change');
			expect(e.detail.name).to.equal('current');
			expect(e.detail.value).to.be.false;
		});

		it('does not dispatch d2l-list-item-property-change when current is initially set', async() => {
			let dispatched = false;
			const element = await fixture(`<${tag} label="some label" current></${tag}>`);
			element.addEventListener('d2l-list-item-property-change', () => dispatched = true);
			await element.updateComplete;
			expect(dispatched).to.be.false;
		});
	});

	describe('in list', () => {
		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-list label="some label">
					<d2l-list-item-nav id="a1" label="a1">
						<d2l-list slot="nested">
							<d2l-list-item-nav id="a1-1" label="a1-1">
								<d2l-list slot="nested">
									<d2l-list-item-nav id="a1-1-1" label="a1-1-1" current></d2l-list-item-nav>
									<d2l-list-item-nav id="a1-1-2" label="a1-1-2"></d2l-list-item-nav>
								</d2l-list>
							</d2l-list-item-nav>
							<d2l-list-item-nav id="a1-2" label="a1-2"></d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
					<d2l-list-item-nav id="a2" label="a2">
						<d2l-list slot="nested">
							<d2l-list-item-nav id="a2-1" label="a2-1"></d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
					<d2l-list-item-nav id="a3" label="a3"></d2l-list-item-nav>
				</d2l-list>
			`);
			await elem.updateComplete;
		});

		function checkAriaCurrent(expectedPage, expectedLocations) {
			const navItems = elem.querySelectorAll('d2l-list-item-nav');
			navItems.forEach((item) => {
				const button = item.shadowRoot.querySelector('button');
				if (item.id === expectedPage) {
					expect(item.current).to.be.true;
					expect(item._childCurrent).to.be.false;
					expect(button.getAttribute('aria-current')).to.equal('page');
				} else if (expectedLocations.includes(item.id)) {
					expect(item.current).to.be.false;
					expect(item._childCurrent).to.be.true;
					expect(button.getAttribute('aria-current')).to.equal('location');
				} else {
					expect(item.current).to.be.false;
					expect(item._childCurrent).to.be.false;
					expect(button.hasAttribute('aria-current')).to.be.false;
				}
			});
		}

		it('has correct aria-current states on initial load', async() => {
			checkAriaCurrent('a1-1-1', ['a1-1', 'a1']);
		});

		it('has correct aria-current states when sibling item gets selected', async() => {
			let eventCount = 0;
			elem.addEventListener('d2l-list-item-nav-set-child-current', () => {
				eventCount++;
			});
			setTimeout(() => elem.querySelector('#a1-1-2').current = true);
			await waitUntil(() => eventCount === 2, 'event did not fire twice');
			checkAriaCurrent('a1-1-2', ['a1-1', 'a1']);
		});

		it('has correct aria-current states when parent item gets selected', async() => {
			let eventCount = 0;
			elem.addEventListener('d2l-list-item-nav-set-child-current', () => {
				eventCount++;
			});
			setTimeout(() => elem.querySelector('#a1-1').current = true);
			await waitUntil(() => eventCount === 2, 'event did not fire twice');
			checkAriaCurrent('a1-1', ['a1']);
		});

		it('has correct aria-current states when root item gets selected', async() => {
			let eventCount = 0;
			elem.addEventListener('d2l-list-item-nav-set-child-current', () => {
				eventCount++;
			});
			setTimeout(() => elem.querySelector('#a1').current = true);
			await waitUntil(() => eventCount === 2, 'event did not fire twice');
			checkAriaCurrent('a1', []);
		});

		it('has correct aria-current states when item in different list gets selected', async() => {
			let eventCount = 0;
			elem.addEventListener('d2l-list-item-nav-set-child-current', () => {
				eventCount++;
			});
			setTimeout(() => elem.querySelector('#a2-1').current = true);
			await waitUntil(() => eventCount === 2, 'event did not fire twice');
			checkAriaCurrent('a2-1', ['a2']);
		});

		it('has correct aria-current states when item has current removed', async() => {
			let eventCount = 0;
			elem.addEventListener('d2l-list-item-nav-set-child-current', () => {
				eventCount++;
			});
			elem.querySelector('#a1-1-1').current = false;
			await waitUntil(() => eventCount === 1, 'event never fired');
			checkAriaCurrent(null, []);
		});
	});
});
