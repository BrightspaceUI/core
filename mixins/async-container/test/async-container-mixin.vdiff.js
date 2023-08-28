import '../demo/async-container.js';
import '../demo/async-item.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

async function getAsyncStateEvent(elem, state) {
	return new Promise((resolve) => {
		elem.addEventListener('d2l-async-demo-container-changed', (e) => {
			if (e.detail.state === state) resolve();
		});
	});
}

function createTemplate(opts) {
	const items = [];
	const { delay, numItems } = { numItems: 1, ...opts };
	for (let i = 0; i < numItems; i++) {
		items.push(html`<d2l-async-demo-item manual></d2l-async-demo-item>`);
	}
	return html`
		<d2l-async-demo-container style="display: inline-block;" async-pending-delay="${ifDefined(delay)}">
			<div slot="initial">Initial</div>
			<div slot="pending">Pending</div>
			${items}
		</d2l-async-demo-container>
	`;
}

describe('async-container-mixin', () => {
	it('initial', async() => {
		const elem = await fixture(createTemplate());
		await expect(elem).to.be.golden();
	});

	it('pending', async() => {
		const elem = await fixture(createTemplate());
		elem.querySelector('d2l-async-demo-item').key = 'key';
		await getAsyncStateEvent(elem, 'pending');
		await expect(elem).to.be.golden();
	});

	it('pending-delay', async() => {
		const elem = await fixture(createTemplate({ delay: 1000 }));
		elem.querySelector('d2l-async-demo-item').key = 'key';
		await expect(elem).to.be.golden();
	});

	it('mixed', async function() {
		const elem = await fixture(createTemplate({ numItems: 2 }));
		const items = elem.querySelectorAll('d2l-async-demo-item');
		items[0].key = 'Key 1';
		items[1].key = 'Key 2';
		await getAsyncStateEvent(elem, 'pending');
		items[0].resolve();
		await expect(elem).to.be.golden();
	});

	it('failure', async function() {
		const elem = await fixture(createTemplate());
		const item = elem.querySelector('d2l-async-demo-item');
		item.key = 'key';
		item.reject();
		await getAsyncStateEvent(elem, 'complete');
		await expect(elem).to.be.golden();
	});

	it('complete', async function() {
		const elem = await fixture(createTemplate());
		const item = elem.querySelector('d2l-async-demo-item');
		item.key = 'key';
		item.resolve();
		await getAsyncStateEvent(elem, 'complete');
		await expect(elem).to.be.golden();
	});
});
