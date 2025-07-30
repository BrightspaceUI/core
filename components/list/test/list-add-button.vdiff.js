import '../../button/button.js';
import '../../button/button-icon.js';
import '../../colors/colors.js';
import '../../paging/pager-load-more.js';
import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-content.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('list', () => {
	describe('add-button', () => {
		function createSimpleList(opts) {
			const { color1, color2, extendSeparators, separatorType, addButtonText } = { extendSeparators: false, ...opts };
			return html`
				<d2l-list
					?extend-separators="${extendSeparators}"
					separators="${ifDefined(separatorType)}"
					style="width: 400px"
					add-button
					add-button-text="${ifDefined(addButtonText)}">
					<d2l-list-item label="1" color="${ifDefined(color1)}">Item 1</d2l-list-item>
					<d2l-list-item label="2" color="${ifDefined(color2)}">Item 2</d2l-list-item>
					<d2l-list-item>Item 3</d2l-list-item>
				</d2l-list>
			`;
		}

		describe('general', () => {
			it('default', async() => {
				const elem = await fixture(createSimpleList());
				await expect(elem).to.be.golden();
			});

			it('focus first item top', async() => {
				const elem = await fixture(createSimpleList());
				await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
				await expect(elem).to.be.golden({ margin: 20 });
			});

			it('focus first item bottom', async() => {
				const elem = await fixture(createSimpleList());
				await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelectorAll('d2l-button-add')[1]);
				await expect(elem).to.be.golden();
			});

			it('custom text focus', async() => {
				const elem = await fixture(createSimpleList({ addButtonText: 'Custom Text' }));
				await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
				await expect(elem).to.be.golden({ margin: 20 });
			});

			it('hover', async() => {
				const elem = await fixture(createSimpleList());
				await hoverElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
				await oneEvent(elem, 'd2l-tooltip-show');
				await expect(elem).to.be.golden();
			});
		});

		describe('controls sticky', () => {
			[
				{ actionName: 'top', action: elem => elem.scrollTo(0, 0) },
				{ actionName: 'scrolled', action: elem => elem.scrollTo(0, 45) },
				{ actionName: 'scrolled hover', action: async(elem) => {
					elem.scrollTo(0, 45);
					await hoverElem(elem.querySelector('[key="1"] [slot="supporting-info"]'));
				} }
			].forEach(({ actionName, action }) => {
				[
					{ name: 'default', color1: undefined, color2: undefined, extendSeparators: false },
					{ name: 'color', color1: '#ff0000', color2: undefined, extendSeparators: false },
					{ name: 'extended-separators', color1: undefined, color2: undefined, extendSeparators: true },
					{ name: 'extended-separators color', color1: undefined, color2: '#00ff00', extendSeparators: true }
				].forEach(({ name, color1, color2, extendSeparators }) => {
					it(`${name}-${actionName}`, async() => {
						const elem = await fixture(html`
							<div style="height: 200px; overflow: scroll; width: 400px;">
								<d2l-list style="padding: 0 20px;" ?extend-separators="${extendSeparators}" add-button>
									<d2l-list-controls slot="controls"></d2l-list-controls>
									<d2l-list-item label="Item 1" selectable key="1" color="${ifDefined(color1)}">
										<d2l-list-item-content>
											<div>Item 1</div>
											<div slot="supporting-info">Supporting info</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item label="Item 2" selectable key="2" color="${ifDefined(color2)}">
										<d2l-list-item-content>
											<div>Item 2</div>
											<div slot="supporting-info">Supporting info</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item label="Item 3" selectable key="3">
										<d2l-list-item-content>
											<div>Item 3</div>
											<div slot="supporting-info">Supporting info</div>
										</d2l-list-item-content>
									</d2l-list-item>
								</d2l-list>
							</div>
						`);
						await action(elem);
						await expect(elem).to.be.golden();
					});
				});
			});

			it('focus scrolled', async() => {
				const elem = await fixture(html`
					<div style="height: 200px; overflow: scroll; width: 400px;">
						<d2l-list style="padding: 0 20px;" add-button>
							<d2l-list-controls slot="controls"></d2l-list-controls>
							<d2l-list-item label="Item 1" selectable key="1">
								<d2l-list-item-content>
									<div>Item 1</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item label="Item 2" selectable key="2">
								<d2l-list-item-content>
									<div>Item 2</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item label="Item 3" selectable key="3">
								<d2l-list-item-content>
									<div>Item 3</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item label="Item 4" selectable key="4">
								<d2l-list-item-content>
									<div>Item 4</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					</div>
				`);
				const addButton = elem.querySelector('d2l-list-item').shadowRoot.querySelectorAll('d2l-button-add')[1];
				await focusElem(addButton);
				await elem.scrollTo(0, 90);
				await expect(elem).to.be.golden();
			});

			it('focus', async() => {
				const elem = await fixture(html`
					<div style="height: 200px; overflow: scroll; width: 400px;">
						<d2l-list style="padding: 0 20px;" add-button>
							<d2l-list-controls slot="controls"></d2l-list-controls>
							<d2l-list-item label="Item 1" selectable key="1">
								<d2l-list-item-content>
									<div>Item 1</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					</div>
				`);
				const addButton = elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add');
				await focusElem(addButton);
				await expect(elem).to.be.golden();
			});
		});
	});
});
