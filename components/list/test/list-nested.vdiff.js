import '../demo/demo-list-nested-iterations-helper.js';
import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import { expect, fixture, html, nextFrame } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('list', () => {
	describe('nested', () => {

		function createNestedList(opts) {
			const { color1, indentation } = { addButton: false, indentation: false, ...opts };
			return html`
				<d2l-list style="width: 600px;">
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item selectable label="L1-1" key="L1-1" indentation="${ifDefined(indentation ? '35' : undefined)}">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
						</d2l-list-item-content>
						<div slot="actions">
							<button>action 1</button>
							<button>action 2</button>
						</div>
						<d2l-list slot="nested" separators="between">
							<d2l-list-item selectable color="${ifDefined(color1)}" label="L2-1" key="L2-1">
								<d2l-list-item-content>
									<div>Level 2, Item 1</div>
									<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item selectable label="L2-2" key="L2-2" indentation="${ifDefined(indentation ? '40' : undefined)}">
								<d2l-list-item-content>
									<div>Level 2, Item 2</div>
									<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
								</d2l-list-item-content>
								<d2l-list slot="nested" separators="between">
									<d2l-list-item selectable label="L3-1" key="L3-1">
										<d2l-list-item-content>
											<div>Level 3, Item 1</div>
											<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item selectable label="L3-2" key="L3-2">
										<d2l-list-item-content>
											<div>Level 3, Item 2</div>
											<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
										</d2l-list-item-content>
									</d2l-list-item>
								</d2l-list>
							</d2l-list-item>
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'indentation', template: createNestedList({ indentation: true }) },
			{ name: 'indentation color', template: createNestedList({ color1: '#00ff00', indentation: true }) },
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden({ margin: 24 });
			});
		});

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
