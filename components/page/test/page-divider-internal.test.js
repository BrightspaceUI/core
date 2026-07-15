import { createDivider, getSlider } from './page-divider-internal-fixtures.js';
import { expect, fixture, html, nextFrame, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { KEYBOARD_STEP, KEYBOARD_STEP_LARGE } from '../page-divider-internal.js';

describe('d2l-page-divider-internal', () => {

	it('should construct', () => {
		runConstructor('d2l-page-divider-internal');
	});

	describe('accessibility', () => {
		it('calculates aria values correctly', async() => {
			const elem = await fixture(html`<d2l-page-divider-internal label="Resize" min-size="100" max-size="200" current-size="150"></d2l-page-divider-internal>`);
			const slider = getSlider(elem);
			expect(slider.getAttribute('aria-valuemax')).to.equal('200');
			expect(slider.getAttribute('aria-valuemin')).to.equal('0');
			expect(slider.getAttribute('aria-valuenow')).to.equal('150');
			expect(slider.getAttribute('aria-valuetext')).to.equal('75 %');
		});

		it('does not set aria values when in unknown state', async() => {
			const elem = await fixture(html`<d2l-page-divider-internal label="Resize"></d2l-page-divider-internal>`);
			const slider = getSlider(elem);
			expect(slider.hasAttribute('aria-valuemax')).to.be.false;
			expect(slider.hasAttribute('aria-valuemin')).to.be.false;
			expect(slider.hasAttribute('aria-valuenow')).to.be.false;
			expect(slider.hasAttribute('aria-valuetext')).to.be.false;
		});
	});

	describe('events', () => {
		describe('d2l-page-divider-toggle', () => {
			describe('keyboard', () => {
				['Enter', ' '].forEach(key => {
					it(`dispatches d2l-page-divider-toggle on "${key === ' ' ? 'Space' : key}"`, async() => {
						const elem = await fixture(createDivider());
						sendKeysElem(elem, 'press', key);
						const e = await oneEvent(elem, 'd2l-page-divider-toggle');
						expect(e.detail).to.be.null; // TO DO: Will eventually have the collapse state
					});
				});
			});

			describe('mouse', () => {
				// TO DO
			});

		});

		describe('d2l-page-divider-resize', () => {
			describe('keyboard', () => {
				const currentSize = 450;
				const minSize = 320;
				const maxSize = 600;
				const step = KEYBOARD_STEP;
				const halfStep = Math.ceil(step / 2);
				const largeStep = KEYBOARD_STEP_LARGE;
				const halfLargeStep = Math.ceil(largeStep / 2);

				[
					{ name: 'start panel', panelType: 'panel', panelPosition: 'start', grow: 'ArrowRight', shrink: 'ArrowLeft', inactiveKeys: ['ArrowUp', 'ArrowDown'] },
					{ name: 'end panel', panelType: 'panel', panelPosition: 'end', grow: 'ArrowLeft', shrink: 'ArrowRight', inactiveKeys: ['ArrowUp', 'ArrowDown'] },
					{ name: 'drawer', panelType: 'drawer', grow: 'ArrowUp', shrink: 'ArrowDown', inactiveKeys: ['ArrowLeft', 'ArrowRight'] },
					{ name: 'start panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'start', grow: 'ArrowLeft', shrink: 'ArrowRight', inactiveKeys: ['ArrowUp', 'ArrowDown'] },
					{ name: 'end panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'end', grow: 'ArrowRight', shrink: 'ArrowLeft', inactiveKeys: ['ArrowUp', 'ArrowDown'] },
					{ name: 'drawer rtl', rtl: true, panelType: 'drawer', grow: 'ArrowUp', shrink: 'ArrowDown', inactiveKeys: ['ArrowLeft', 'ArrowRight'] },
				].forEach(test => {

					describe(test.name, () => {

						[
							{ action: 'grow', key: test.grow, expectedSize: currentSize + step },
							{ action: 'shrink', key: test.shrink, expectedSize: currentSize - step },
							{ action: 'large grow', key: 'PageUp', expectedSize: currentSize + largeStep },
							{ action: 'large shrink', key: 'PageDown', expectedSize: currentSize - largeStep },
							{ action: 'max', key: 'End', expectedSize: maxSize },
							{ action: 'min', key: 'Home', expectedSize: minSize }
						].forEach(({ action, key, expectedSize }) => {
							it(`dispatches event with requestedSize ${expectedSize} when "${action}" action requested (Key: ${key})`, async() => {
								const elem = await fixture(
									createDivider({ panelType: test.panelType, panelPosition: test.panelPosition }),
									{ rtl: test.rtl }
								);
								sendKeysElem(elem, 'press', key);
								const e = await oneEvent(elem, 'd2l-page-divider-resize');
								expect(e.detail.requestedSize).to.equal(expectedSize);
							});
						});

						[
							{ action: 'grow', key: test.grow, currentSize: maxSize - halfStep, expectedSize: maxSize },
							{ action: 'shrink', key: test.shrink, currentSize: minSize + halfStep, expectedSize: minSize },
							{ action: 'large grow', key: 'PageUp', currentSize: maxSize - halfLargeStep, expectedSize: maxSize },
							{ action: 'large shrink', key: 'PageDown', currentSize: minSize + halfLargeStep, expectedSize: minSize },
							{ action: 'max', key: 'End', currentSize: maxSize, expectedSize: maxSize },
							{ action: 'min', key: 'Home', currentSize: minSize, expectedSize: minSize }
						].forEach(({ action, key, currentSize, expectedSize }) => {
							it(`does not ${action} past limits`, async() => {
								const elem = await fixture(
									createDivider({ currentSize, panelType: test.panelType, panelPosition: test.panelPosition }),
									{ rtl: test.rtl }
								);
								sendKeysElem(elem, 'press', key);
								const e = await oneEvent(elem, 'd2l-page-divider-resize');
								expect(e.detail.requestedSize).to.equal(expectedSize);
							});
						});

						it('does not dispatch event when inactive keys pressed', async() => {
							const elem = await fixture(
								createDivider({ panelType: test.panelType, panelPosition: test.panelPosition }),
								{ rtl: test.rtl }
							);
							let dispatched = false;
							elem.addEventListener('d2l-page-divider-resize', () => dispatched = true);
							for (const key of test.inactiveKeys) {
								await sendKeysElem(elem, 'press', key);
							}
							await nextFrame();
							expect(dispatched).to.be.false;
						});
					});
				});
			});

			describe('mouse', () => {
				// TO DO
			});
		});
	});
});
