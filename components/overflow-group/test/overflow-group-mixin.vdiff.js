import { defineCE, expect, fixture, html } from '@brightspace-ui/testing';
import { LitElement, nothing } from 'lit';
import { OVERFLOW_CLASS, OverflowGroupMixin } from '../overflow-group-mixin.js';

const tag = defineCE(
	class extends OverflowGroupMixin(LitElement) {

		static properties = {
			hasGap: { attribute: 'has-gap', type: Boolean }
		};

		constructor() {
			super();
			this.hasGap = false;
			this.itemGap = 0;
		}

		willUpdate(changedProperties) {
			super.willUpdate(changedProperties);
			if (changedProperties.has('hasGap')) {
				this.itemGap = this.hasGap ? 10 : 0;
			}
		}

		convertToOverflowItem() {
			return nothing;
		}

		getOverflowContainer(overflowItems) {
			return html`
				<button class="${OVERFLOW_CLASS} d2l-dropdown-opener" type="button">
					(${overflowItems.length})
				</button>
			`;
		}
	}
);

function createFixture(numItems, hasGap = true) {
	return `
		<${tag}${hasGap ? ' has-gap' : ''} style="border: 1px solid black; box-sizing: border-box; padding: 10px; width: 413px;">
			${Array.from(Array(numItems).keys()).map((key) => `<button style="box-sizing: border-box; margin: 0; width: 70px;">Item ${key + 1}</button>`).join('')}
		</${tag}>
	`;
}

describe('overflow-group-mixin', () => {

	it('gap-no-overflow', async() => {
		const elem = await fixture(createFixture(5));
		await expect(elem).to.be.golden();
	});

	it('gap-overflow', async() => {
		const elem = await fixture(createFixture(6));
		await expect(elem).to.be.golden();
	});

	it('no-gap', async() => {
		const elem = await fixture(createFixture(5, false));
		await expect(elem).to.be.golden();
	});

	it('no-gap-no-overflow', async() => {
		const elem = await fixture(createFixture(6, false));
		await expect(elem).to.be.golden();
	});

});
