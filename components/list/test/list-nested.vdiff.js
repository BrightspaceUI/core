import '../demo/demo-list-nested-iterations-helper.js';
import '../list.js';
import '../list-item.js';
import { expect, fixture, html, nextFrame } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('list', () => {
	describe('nested', () => {
		[true, false].forEach(rtl => {
			[
				{ name: 'all-iterations-non-draggable', draggable: false, media: 'screen' },
				{ name: 'all-iterations-draggable', draggable: true, media: 'screen' },
				{ name: 'all-iterations-separators-none', draggable: false, media: 'screen', separators: 'none' },
				{ name: 'all-iterations-separators-between', draggable: false, media: 'screen', separators: 'between' },
				{ name: 'all-iterations-draggable-force-show', draggable: true, media: 'print' }
			].forEach(({ name, draggable, media, separators }) => {
				it(`${name}${rtl ? '-rtl' : ''}`, async() => {
					const elem = await fixture(html`<d2l-demo-list-nested-iterations-helper separators=${ifDefined(separators)} ?is-draggable="${draggable}"></d2l-demo-list-nested-iterations-helper>`,
						{ media, rtl, viewport: { width: 1300, height: 7000 } }
					);
					await nextFrame();
					await expect(elem).to.be.golden();
				}).timeout(30000);
			});
		});
	});
});
