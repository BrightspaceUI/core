import './pageable-component.js';
import '../pager-load-more.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

const generatePager = (hasMore, itemCount) => fixture(html`
	<d2l-test-pageable-simple item-count="${ifDefined(itemCount)}">
		<d2l-pager-load-more slot="pager" ?has-more="${hasMore}" page-size="5"></d2l-pager-load-more>
	</d2l-test-pageable-simple>
`).then(elem => elem.querySelector('d2l-pager-load-more'));

describe('d2l-pager-load-more', () => {

	it('normal', async() => {
		const elem = await generatePager(true, 30);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await generatePager(true, 30);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('no more', async() => {
		const elem = await generatePager(false, 30);
		await expect(elem).to.be.accessible();
	});

	it('no item count', async() => {
		const elem = await generatePager(true);
		await expect(elem).to.be.accessible();
	});

});
