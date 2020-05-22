import '../expand-collapse-content.js';
import { fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const collapsedContentFixture = html`<d2l-expand-collapse-content>A message.</d2l-expand-collapse-content>`;
const expandedContentFixture = html`<d2l-expand-collapse-content expanded>A message.</d2l-expand-collapse-content>`;

describe('d2l-expand-collapse-content', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-expand-collapse-content');
		});

	});

	describe('events', () => {

		it('should fire d2l-expand-collapse-content-expand event with complete promise', async() => {
			const content = await fixture(collapsedContentFixture);
			setTimeout(() => content.expanded = true);
			const e = await new Promise(resolve => {
				content.addEventListener('d2l-expand-collapse-content-expand', (e) => resolve(e), { once: true });
			});
			await e.detail.expandComplete;
		});

		it('should fire d2l-expand-collapse-content-collapse event with complete promise', async() => {
			const content = await fixture(expandedContentFixture);
			setTimeout(() => content.expanded = false);
			const e = await new Promise(resolve => {
				content.addEventListener('d2l-expand-collapse-content-collapse', (e) => resolve(e), { once: true });
			});
			await e.detail.collapseComplete;
		});

	});

});
