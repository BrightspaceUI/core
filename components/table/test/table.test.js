import '../table-col-sort-button.js';
import '../table-col-sort-button-item.js';
import '../table-controls.js';
import '../demo/table-test.js';
import { defineCE, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { tableStyles } from '../table-wrapper.js';

const tag = defineCE(
	class extends LitElement {
		static get properties() {
			return { _data: { state: true } };
		}
		static get styles() { return [tableStyles]; }

		constructor() {
			super();
			this._data = [
				{ name: 'Row 1', selected: true },
				{ name: 'Row 2', selected: false }
			];
		}

		render() {
			return html`<d2l-table-wrapper>
				<table class="d2l-table">
					<thead><tr>
						<th>Header</th>
					</tr></thead>
					<tbody>
						${this._data.map(row => html`<tr ?selected="${row.selected}" data-name="${row.name}">
								<td>${row.name}</td>
							</tr>`)}
					</tbody>
				</table>
			<d2l-table-wrapper>`;
		}

		_loadItemsAsync() {
			const startIndex = this._data.length + 1;
			for (let i = 0; i < 5; i++) {
				setTimeout(() => {
					this._data.push({ name: `Row ${startIndex + i}`, selected: false });
					this.requestUpdate();
				}, 100 + Math.random() * 200);
			}
		}
	}
);

describe('d2l-table-wrapper', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-table-wrapper');
		});
	});

	describe('body class', () => {

		afterEach(() => {
			document.body.classList.remove('d2l-table-sticky-headers');
		});

		it('should add class to body when sticky', async() => {
			await fixture(html`<d2l-table-wrapper sticky-headers></d2l-table-wrapper>`);
			expect(document.body.classList.contains('d2l-table-sticky-headers')).to.be.true;
		});

		it('should not add class to body when not sticky', async() => {
			await fixture(html`<d2l-table-wrapper></d2l-table-wrapper>`);
			expect(document.body.classList.contains('d2l-table-sticky-headers')).to.be.false;
		});

	});

	describe('popover', () => {

		const tagName = defineCE(
			class extends LitElement {
				static get properties() {
					return {
						stickyHeaders: { type: Boolean, reflect: true, attribute: 'sticky-headers' }
					};
				}
				static get styles() {
					return tableStyles;
				}
				render() {
					return html`
						<d2l-table-wrapper ?sticky-headers="${this.stickyHeaders}">
							<table class="d2l-table">
								<thead>
									<tr>
										<th><span id="some-popover"></span></th>
									</tr>
								</thead>
							</table>
						</d2l-table-wrapper>
					`;
				}
			}
		);

		it('should not set data-popover-count attribute when not sticky and popover opens', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.be.null;
		});

		it('should not set data-popover-count attribute when not sticky and popover closes', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-close', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.be.null;
		});

		it('should increment data-popover-count attribute when sticky and popover opens', async() => {
			const el = await fixture(`<${tagName} sticky-headers></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.equal('2');
		});

		it('should decrement data-popover-count attribute when sticky and popover closes', async() => {
			const el = await fixture(`<${tagName} sticky-headers></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.equal('2');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-close', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.equal('1');
		});

		it('should remove data-popover-count attribute when sticky and all popovers are closed', async() => {
			const el = await fixture(`<${tagName} sticky-headers></${tagName}>`);
			const popoverElement = el.shadowRoot.querySelector('#some-popover');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.equal('1');
			popoverElement.dispatchEvent(new CustomEvent('d2l-dropdown-close', { bubbles: true, composed: true }));
			expect(el.shadowRoot.querySelector('th').getAttribute('data-popover-count')).to.be.null;
		});

	});

	describe('async-item-load', () => {
		let elem, wrapper;
		beforeEach(async() => {
			elem = await fixture(`<${tag}></${tag}>`);
			wrapper = elem.shadowRoot.querySelector('d2l-table-wrapper');
		});

		it('updates initial changes with no throttle', async() => {
			await expect(wrapper._itemShowingCount).to.equal(2);
		});

		it('sets next change to throttle', async() => {
			setTimeout(elem._loadItemsAsync());
			await oneEvent(wrapper, 'd2l-table-wrapper-layout-change'); // First item loads
			expect(wrapper._throttleNextChange).to.be.true;
		});

		it('loads remaining items after single change', async() => {
			setTimeout(elem._loadItemsAsync());
			await oneEvent(wrapper, 'd2l-table-wrapper-layout-change'); // First item loads
			await oneEvent(wrapper, 'd2l-table-wrapper-layout-change'); // Rest load
			await expect(wrapper._itemShowingCount).to.equal(7);
		});
	});

});

describe('d2l-table-controls', () => {

	it('should construct', () => {
		runConstructor('d2l-table-controls');
	});

	it('should override default SelectionControls label', async() => {
		const el = await fixture(html`<d2l-table-controls></d2l-table-controls>`);
		const section = el.shadowRoot.querySelector('section');
		expect(section.getAttribute('aria-label')).to.equal('Actions for table');
	});

});

describe('d2l-table-col-sort-button', () => {

	it('should construct', () => {
		runConstructor('d2l-table-col-sort-button');
	});

});

describe('d2l-table-col-sort-button-item', () => {

	it('should construct', () => {
		runConstructor('d2l-table-col-sort-button-item');
	});

});
