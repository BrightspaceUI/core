import '../input-date.js';
import { clickElem, expect, fixture, focusElem, html, nextFrame, oneEvent, sendKeys, sendKeysElem } from '@brightspace-ui/testing';
import { reset, useFakeTimers } from 'sinon';
import { ifDefined } from 'lit-html/directives/if-defined.js';

const create = (opts = {}) => {
	const { disabled, emptyText, label, labelHidden, maxValue, minValue, opened, required, skeleton, value } = {
		disabled: false,
		label: 'Start Date',
		labelHidden: true,
		opened: false,
		required: false,
		skeleton: false,
		...opts
	};
	return html`
		<d2l-input-date
			?disabled="${disabled}"
			empty-text="${ifDefined(emptyText)}"
			label="${label}"
			?label-hidden="${labelHidden}"
			max-value="${ifDefined(maxValue)}"
			min-value="${ifDefined(minValue)}"
			?opened="${opened}"
			?required="${required}"
			?skeleton="${skeleton}"
			value="${ifDefined(value)}"></d2l-input-date>
	`;
};

const disabledFixture = create({ disabled: true, value: '1990-01-01' });
const emptyTextFixture = create({ emptyText: 'No reminder date ever entered' });
const labelFixture = create({ labelHidden: false, value: '2019-03-02' });
const labelHiddenFixture = create({ value: '2020-12-30' });
const minMaxFixture = create({ maxValue: '2018-02-27', minValue: '2018-02-13' });
const placeholderFixture = create();
const requiredFixture = create({ label: 'Date', labelHidden: false, required: true });
const valueFixture = create({ value: '2019-12-20' });

const newToday = new Date('2018-02-12T12:00Z');

