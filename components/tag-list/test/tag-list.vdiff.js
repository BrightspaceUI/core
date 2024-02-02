import '../tag-list.js';
import '../tag-list-item.js';
import './tag-list-item-mixin-consumer.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, nextFrame, oneEvent, sendKeys, waitUntil } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

const viewport = { width: 1500 };

function createTagList(opts) {
	const { clearable, shorter, style } = { clearable: false, shorter: false, ...opts };
	return html`
		<d2l-tag-list style="${ifDefined(style)}" description="A bunch of example tags" ?clearable="${clearable}">
			${shorter ? nothing : html`
				<d2l-tag-list-item text="Example Tag" class="vdiff-include"></d2l-tag-list-item>
				<d2l-tag-list-item text="Longer Example Tag - much much much much much much much much longer" class="vdiff-include"></d2l-tag-list-item>
				<d2l-tag-list-item text="Another Example Tag"></d2l-tag-list-item>
				<d2l-tag-list-item-mixin-consumer name="Custom Tag List Item" class="vdiff-include"></d2l-tag-list-item-mixin-consumer>
			`}
			<d2l-tag-list-item text="Example Tag 5 - a longer tag"></d2l-tag-list-item>
			<d2l-tag-list-item text="Example Tag 6 - another longer tag" ?clearable="${!clearable}"></d2l-tag-list-item>
			<d2l-tag-list-item text="Example Tag 7"></d2l-tag-list-item>
		</d2l-tag-list>
	`;
}

describe('tag-list', () => {
	it('large page width', async() => {
		const elem = await fixture(createTagList(), { viewport });
		await expect(elem).to.be.golden();
	});

	it('clear button hidden', async() => {
		const elem = await fixture(createTagList({ shorter: true }), { viewport });
		await expect(elem).to.be.golden();
	});

	describe('tag list item style', () => {
		it('focus', async() => {
			const elem = await fixture(createTagList(), { viewport });
			sendKeys('press', 'Tab');
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

		it('hover', async() => {
			const elem = await fixture(createTagList(), { viewport });
			await hoverElem(elem.querySelector('d2l-tag-list-item'));
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

		it('focus and hover', async() => {
			const elem = await fixture(createTagList(), { viewport });
			sendKeys('press', 'Tab');
			await oneEvent(elem, 'd2l-tooltip-show');
			await hoverElem(elem.querySelector('d2l-tag-list-item'));
			await expect(elem).to.be.golden();
		});
	});

	[980, 969, 601, 599, 440, 320].forEach((width) => {
		[true, false].forEach((clearable) => {
			describe(clearable ? 'clearable' : 'default', () => {

				let elem;
				beforeEach(async() => {
					elem = await fixture(createTagList({ style: `width: ${width}px;`, clearable }), { viewport });
				});

				it(`width ${width}`, async() => {
					await expect(elem).to.be.golden();
				});

				it(`width ${width} add items`, async() => {
					for (let i = 0; i < 2; i++) {
						const tag = document.createElement('d2l-tag-list-item');
						tag.text = 'Added New Item';
						elem.insertBefore(tag, elem.children[0]);
					}
					await elem.updateComplete;

					await nextFrame();
					await expect(elem).to.be.golden();
				});

				it(`width ${width} click show more`, async() => {
					const button = elem.shadowRoot.querySelector('.d2l-tag-list-button');
					if (button) await clickElem(button);
					await elem.updateComplete;

					await nextFrame();
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	describe('clearable behavior', () => {
		let elem;
		beforeEach(async() => {
			elem = await fixture(createTagList({ clearable: true }), { viewport });
			elem.addEventListener('d2l-tag-list-item-clear', (e) => {
				e.target.parentNode.removeChild(e.target);
			});
			elem.addEventListener('d2l-tag-list-clear', (e) => {
				[...e.target.children].forEach(tag => {
					e.target.removeChild(tag);
				});
			});
		});

		it('delete last visible item', async() => {
			await clickElem(elem.children[4].shadowRoot.querySelector('d2l-button-icon'));
			await expect(elem).to.be.golden();
		});

		it('delete first item', async() => {
			await sendKeys('press', 'Tab');
			await sendKeys('press', 'Delete');
			await expect(elem).to.be.golden();
		});

		it('click clear all', async() => {
			await clickElem(elem.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button'));
			await waitUntil(() => elem.clientHeight === 30);
			await expect(elem).to.be.golden();
		});
	});

	describe('interactive', () => {
		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<div role="grid" style="width: 350px;">
					<d2l-tag-list description="A bunch of example tags" clearable>
						<d2l-tag-list-item text="Tag 1"></d2l-tag-list-item>
						<d2l-tag-list-item text="Tag 2"></d2l-tag-list-item>
						<d2l-tag-list-item text="Tag 3"></d2l-tag-list-item>
						<d2l-tag-list-item text="Tag 4"></d2l-tag-list-item>
					</d2l-tag-list>
				</div>
			`);
		});

		it('normal', async() => {
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			await focusElem(elem.querySelector('d2l-tag-list'));
			await expect(elem).to.be.golden();
		});
	});
});
