import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { stub } from 'sinon';

const singleSetDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim">
			<d2l-filter-dimension-set-value key="value" text="Value"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const multiDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="1" text="Dim 1">
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="2" text="Dim 2">
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;

describe('d2l-filter', () => {

	it('should construct', () => {
		runConstructor('d2l-filter');
	});

	describe('events', () => {
		it('single set dimension fires change events', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			const value = elem.shadowRoot.querySelector('d2l-list-item[key="value"]');

			setTimeout(() => value.setSelected(true));
			let e = await oneEvent(elem, 'd2l-filter-change');
			expect(e.detail.dimension).to.equal('dim');
			expect(e.detail.value.key).to.equal('value');
			expect(e.detail.value.selected).to.be.true;

			setTimeout(() => value.setSelected(false));
			e = await oneEvent(elem, 'd2l-filter-change');
			expect(e.detail.dimension).to.equal('dim');
			expect(e.detail.value.key).to.equal('value');
			expect(e.detail.value.selected).to.be.false;
		});

		it('multiple dimensions fire change events', async() => {
			const elem = await fixture(multiDimensionFixture);
			const value1 = elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]');
			const value2 = elem.shadowRoot.querySelector('[data-key="2"] d2l-list-item[key="1"]');

			setTimeout(() => value1.setSelected(true));
			let e = await oneEvent(elem, 'd2l-filter-change');
			expect(e.detail.dimension).to.equal('1');
			expect(e.detail.value.key).to.equal('1');
			expect(e.detail.value.selected).to.be.true;

			setTimeout(() => value2.setSelected(true));
			e = await oneEvent(elem, 'd2l-filter-change');
			expect(e.detail.dimension).to.equal('2');
			expect(e.detail.value.key).to.equal('1');
			expect(e.detail.value.selected).to.be.true;
		});
	});

	describe('slot change', () => {
		it('dimensions added after initial render are handled', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			expect(elem._dimensions.length).to.equal(1);

			const newDim = document.createElement('d2l-filter-dimension-set');
			newDim.key = 'newDim';
			elem.appendChild(newDim);
			await elem.updateComplete;

			expect(elem._dimensions.length).to.equal(2);
			expect(elem._dimensions[0].key).to.equal('dim');
			expect(elem._dimensions[1].key).to.equal('newDim');
		});
	});

	describe('data change', () => {
		it('dimension data changes are handled', async() => {
			const elem = await fixture(multiDimensionFixture);
			const updateStub = stub(elem, 'requestUpdate');
			expect(elem._dimensions[1].text).to.equal('Dim 2');
			elem._handleDimensionDataChange({
				detail: {
					dimensionKey: '2',
					changes: new Map([['text', 'Test']])
				}
			});
			expect(elem._dimensions[1].text).to.equal('Test');
			expect(updateStub).to.be.calledOnce;
		});

		it('dimension value data changes are handled', async() => {
			const elem = await fixture(multiDimensionFixture);
			const updateStub = stub(elem, 'requestUpdate');
			expect(elem._dimensions[1].values[0].text).to.equal('Value 1');
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			elem._handleDimensionDataChange({
				detail: {
					dimensionKey: '2',
					valueKey: '1',
					changes: new Map([['text', 'Test'], ['selected', true]])
				}
			});
			expect(elem._dimensions[1].values[0].text).to.equal('Test');
			expect(elem._dimensions[1].values[0].selected).to.be.true;
			expect(updateStub).to.be.calledOnce;
		});

		it('does not call requestUpdate if no changes', async() => {
			const elem = await fixture(multiDimensionFixture);
			const updateStub = stub(elem, 'requestUpdate');
			expect(elem._dimensions[1].values[0].text).to.equal('Value 1');
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			elem._handleDimensionDataChange({
				detail: {
					dimensionKey: '2',
					valueKey: '1',
					changes: new Map([['text', 'Value 1'], ['selected', false]])
				}
			});
			expect(elem._dimensions[1].values[0].text).to.equal('Value 1');
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			expect(updateStub).to.not.be.called;
		});
	});
});
