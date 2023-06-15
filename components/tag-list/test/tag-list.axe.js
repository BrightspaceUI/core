import './tag-list-item-mixin-consumer.js';
import '../tag-list.js';
import '../tag-list-item.js';
import { expect, fixture, html, waitUntil } from '@brightspace-ui/testing';

const basicFixture = html`
	<d2l-tag-list description="Testing Tags">
		<d2l-tag-list-item text="Tag"></d2l-tag-list-item>
		<d2l-tag-list-item text="Another Tag"></d2l-tag-list-item>
		<d2l-tag-list-item text="Another Very Very Very Very Very Long Tag"></d2l-tag-list-item>
		<d2l-tag-list-item-mixin-consumer name="Tag"></d2l-tag-list-item-mixin-consumer>
	</d2l-tag-list>
`;

describe('d2l-tag-list', () => {

	it('basic', async() => {
		const elem = await fixture(basicFixture);
		await waitUntil(() => elem._items, 'List items did not become ready');

		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(basicFixture);
		await waitUntil(() => elem._items, 'List items did not become ready');

		elem.focus();
		await expect(elem).to.be.accessible();
	});

	it('custom tag', async() => {
		const elem = await fixture(basicFixture);
		await waitUntil(() => elem._items, 'List items did not become ready');

		const customTag = elem.querySelector('d2l-tag-list-item-mixin-consumer');
		customTag.focus();
		await expect(elem).to.be.accessible();
	});

});
