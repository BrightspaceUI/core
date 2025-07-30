import '../../button/button.js';
import '../../tooltip/tooltip.js';
import '../../tooltip/tooltip-help.js';
import '../list.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';
import '../list-item-nav.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

const simpleListItemContent = html`
	<d2l-list-item-content>
		<div>Item 1</div>
		<div slot="supporting-info">Secondary info for item 1</div>
	</d2l-list-item-content>
`;

const interactiveListItemContent = html`
	<d2l-list-item-content>
		<div>Item 1</div>
		<div slot="secondary" style="padding: 5px;">Information: <d2l-tooltip-help text="Due: Jan 30, 2023">Available: Aug 11, 2023</d2l-tooltip-help></div>
		<div slot="supporting-info"><d2l-button style="padding: 10px;">Hi!</d2l-button></div>
	</d2l-list-item-content>
`;

describe('list', () => {
	describe('interactive content', () => {

		describe('href', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'focus-interactive', action: elem => focusElem(elem.querySelector('d2l-button')), margin: 24 },
				{ name: 'hover-interactive', action: elem => hoverElem(elem.querySelector('d2l-button')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item label="Item" href="http://www.d2l.com">
								${interactiveListItemContent}
							</d2l-list-item>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('button', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item-button')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item-button')), margin: 24 },
				{ name: 'focus-interactive', action: elem => focusElem(elem.querySelector('d2l-button')), margin: 24 },
				{ name: 'hover-interactive', action: elem => hoverElem(elem.querySelector('d2l-button')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item-button label="Item">
								${interactiveListItemContent}
							</d2l-list-item-button>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('selectable', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'focus-interactive', action: elem => focusElem(elem.querySelector('d2l-button')), margin: 24 },
				{ name: 'hover-interactive', action: elem => hoverElem(elem.querySelector('d2l-button')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item label="Item" selectable>
								${interactiveListItemContent}
							</d2l-list-item>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('expandable', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'focus-interactive', action: elem => focusElem(elem.querySelector('d2l-button')), margin: 24 },
				{ name: 'hover-interactive', action: elem => hoverElem(elem.querySelector('d2l-button')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item label="Item" expandable key="key-1">
								${interactiveListItemContent}
								<d2l-list slot="nested">
									${simpleListItemContent}
								</d2l-list>
							</d2l-list-item>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('href-selectable-expandable-color', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item label="Item" href="http://www.d2l.com" expandable selectable key="key-1" color="#00ff00">
								${interactiveListItemContent}
								<d2l-list slot="nested">
									<d2l-list-item>
									${simpleListItemContent}
									</d2l-list-item>
								</d2l-list>
							</d2l-list-item>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		}); // combo

	});

	describe('nav add-button', () => {
		[
			{ name: 'default' },
			{ name: 'focus', action: async(elem) => await focusElem(elem.querySelector('d2l-list-item-nav')) },
			{ name: 'focus current', action: async(elem) => await focusElem(elem.querySelector('[current]')), current: true },
			{ name: 'hover', action: async(elem) => await hoverElem(elem.querySelector('d2l-list-item-nav')) },
			{ name: 'focus second item', action: async(elem) => await focusElem(elem.querySelector('d2l-list-item-nav[key="L1-2"]')) },
			{ name: 'focus second item current', action: async(elem) => await focusElem(elem.querySelector('d2l-list-item-nav[key="L1-2"]')), currentSecond: true }
		].forEach(({ name, action, current, currentSecond }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list grid style="width: 334px;" add-button>
						<d2l-list-item-nav action-href=" " key="L1-1" label="Welcome!" color="#006fbf" expandable expanded draggable>
							<d2l-list-item-content>
								<div>Welcome!</div>
							</d2l-list-item-content>
							<d2l-list slot="nested" grid add-button>
								<d2l-list-item-nav action-href=" " key="L2-1" label="Syallabus Confirmation" draggable ?current="${current || false}">
									<d2l-list-item-content>
										<div>Syallabus Confirmation</div>
										<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
								<d2l-list-item-nav action-href=" " key="L2-2" label="Lesson 1" draggable>
									<d2l-list-item-content>
										<div>Lesson 1</div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
							</d2l-list>
						</d2l-list-item-nav>
						<d2l-list-item-nav action-href=" " key="L1-2" label="Welcome!" color="#006fbf" expandable expanded draggable ?current="${currentSecond || false}">
							<d2l-list-item-content>
								<div>Welcome!</div>
							</d2l-list-item-content>
							<d2l-list slot="nested" grid add-button>
								<d2l-list-item-nav action-href=" " key="L1-2-1" label="Syallabus Confirmation" draggable>
									<d2l-list-item-content>
										<div>Syallabus Confirmation</div>
										<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
								<d2l-list-item-nav action-href=" " key="L1-2-2" label="Lesson 1" draggable>
									<d2l-list-item-content>
										<div>Lesson 1</div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
							</d2l-list>
						</d2l-list-item-nav>
					</d2l-list>
				`);
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin: 24 });
			});
		});
	});

	[true, false].forEach(disabled => {
		if (disabled) return; // skipping for now since no concept of disabled link item currently

		describe(`nav${disabled ? '-disabled' : ''}`, () => {
			[
				{ name: 'default' },
				{ name: 'default current', margin: disabled ? undefined : 24, current: true },
				{ name: 'focus', action: focusElem, margin: disabled ? undefined : 24 },
				{ name: 'focus current', action: focusElem, margin: disabled ? undefined : 24, current: true },
				{ name: 'hover', action: hoverElem, margin: disabled ? undefined : 24 }
			].forEach(({ name, action, margin, current }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item-nav ?current="${current || false}" action-href=" ">
								${interactiveListItemContent}
							</d2l-list-item-nav>
						</d2l-list>
					`);
					if (action) await action(elem.querySelector('d2l-list-item-nav'));
					await expect(elem).to.be.golden({ margin });
				});

				it(`nested-${name}`, async() => {
					const elem = await fixture(html`
						<d2l-list grid style="width: 334px;">
							<d2l-list-item-nav key="L1-1" label="Welcome!" color="#006fbf" expandable expanded draggable action-href=" ">
								<d2l-list-item-content>
									<div>Welcome!</div>
								</d2l-list-item-content>
								<d2l-list slot="nested" grid>
									<d2l-list-item-nav key="L2-1" label="Syallabus Confirmation" draggable ?current="${current || false}" action-href=" ">
										<d2l-list-item-content>
											<div>Syallabus Confirmation</div>
											<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
										</d2l-list-item-content>
									</d2l-list-item-nav>
								</d2l-list>
							</d2l-list-item-nav>
						</d2l-list>
					`);
					if (action) await action(elem.querySelectorAll('d2l-list-item-nav')[1]);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		it('nested-focused-secondary', async() => {
			const elem = await fixture(html`
				<d2l-list grid style="width: 334px;">
					<d2l-list-item-nav key="L1-1" label="Welcome!" color="#006fbf" expandable expanded draggable action-href=" ">
						<d2l-list-item-content>
							<div>Welcome!</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid>
							<d2l-list-item-nav key="L2-1" label="Syallabus Confirmation" draggable action-href=" ">
								<d2l-list-item-content>
									<div>Syallabus Confirmation</div>
									<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
				</d2l-list>
			`);
			focusElem(elem.querySelector('d2l-tooltip-help'));
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('nested-indentation', async() => {
			const elem = await fixture(html`
				<d2l-list grid style="width: 334px;">
					<d2l-list-item-nav key="L1-1" label="Welcome!" color="#006fbf" expandable expanded draggable action-href=" " indentation="42">
						<d2l-list-item-content>
							<div>Welcome!</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid>
							<d2l-list-item-nav key="L2-1" label="Syallabus Confirmation" draggable action-href=" " color="#29a6ff" expandable expanded indentation="30">
								<d2l-list-item-content>
									<div>Syallabus Confirmation</div>
									<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
								</d2l-list-item-content>
								<d2l-list slot="nested" grid>
									<d2l-list-item-nav key="L2-1-1" label="Welcome topic" draggable action-href=" ">
										<d2l-list-item-content>
											<div>Welcome topic</div>
										</d2l-list-item-content>
									</d2l-list-item-nav>
								</d2l-list>
							</d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});
	});
});