describe('d2l-input-date', () => {

	before(() => useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] }));
	after(() => reset());

	[
		{ name: 'disabled', template: disabledFixture },
		{ name: 'empty-text', template: emptyTextFixture },
		{ name: 'empty-text-focus', template: emptyTextFixture, focus: true },
		{ name: 'label', template: labelFixture },
		{ name: 'label-hidden', template: labelHiddenFixture },
		{ name: 'placeholder', template: placeholderFixture },
		{ name: 'required', template: requiredFixture },
		{ name: 'value', template: valueFixture },
		{ name: 'value-focus', template: valueFixture, focus: true },
	].forEach(({ name, template, focus }) => {
		it(name, async() => {
			const elem = await fixture(template);
			if (focus) {
				await focusElem(elem);
				elem._inputTextFocusShowTooltip = true;
				await nextFrame();
			}
			await expect(elem).to.be.golden();
		});
	});

	describe('opened behavior', () => {

		it('intially opened', async() => {
			const elem = await fixture(create({ opened: true, value: '2019-12-20' }));
			await expect(elem).to.be.golden();
		});

		it('opened-disabled', async() => {
			const elem = await fixture(create({ disabled: true, opened: true }));
			await expect(elem).to.be.golden();
		});

		it('opened-skeleton', async() => {
			const elem = await fixture(create({ opened: true, skeleton: true }));
			await expect(elem).to.be.golden();
		});

		it('opened-disabled remove disabled', async() => {
			const elem = await fixture(create({ disabled: true, opened: true }));
			elem.disabled = false;
			await oneEvent(elem, 'd2l-input-date-dropdown-toggle');
			await expect(elem).to.be.golden();
		});

		it('opened-skeleton remove skeleton', async() => {
			const elem = await fixture(create({ opened: true, skeleton: true }));
			elem.skeleton = false;
			await oneEvent(elem, 'd2l-input-date-dropdown-toggle');
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
			'ja',
			'ko',
			'nl',
			'pt',
			'sv',
			'tr',
			'zh',
			'zh-tw'
		].forEach((lang) => {
			it(`${lang} empty`, async() => {
				const elem = await fixture(placeholderFixture, { lang });
				await expect(elem).to.be.golden();
			});
			it(`${lang} value`, async() => {
				const elem = await fixture(valueFixture, { lang });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('calendar dropdown', () => {

		it('disabled does not open', async() => {
			const elem = await fixture(disabledFixture);
			await clickElem(elem);
			await expect(elem).to.be.golden();
		});

		describe('with min and max', () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(minMaxFixture);
			});

			it('open', async() => {
				await clickElem(elem);
				await expect(elem).to.be.golden();
			});

			it('open with enter', async() => {
				await sendKeysElem(elem, 'press', 'Enter');
				await expect(elem).to.be.golden();
			});

			describe('out of range date typed', () => {
				// min-value="2018-02-13" max-value="2018-02-27"

				async function setValueBlur(elem, value) {
					await focusElem(elem);
					await sendKeysElem(elem, 'type', value);
					await sendKeysElem(elem, 'press', 'Tab');
				}

				describe('behavior', () => {
					beforeEach(async() => await setValueBlur(elem, '10/12/2017'));

					it('focus', async() => {
						await focusElem(elem);
						await nextFrame();
						await expect(elem).to.be.golden();
					});

					it('open', async() => {
						await clickElem(elem);
						await expect(elem).to.be.golden();
					});

					it('open with enter', async() => {
						await sendKeysElem(elem, 'press', 'Enter');
						await expect(elem).to.be.golden();
					});

					it('open then tab', async() => {
						await clickElem(elem);
						await sendKeysElem(elem, 'press', 'Tab');
						await expect(elem).to.be.golden();
					});
				});

				describe('behavior on key interaction', () => {
					[
						{ name: 'value before min', value: '10/12/2017' },
						{ name: 'value before min same year', value: '01/02/2018' },
						{ name: 'value after max', value: '01/12/2019' },
						{ name: 'value after max same month as max', value: '02/12/2019' },
					].forEach(({ name, value }) => {
						it(`${name} left arrow`, async() => {
							await setValueBlur(elem, value);
							await sendKeysElem(elem, 'press', 'Enter');
							await sendKeys('press', 'ArrowLeft');
							await expect(elem).to.be.golden();
						});
						it(`${name } right arrow`, async() => {
							await setValueBlur(elem, value);
							await sendKeysElem(elem, 'press', 'Enter');
							await sendKeys('press', 'ArrowRight');
							await expect(elem).to.be.golden();
						});
					});
				});

			});
		});

		describe('with value', () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(valueFixture);
			});

			it('open', async() => {
				await clickElem(elem);
				await expect(elem).to.be.golden();
			});

			it('tab on open', async() => {
				await clickElem(elem);
				await sendKeysElem(elem, 'press', 'Tab');
				await expect(elem).to.be.golden();
			});

			it('click date', async() => {
				await clickElem(elem);
				await clickElem(elem.shadowRoot.querySelector('d2l-calendar').shadowRoot.querySelector('td[data-date="8"] button'));
				await expect(elem).to.be.golden();
			});

			it('set to today', async() => {
				await clickElem(elem);
				await clickElem(elem.shadowRoot.querySelector('d2l-button-subtle[text="Today"]'));
				await expect(elem).to.be.golden();
			});

			it('clear', async() => {
				await clickElem(elem);
				await clickElem(elem.shadowRoot.querySelector('d2l-button-subtle[text="Clear"]'));
				await expect(elem).to.be.golden();
			});

			it('opens then changes month then closes then reopens', async() => {
				await clickElem(elem);
				await clickElem(elem.shadowRoot.querySelector('d2l-calendar').shadowRoot.querySelector('d2l-button-icon[text="Show January"]'));
				await sendKeys('press', 'Escape');
				await clickElem(elem);
				await expect(elem).to.be.golden();
			});

			it('open with click after text input', async() => {
				elem.shadowRoot.querySelector('d2l-input-text').value = '01/10/2030';
				await clickElem(elem);
				await expect(elem).to.be.golden();
			});

			it('open with click after empty text input', async() => {
				elem.shadowRoot.querySelector('d2l-input-text').value = '';
				await clickElem(elem);
				await expect(elem).to.be.golden();
			});

			it('open with enter after text input', async() => {
				elem.shadowRoot.querySelector('d2l-input-text').value = '11/21/2031';
				await sendKeysElem(elem, 'press', 'Enter');
				await expect(elem).to.be.golden();
			});

			it('open with enter after empty text input', async() => {
				elem.shadowRoot.querySelector('d2l-input-text').value = '';
				await sendKeysElem(elem, 'press', 'Enter');
				await expect(elem).to.be.golden();
			});

			it('open with down arrow after text input', async() => {
				elem.shadowRoot.querySelector('d2l-input-text').value = '08/30/2032';
				await sendKeysElem(elem, 'press', 'ArrowDown');
				await expect(elem).to.be.golden();
			});

			it('open with down arrow after empty text input', async() => {
				elem.shadowRoot.querySelector('d2l-input-text').value = '';
				await sendKeysElem(elem, 'press', 'ArrowDown');
				await expect(elem).to.be.golden();
			});

			it('open then close', async() => {
				await sendKeysElem(elem, 'press', 'Enter');
				await sendKeys('press', 'Escape');
				await expect(elem).to.be.golden();
			});
		});

		describe('required', () => {

			let elem;
			beforeEach(async() => {
				elem = await fixture(requiredFixture);
			});

			it('required focus then blur', async() => {
				await focusElem(elem);
				await sendKeys('press', 'Tab');
				await expect(elem).to.be.golden();
			});

			it('required focus then blur then fix', async() => {
				await focusElem(elem);
				await sendKeys('press', 'Tab');
				elem.value = '2020-01-01';
				elem.dispatchEvent(new Event('change', { bubbles: true, composed: false }));
				await expect(elem).to.be.golden();
			});

			it('open required with enter after empty text input', async() => {
				elem.shadowRoot.querySelector('d2l-input-text').value = '';
				await sendKeysElem(elem, 'press', 'Enter');
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('skeleton', () => {
		[
			{ name: 'label', template: create({ labelHidden: false, skeleton: true, value: '2019-03-02' }) },
			{ name: 'label-hidden', template: create({ skeleton: true, value: '2020-12-30' }) },
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('defects', () => {

		it('DE53025', async() => {
			const elem = await fixture(html`
				<fieldset style="border: none; display: inline; margin: 0; padding: 0;" id="de53025">
					<label>label</label>
					<div style="position: relative;">
						<d2l-input-date label="Date" label-hidden></d2l-input-date>
					</div>
				</fieldset>
			`);
			await expect(elem).to.be.golden();
		});

	});

	describe('mobile', () => {

		const mobileViewport = { height: 500, width: 600 };

		describe('open', () => {
			[
				{ name: 'min-max', template: minMaxFixture },
				{ name: 'placeholder', template: placeholderFixture },
				{ name: 'value', template: valueFixture }
			].forEach(({ name, template }) => {
				it.only(name, async() => {
					const elem = await fixture(template, { viewport: mobileViewport });
					await sendKeysElem(elem, 'press', 'ArrowDown');
					await expect(elem).to.be.golden();
				});
			});
		});

	});

});
