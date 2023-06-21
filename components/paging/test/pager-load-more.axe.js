import './pageable-component.js';
import '../pager-load-more.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

const generatePager = (hasMore, itemCount, pageSize) => fixture(html`
	<d2l-test-pageable-simple item-count="${ifDefined(itemCount)}">
		<d2l-pager-load-more slot="pager" ?has-more="${hasMore}" page-size="${ifDefined(pageSize)}"></d2l-pager-load-more>
	</d2l-test-pageable-simple>
`).then(elem => elem.querySelector('d2l-pager-load-more'));

describe('d2l-pager-load-more', () => {

	it('normal', async() => {
		const elem = await generatePager(true, 30, 5);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await generatePager(true, 30, 5);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('no more', async() => {
		const elem = await generatePager(false, 30, 5);
		await expect(elem).to.be.accessible();
	});

	it('no item count', async() => {
		const elem = await generatePager(true, undefined, 5);
		await expect(elem).to.be.accessible();
	});

	it('no page size', async() => {
		const elem = await generatePager(true, 30);
		await expect(elem).to.be.accessible();
	});

	it('no item count or page size', async() => {
		const elem = await generatePager(true);
		await expect(elem).to.be.accessible();
	});
});
