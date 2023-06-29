import '../demo/arrow-keys-test.js';
import { expect, fixture, html, sendKeysElem } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';

describe('ArrowKeysMixin', () => {

	let elem, focusables;

	const testKeyInteractions = (keyInteractions) => {
		keyInteractions.forEach((keyInteraction) => {
			it(keyInteraction.name, (done) => {
				elem.arrowKeysOnBeforeFocus = (elem) => {
					return new Promise((resolve) => {
						expect(elem).to.equal(focusables[keyInteraction.endIndex]);
						resolve();
					});
				};
				focusables[keyInteraction.startIndex].focus();
				focusables[keyInteraction.endIndex].addEventListener('focus', () => {
					expect(getComposedActiveElement()).to.equal(focusables[keyInteraction.endIndex]);
					done();
				});
				sendKeysElem(focusables[keyInteraction.startIndex], 'press', keyInteraction.key);
			});
		});
	};

	describe('ltr', () => {

		beforeEach(async() => {
			elem = await fixture(html`<d2l-test-arrow-keys></d2l-test-arrow-keys>`);
			focusables = await elem.arrowKeysFocusablesProvider();
		});

		describe('left-right', () => {
			testKeyInteractions([
				{ name: 'focuses on next focusable when Right arrow key is pressed', startIndex: 2, endIndex: 3, key: 'ArrowRight' },
				{ name: 'focuses on previous focusable when Left arrow key is pressed', startIndex: 2, endIndex: 1, key: 'ArrowLeft' },
				{ name: 'focuses on first focusable when Right arrow key is pressed on last focusable', startIndex: 4, endIndex: 0, key: 'ArrowRight' },
				{ name: 'focuses on last focusable when Left arrow key is pressed on first focusable', startIndex: 0, endIndex: 4, key: 'ArrowLeft' },
				{ name: 'focuses on first focusable when Home key is pressed', startIndex: 2, endIndex: 0, key: 'Home' },
				{ name: 'focuses on last focusable when End key is pressed', startIndex: 2, endIndex: 4, key: 'End' }
			]);
		});

		describe('up-down', () => {

			beforeEach(async() => {
				elem.arrowKeysDirection = 'updown';
				await elem.updateComplete;
				focusables = await elem.arrowKeysFocusablesProvider();
			});

			testKeyInteractions([
				{ name: 'focuses on next focusable when Down arrow key is pressed', startIndex: 2, endIndex: 3, key: 'ArrowDown' },
				{ name: 'focuses on previous focusable when Up arrow key is pressed', startIndex: 2, endIndex: 1, key: 'ArrowUp' },
				{ name: 'focuses on first focusable when Down arrow key is pressed on last focusable', startIndex: 4, endIndex: 0, key: 'ArrowDown' },
				{ name: 'focuses on last focusable when Up arrow key is pressed on first focusable', startIndex: 0, endIndex: 4, key: 'ArrowUp' },
				{ name: 'focuses on first focusable when Home key is pressed', startIndex: 2, endIndex: 0, key: 'Home' },
				{ name: 'focuses on last focusable when End key is pressed', startIndex: 2, endIndex: 4, key: 'End' }
			]);

		});

		describe('nowrap - up-down-left-right', () => {

			beforeEach(async() => {
				elem.arrowKeysDirection = 'updownleftright';
				elem.arrowKeysNoWrap = true;
				await elem.updateComplete;
				focusables = await elem.arrowKeysFocusablesProvider();
			});

			const testNoWrap = (keyInteractions) => {
				for (let i = 0; i < keyInteractions.length; i++) {
					(function(i) {
						it(keyInteractions[i].name, async() => {
							focusables[keyInteractions[i].startIndex].focus();
							sendKeysElem(focusables[[keyInteractions[i].startIndex]], 'press', keyInteractions[i].key);
							await elem.updateComplete;
							expect(getComposedActiveElement()).to.equal(focusables[keyInteractions[i].startIndex]);
						});
					}(i));
				}
			};

			testNoWrap([
				{ name: 'does not focus on last focusable when Left arrow key is pressed on first focusable', startIndex: 0, key: 'ArrowLeft' },
				{ name: 'does not focus on last focusable when Up arrow key is pressed on first focusable', startIndex: 0, key: 'ArrowUp' },
				{ name: 'does not focus on first focusable when Right arrow key is pressed on last focusable', startIndex: 4, key: 'ArrowRight' },
				{ name: 'does not focus on first focusable when Down arrow key is pressed on last focusable', startIndex: 4, key: 'ArrowDown' }
			]);
		});

	});

	describe('rtl', () => {

		beforeEach(async() => {
			elem = await fixture(html`<d2l-test-arrow-keys dir="rtl"></d2l-test-arrow-keys>`);
			focusables = await elem.arrowKeysFocusablesProvider();
		});

		describe('right-left', () => {
			testKeyInteractions([
				{ name: 'focuses on previous focusable when Right arrow key is pressed', startIndex: 2, endIndex: 1, key: 'ArrowRight' },
				{ name: 'focuses on next focusable when Left arrow key is pressed', startIndex: 2, endIndex: 3, key: 'ArrowLeft' },
				{ name: 'focuses on first focusable when Left arrow key is pressed on last focusable', startIndex: 4, endIndex: 0, key: 'ArrowLeft' },
				{ name: 'focuses on last focusable when Right arrow key is pressed on first focusable', startIndex: 0, endIndex: 4, key: 'ArrowRight' },
				{ name: 'focuses on first focusable when Home key is pressed', startIndex: 2, endIndex: 0, key: 'Home' },
				{ name: 'focuses on last focusable when End key is pressed', startIndex: 2, endIndex: 4, key: 'End' }
			]);
		});

	});

});
