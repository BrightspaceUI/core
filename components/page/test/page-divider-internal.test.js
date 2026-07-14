import '../page-divider-internal.js';
import { expect, fixture, nextFrame, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { createDivider } from './page-divider-internal-fixtures.js';

describe('d2l-page-divider-internal', () => {

	it('should construct', () => {
		runConstructor('d2l-page-divider-internal');
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
				const step = 20;
				const largeStep = 80;

				[
					{ name: 'start panel', panelType: 'panel', panelPosition: 'start', grow: 'ArrowRight', shrink: 'ArrowLeft', inactiveKeys: ['ArrowUp', 'ArrowDown'] },
					{ name: 'end panel', panelType: 'panel', panelPosition: 'end', grow: 'ArrowLeft', shrink: 'ArrowRight', inactiveKeys: ['ArrowUp', 'ArrowDown'] },
					{ name: 'drawer', panelType: 'drawer', grow: 'ArrowUp', shrink: 'ArrowDown', inactiveKeys: ['ArrowLeft', 'ArrowRight'] },
					{ name: 'start panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'start', grow: 'ArrowLeft', shrink: 'ArrowRight', inactiveKeys: ['ArrowUp', 'ArrowDown'] },
					{ name: 'end panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'end', grow: 'ArrowRight', shrink: 'ArrowLeft', inactiveKeys: ['ArrowUp', 'ArrowDown'] }
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
								const elem = await fixture(createDivider({ panelType: test.panelType, panelPosition: test.panelPosition }), { rtl: test.rtl });
								sendKeysElem(elem, 'press', key);
								const e = await oneEvent(elem, 'd2l-page-divider-resize');
								expect(e.detail.requestedSize).to.equal(expectedSize);
							});
						});

						[
							{ action: 'grow', key: test.grow, currentSize: maxSize - 10, expectedSize: maxSize },
							{ action: 'shrink', key: test.shrink, currentSize: minSize + 10, expectedSize: minSize },
							{ action: 'large grow', key: 'PageUp', currentSize: maxSize - 40, expectedSize: maxSize },
							{ action: 'large shrink', key: 'PageDown', currentSize: minSize + 40, expectedSize: minSize },
							{ action: 'max', key: 'End', currentSize: maxSize, expectedSize: maxSize },
							{ action: 'min', key: 'Home', currentSize: minSize, expectedSize: minSize }
						].forEach(({ action, key, currentSize, expectedSize }) => {
							it(`does not ${action} past limits`, async() => {
								const elem = await fixture(createDivider({ currentSize, panelType: test.panelType, panelPosition: test.panelPosition }), { rtl: test.rtl });
								sendKeysElem(elem, 'press', key);
								const e = await oneEvent(elem, 'd2l-page-divider-resize');
								expect(e.detail.requestedSize).to.equal(expectedSize);
							});
						});

						it('does not dispatch event when inactive keys pressed', async() => {
							const elem = await fixture(createDivider({ panelType: test.panelType, panelPosition: test.panelPosition }), { rtl: test.rtl });
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
