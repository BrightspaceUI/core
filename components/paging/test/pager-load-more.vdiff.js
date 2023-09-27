import '../pager-load-more.js';
import './pageable-component.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

const viewport = { width: 476 };

function createPagerTemplate(opts) {
	const { hasMore, itemCount, pageSize } = { hasMore: true, ...opts };
	return html`
		<div>
			<style>
				a {
					outline: none;
					text-decoration: none;
				}
				a:focus {
					text-decoration: underline;
				}
			</style>
			<d2l-test-pageable item-count="${ifDefined(itemCount)}">
				<ul>
					<li><a href="https://some-website">item 1</a></li>
					<li><a href="https://some-website">item 2</a></li>
				</ul>
				<d2l-pager-load-more slot="pager" ?has-more="${hasMore}" page-size="${ifDefined(pageSize)}"></d2l-pager-load-more>
			</d2l-test-pageable>
		</div>
	`;
}

describe('pager-load-more', () => {
	it('load-more', async() => {
		const elem = await fixture(createPagerTemplate({ itemCount: 15, pageSize: 3 }), { viewport });
		const pager = elem.querySelector('d2l-pager-load-more');
		pager.addEventListener('d2l-pager-load-more', e => {
			const list = e.target.parentNode.querySelector('ul');
			for (let i = 0; i < e.target.pageSize; i++) {
				const newItem = list.lastElementChild.cloneNode(true);
				newItem.querySelector('a').textContent = `item ${list.children.length + 1}`;
				list.appendChild(newItem);
			}
			e.detail.complete();
		});
		clickElem(pager);
		await oneEvent(pager, 'd2l-pager-load-more');
		await expect(elem).to.be.golden();
	});

	describe('states', () => {
		[
			{ name: 'no-more', template: createPagerTemplate({ hasMore: false, itemCount: 15, pageSize: 3 }) },
			{ name: 'item-count', template: createPagerTemplate({ itemCount: 15, pageSize: 3 }) },
			{ name: 'no-item-count', template: createPagerTemplate({ pageSize: 3 }) },
			{ name: 'hover', template: createPagerTemplate({ itemCount: 15, pageSize: 3 }), action: hoverElem },
			{ name: 'focus', template: createPagerTemplate({ itemCount: 15, pageSize: 3 }), action: focusElem },
			{ name: 'no-page-size', template: createPagerTemplate({ itemCount: 15 }) },
			{ name: 'no-item-count-or-page-size', template: createPagerTemplate() }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport });
				const pager = elem.querySelector('d2l-pager-load-more');
				if (action) await action(pager);
				await expect(elem).to.be.golden();
			});
		});
	});
});
