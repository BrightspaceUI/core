import '../calendar.js';
import { clickElem, expect, fixture, focusElem, html, sendKeys, sendKeysElem } from '@brightspace-ui/testing';
import sinon from 'sinon';

const newToday = new Date('2018-02-12T12:00Z');
sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

const simpleTemplate = html`<d2l-calendar selected-value="2018-02-14"></d2l-calendar>`;
const minMaxTemplate = html`<d2l-calendar min-value="2018-01-31" max-value="2018-02-27" selected-value="2018-02-14"></d2l-calendar>`;

describe('calendar', () => {
	let elem;
	async function setupFixture(template, opts) {
		elem = await fixture(template, { viewport: { width: 400 }, ...opts });
	}

	[
		{ name: 'dec-2019', template: html`<d2l-calendar selected-value="2019-12-01"></d2l-calendar>` }, // first row only current month days last row contains next month days
		{ name: 'max', template: html`<d2l-calendar max-value="2017-02-27"></d2l-calendar>` },
		{ name: 'min', template: html`<d2l-calendar min-value="2020-01-31"></d2l-calendar>` },
		{ name: 'min-max', template: minMaxTemplate },
		{ name: 'min-max-no-selected', template: html`<d2l-calendar min-value="2017-08-31" max-value="2017-10-27" ></d2l-calendar>` },
		{ name: 'no-selected', template: html`<d2l-calendar></d2l-calendar>` },
		{ name: 'today-selected', template: html`<d2l-calendar selected-value="2018-02-12"></d2l-calendar>` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			await setupFixture(template);
			await expect(elem).to.be.golden();
		});
	});

	describe('localization', () => {
		[
			'ar',
			'da',
			'de',
			'en',
			'es',
			'fr',
			'nl',
			'pt',
			'sv',
			'tr'
		].forEach((lang) => {
			it(`${lang}`, async() => {
				await setupFixture(simpleTemplate, { lang });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('style', () => {
		beforeEach(async() => await setupFixture(simpleTemplate));

		it('focus', async() => {
			await focusElem(elem);
			await expect(elem).to.be.golden();
		});

		describe('date', () => {
			it('hover on non-selected-value', async() => {
				const date = elem.shadowRoot.querySelector('td[data-date="20"] button');
				date.classList.add('d2l-calendar-date-hover');
				await expect(elem).to.be.golden();
			});

			it('hover on selected-value', async() => {
				const date = elem.shadowRoot.querySelector('td[data-date="14"] button');
				date.classList.add('d2l-calendar-date-hover');
				await expect(elem).to.be.golden();
			});

			it('focus on non-selected-value', async() => {
				await focusElem(elem.shadowRoot.querySelector('td[data-date="20"]'));
				await expect(elem).to.be.golden();
			});

			it('focus on selected-value', async() => {
				await focusElem(elem.shadowRoot.querySelector('td[data-date="14"]'));
				await expect(elem).to.be.golden();
			});

			it('hover and focus on non-selected-value', async() => {
				const date = elem.shadowRoot.querySelector('td[data-date="20"] button');
				date.classList.add('d2l-calendar-date-hover');
				await focusElem(elem.shadowRoot.querySelector('td[data-date="20"]'));
				await expect(elem).to.be.golden();
			});

			it('hover and focus on selected-value', async() => {
				const date = elem.shadowRoot.querySelector('td[data-date="14"] button');
				date.classList.add('d2l-calendar-date-hover');
				await focusElem(elem.shadowRoot.querySelector('td[data-date="14"]'));
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('interaction', () => {
		async function tabToDates(elem) {
			await focusElem(elem);
			await sendKeys('press', 'Tab');
			await sendKeys('press', 'Tab');
		}

		it('click left arrow', async() => {
			await setupFixture(simpleTemplate);
			await clickElem(elem.shadowRoot.querySelector('d2l-button-icon[text="Show January"]'));
			await expect(elem).to.be.golden();
		});

		it('click right arrow', async() => {
			await setupFixture(html`<d2l-calendar selected-value="2019-12-01"></d2l-calendar>`);
			await clickElem(elem.shadowRoot.querySelector('d2l-button-icon[text="Show January"]'));
			await expect(elem).to.be.golden();
		});

		it('initial focus date is selected-value', async() => {
			await setupFixture(simpleTemplate);
			await focusElem(elem);
			await sendKeys('press', 'Tab');
			await sendKeys('press', 'Tab');
			await expect(elem).to.be.golden();
		});

		it('initial focus date is 1st of month', async() => {
			await setupFixture(simpleTemplate);
			await clickElem(elem.shadowRoot.querySelector('d2l-button-icon[text="Show March"]'));
			await sendKeys('press', 'Tab');
			await expect(elem).to.be.golden();
		});

		describe('date selection', () => {
			it('click', async() => {
				await setupFixture(simpleTemplate);
				await clickElem(elem.shadowRoot.querySelector('td[data-date="20"] button'));
				await expect(elem).to.be.golden();
			});

			it('click disabled', async() => {
				await setupFixture(minMaxTemplate);
				await clickElem(elem.shadowRoot.querySelector('td[data-date="1"] button'));
				await clickElem(elem.shadowRoot.querySelector('td[data-date="30"] button'));
				await expect(elem).to.be.golden();
			});

			[{ name: 'enter', key: 'Enter' }, { name: 'space', key: 'Space' }].forEach(({ name, key }) => {
				it(name, async() => {
					await setupFixture(simpleTemplate);
					await tabToDates(elem);
					await sendKeys('press', 'ArrowRight');
					await sendKeys('press', key);
					await sendKeys('press', 'ArrowRight');
					await expect(elem).to.be.golden();
				});
			});
		});

		describe('keys', () => {
			describe('arrow', () => {
				beforeEach(async() => await setupFixture(simpleTemplate));

				it('up to prev month', async() => {
					await tabToDates(elem);
					await sendKeys('press', 'ArrowUp');
					await sendKeys('press', 'ArrowUp');
					await sendKeys('press', 'ArrowUp');
					await expect(elem).to.be.golden();
				});

				it('left to prev month', async() => {
					await tabToDates(elem);
					for (let i = 0; i < 18; i++) {
						await sendKeys('press', 'ArrowLeft');
					}
					await expect(elem).to.be.golden();
				});

				it('down to next month', async() => {
					await tabToDates(elem);
					await sendKeys('press', 'ArrowDown');
					await sendKeys('press', 'ArrowDown');
					await sendKeys('press', 'ArrowDown');
					await expect(elem).to.be.golden();
				});

				it('right to next month', async() => {
					await tabToDates(elem);
					for (let i = 0; i < 18; i++) {
						await sendKeys('press', 'ArrowRight');
					}
					await expect(elem).to.be.golden();
				});
			});

			describe('other', () => {
				beforeEach(async() => await setupFixture(simpleTemplate));

				it('end', async() => {
					await tabToDates(elem);
					await sendKeys('press', 'End');
					await expect(elem).to.be.golden();
				});

				it('home', async() => {
					await tabToDates(elem);
					await sendKeys('press', 'Home');
					await expect(elem).to.be.golden();
				});

				it('pagedown', async() => {
					await clickElem(elem.shadowRoot.querySelector('d2l-button-icon[text="Show January"]'));
					await clickElem(elem.shadowRoot.querySelector('d2l-button-icon[text="Show December"]'));
					await sendKeys('press', 'Tab');
					await sendKeys('press', 'Tab');
					await sendKeys('press', 'PageDown');
					await expect(elem).to.be.golden();
				});

				it('pageup', async() => {
					await clickElem(elem.shadowRoot.querySelector('d2l-button-icon[text="Show January"]'));
					await clickElem(elem.shadowRoot.querySelector('d2l-button-icon[text="Show December"]'));
					await clickElem(elem.shadowRoot.querySelector('td[data-date="3"][data-month="0"] button'));
					await sendKeys('press', 'PageUp');
					await expect(elem).to.be.golden();
				});

			});

			describe('other-min-max', () => {
				beforeEach(async() => await setupFixture(minMaxTemplate));

				it('home min value', async() => {
					await clickElem(elem.shadowRoot.querySelector('td[data-date="2"][data-month="1"] button'));
					await sendKeysElem(elem.shadowRoot.querySelector('td[data-date="2"][data-month="1"]'), 'press', 'Home');
					await expect(elem).to.be.golden();
				});

				it('end max value', async() => {
					await clickElem(elem.shadowRoot.querySelector('td[data-date="26"][data-month="1"] button'));
					await sendKeysElem(elem.shadowRoot.querySelector('td[data-date="26"][data-month="1"]'), 'press', 'End');
					await expect(elem).to.be.golden();
				});

				it('pagedown max value', async() => {
					await sendKeysElem(elem.shadowRoot.querySelector('td[data-date="17"]'), 'press', 'PageDown');
					await expect(elem).to.be.golden();
				});

				it('pagedown twice max value', async() => {
					await sendKeysElem(elem.shadowRoot.querySelector('td[data-date="17"]'), 'press', 'PageDown');
					await sendKeysElem(elem.shadowRoot.querySelector('td[data-date="17"]'), 'press', 'PageDown');
					await expect(elem).to.be.golden();
				});

				it('pageup min value', async() => {
					await sendKeysElem(elem.shadowRoot.querySelector('td[data-date="17"]'), 'press', 'PageUp');
					await expect(elem).to.be.golden();
				});

				it('pageup twice min value', async() => {
					await sendKeysElem(elem.shadowRoot.querySelector('td[data-date="17"]'), 'press', 'PageUp');
					await sendKeysElem(elem.shadowRoot.querySelector('td[data-date="17"]'), 'press', 'PageUp');
					await expect(elem).to.be.golden();
				});
			});
		});
	});
});
