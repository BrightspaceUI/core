import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import { getRect, getRectTooltip, open, reset } from './input-helper.js';
import puppeteer from 'puppeteer';

describe('d2l-input-date', () => {

	const visualDiff = new VisualDiff('input-date', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1050 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();

		// #opened being opened causes issues with focus with other date inputs being opened.
		// Putting this first in case tests are run in isolation.
		await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
	});

	after(async() => await browser.close());

	[
		'disabled',
		'empty-text',
		'label',
		'label-hidden',
		'placeholder',
		'required',
		'value'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('value-focus', async function() {
		await focusWithKeyboard(page, '#value');
		await page.$eval('#value', (elem) => elem._inputTextFocusShowTooltip = true);
		const rect = await getRectTooltip(page, '#value');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('empty-text-focus', async function() {
		await focusWithKeyboard(page, '#empty-text');
		const rect = await visualDiff.getRect(page, '#empty-text');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('opened behavior', () => {

		before(async() => {
			await page.reload();
			await page.$eval('#opened', async(elem) => await elem.updateComplete);
		});

		after(async() => {
			await page.$eval('#opened-skeleton', (elem) => elem.removeAttribute('opened'));
		});

		it('intially opened', async function() {
			const rect = await getRect(page, '#opened');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-disabled', async function() {
			await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
			const rect = await visualDiff.getRect(page, '#opened-disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-skeleton', async function() {
			const rect = await visualDiff.getRect(page, '#opened-skeleton');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-disabled remove disabled', async function() {
			await page.$eval('#opened-disabled', (elem) => elem.removeAttribute('disabled'));
			const rect = await getRect(page, '#opened-disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-skeleton remove skeleton', async function() {
			await page.$eval('#opened-disabled', (elem) => elem.removeAttribute('opened'));
			await page.$eval('#opened-skeleton', (elem) => elem.removeAttribute('skeleton'));
			const rect = await getRect(page, '#opened-skeleton');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('localization', () => {

		after(async() => {
			await page.evaluate(() => document.querySelector('html').setAttribute('lang', 'en'));
		});

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
			it(`${lang} empty`, async function() {
				await page.evaluate(lang => {
					const input = document.querySelector('#placeholder');
					return new Promise((resolve) => {
						if (document.querySelector('html').getAttribute('lang') !== lang) { // Needed for retries
							input.addEventListener('d2l-localize-resources-change', resolve, { once: true });
							document.querySelector('html').setAttribute('lang', lang);
						} else {
							resolve();
						}
					});
				}, lang);
				const rect = await visualDiff.getRect(page, '#placeholder');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it(`${lang} value`, async function() {
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('calendar dropdown', () => {

		async function openClick(page, selector) {
			await focusWithKeyboard(page, selector);
			return await page.$eval(selector, (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				const e = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);
				input.dispatchEvent(e);
			});
		}

		async function openKey(page, selector, keyCode) {
			keyCode = keyCode || 13;
			return await page.$eval(selector, (elem, keyCode) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = keyCode;
				input.dispatchEvent(eventObj);
			}, keyCode);
		}

		async function setValue(page, selector, value) {
			await page.$eval(selector, async(elem, value) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				input.value = value;
			}, value);
		}

		it('disabled does not open', async function() {
			await openClick(page, '#disabled');
			const rect = await getRect(page, '#disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		describe('with min and max', () => {

			afterEach(async() => await reset(page, '#min-max'));

			it('open', async function() {
				await open(page, '#min-max');
				const rect = await getRect(page, '#min-max');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter', async function() {
				await openKey(page, '#min-max');

				const rect = await getRect(page, '#min-max');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			describe('out of range date typed', () => {
				// min-value="2018-02-13" max-value="2018-02-27"

				async function setValueBlur(page, selector, value) {
					await focusWithKeyboard(page, selector);
					await page.$eval(selector, async(elem, value) => {
						const input = elem.shadowRoot.querySelector('d2l-input-text');
						input.value = value;
						const e = new Event(
							'change',
							{ bubbles: true, composed: false }
						);
						input.dispatchEvent(e);
					}, value);
					await page.$eval(selector, (elem) => elem.blur());
				}

				describe('behavior', () => {
					before(async() => await setValueBlur(page, '#min-max', '10/12/2017'));

					afterEach(async() => {
						await reset(page, '#min-max');
						await page.$eval('#min-max', (elem) => elem.blur());
					});

					it('focus', async function() {
						await focusWithKeyboard(page, '#min-max');
						const rect = await getRectTooltip(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('open', async function() {
						await openClick(page, '#min-max');
						const rect = await getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('open with enter', async function() {
						await openKey(page, '#min-max');
						const rect = await getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});

					it('open then tab', async function() {
						await openClick(page, '#min-max');
						await page.waitForTimeout(100);
						await page.keyboard.press('Tab');
						const rect = await getRect(page, '#min-max');
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});

				describe('behavior on key interaction', () => {

					describe('value before min', () => {
						before(async() => await setValueBlur(page, '#min-max', '10/12/2017'));

						it('left arrow', async function() {
							await openKey(page, '#min-max');
							await page.keyboard.press('ArrowLeft');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});

						it('right arrow', async function() {
							await openKey(page, '#min-max');
							await page.keyboard.press('ArrowRight');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});
					});

					describe('value before min same year', () => {
						before(async() => await setValueBlur(page, '#min-max', '01/02/2018'));

						it('left arrow', async function() {
							await openKey(page, '#min-max');
							await page.keyboard.press('ArrowLeft');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});

						it('right arrow', async function() {
							await openKey(page, '#min-max');
							await page.keyboard.press('ArrowRight');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});
					});

					describe('value after max', () => {
						before(async() => await setValueBlur(page, '#min-max', '01/12/2019'));

						after(async() => await page.$eval('#min-max', (elem) => elem.blur()));

						it('left arrow', async function() {
							await openKey(page, '#min-max');
							await page.keyboard.press('ArrowLeft');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });

						});

						it('right arrow', async function() {
							await openKey(page, '#min-max');
							await page.keyboard.press('ArrowRight');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});
					});

					describe('value after max same month as max', () => {
						before(async() => {
							await page.$eval('#min-max', (elem) => {
								const input = elem.shadowRoot.querySelector('d2l-input-text');
								input.value = '02/12/2019';
							});
						});

						after(async() => {
							await page.$eval('#min-max', (elem) => {
								elem.blur();
							});
						});

						it('left arrow', async function() {
							await openKey(page, '#min-max');
							await page.keyboard.press('ArrowLeft');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });

						});

						it('right arrow', async function() {
							await openKey(page, '#min-max');
							await page.keyboard.press('ArrowRight');
							const rect = await getRect(page, '#min-max');
							await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
						});
					});
				});

			});
		});

		describe('with empty-text', () => {

			afterEach(async() => await reset(page, '#empty-text'));

			it('open', async function() {
				await open(page, '#empty-text');
				const rect = await getRect(page, '#empty-text');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter', async function() {
				await openKey(page, '#empty-text');
				const rect = await getRect(page, '#empty-text');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with click', async function() {
				await openClick(page, '#empty-text');
				const rect = await getRect(page, '#empty-text');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('with placeholder', () => {

			afterEach(async() => await reset(page, '#placeholder'));

			it('open', async function() {
				await open(page, '#placeholder');
				const rect = await getRect(page, '#placeholder');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter', async function() {
				await openKey(page, '#placeholder');
				const rect = await getRect(page, '#placeholder');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with click', async function() {
				await openClick(page, '#placeholder');
				const rect = await getRect(page, '#placeholder');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('with value', () => {

			afterEach(async() => {
				await reset(page, '#value');
				await page.$eval('#value', (elem) => elem.blur());
			});

			it('open', async function() {
				await openClick(page, '#value');
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('tab on open', async function() {
				await openClick(page, '#value');
				await page.keyboard.press('Tab');
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('click date', async function() {
				await openClick(page, '#value');
				await page.$eval('#value', (elem) => {
					const calendar = elem.shadowRoot.querySelector('d2l-calendar');
					const date = calendar.shadowRoot.querySelector('td[data-date="8"] button');
					date.click();
				});
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('set to today', async function() {
				await open(page, '#value');
				await page.$eval('#value', (elem) => {
					const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Today"]');
					button.click();
				});
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('clear', async function() {
				await open(page, '#value');
				await page.$eval('#value', (elem) => {
					const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Clear"]');
					button.click();
				});
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('opens then changes month then closes then reopens', async function() {
				// open
				await openClick(page, '#value');

				// change month
				await page.$eval('#value', (elem) => {
					const calendar = elem.shadowRoot.querySelector('d2l-calendar');
					const button = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
					button.click();
				});

				// close
				await reset(page, '#value');

				// re-open
				await openClick(page, '#value');

				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with click after text input', async function() {
				await setValue(page, '#value', '01/10/2030');
				await openClick(page, '#value');
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with click after empty text input', async function() {
				await setValue(page, '#value', '');
				await openClick(page, '#value');
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter after text input', async function() {
				await setValue(page, '#value', '11/21/2031');
				await openKey(page, '#value');
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with enter after empty text input', async function() {
				await setValue(page, '#value', '');
				await openKey(page, '#value');
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with down arrow after text input', async function() {
				await setValue(page, '#value', '08/30/2032');
				await openKey(page, '#value', 40);
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open with down arrow after empty text input', async function() {
				await setValue(page, '#value', '');
				await openKey(page, '#value', 40);
				const rect = await getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open then close', async function() {
				// test to confirm that when focus returns to the input on close the tooltip does not appear
				await openKey(page, '#value');
				await page.$eval('#value', (elem) => {
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 27;
					elem.dispatchEvent(eventObj);
				});
				const rect = await visualDiff.getRect(page, '#value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('required', () => {

			afterEach(async() => await reset(page, '#required'));

			it('required focus then blur', async function() {
				await focusWithKeyboard(page, '#required');
				await page.$eval('#required', (elem) => elem.blur());
				const rect = await visualDiff.getRect(page, '#required');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('required focus then blur then fix', async function() {
				await focusWithKeyboard(page, '#required');
				await page.$eval('#required', (elem) => elem.blur());
				await page.$eval('#required', (elem) => {
					elem.value = '2020-01-01';
					const e = new Event(
						'change',
						{ bubbles: true, composed: false }
					);
					elem.dispatchEvent(e);
				});
				const rect = await visualDiff.getRect(page, '#required');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it('open required with enter after empty text input', async function() {
				await visualDiff.resetFocus(page);
				await setValue(page, '#required-value', '');
				await openKey(page, '#required-value');
				const rect = await getRect(page, '#required-value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				await reset(page, '#required-value');
			});
		});
	});

	describe('skeleton', () => {
		[
			'label',
			'label-hidden'
		].forEach((name) => {
			before(async() => {
				await page.reload();
				await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
			});

			it(name, async function() {
				await page.$eval(`#${name}`, (elem) => elem.skeleton = true);
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});
});
