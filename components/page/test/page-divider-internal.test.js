import { clickElem, expect, fixture, focusElem, html, nextFrame, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
import { createDivider, getDividerArrow, getSlider } from './page-divider-internal-fixtures.js';
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
					it(`dispatches event on "${key === ' ' ? 'Space' : key}"`, async() => {
						const elem = await fixture(createDivider());
						sendKeysElem(elem, 'press', key);
						await oneEvent(elem, 'd2l-page-divider-toggle');
					});
				});
			});

			describe('mouse', () => {
				it('dispatches event when handle is clicked', async() => {
					const elem = await fixture(createDivider());
					clickElem(getSlider(elem));
					await oneEvent(elem, 'd2l-page-divider-toggle');
				});

				it('does not dispatch event when divider line is clicked', async() => {
					const elem = await fixture(createDivider());
					let dispatched = false;
					elem.addEventListener('d2l-page-divider-toggle', () => dispatched = true);
					await clickElem(elem);
					expect(dispatched).to.be.false;
				});

				it('dispatches event when handle is clicked if collapsed', async() => {
					const elem = await fixture(createDivider({ collapsed: true }));
					clickElem(getSlider(elem));
					await oneEvent(elem, 'd2l-page-divider-toggle');
				});

				it('dispatches event when divider line is clicked if collapsed', async() => {
					const elem = await fixture(createDivider({ collapsed: true }));
					clickElem(elem);
					await oneEvent(elem, 'd2l-page-divider-toggle');
				});
			});

		});

		describe('d2l-page-divider-resize', () => {
			const currentSize = 450;
			const minSize = 320;
			const maxSize = 600;
			const step = KEYBOARD_STEP;
			const halfStep = Math.ceil(step / 2);
			const largeStep = KEYBOARD_STEP_LARGE;
			const halfLargeStep = Math.ceil(largeStep / 2);

			describe('keyboard', () => {
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
				describe('arrow click', () => {
					[
						{ name: 'start panel', panelPosition: 'start', growArrow: 'end', shrinkArrow: 'start' },
						{ name: 'end panel', panelPosition: 'end', growArrow: 'start', shrinkArrow: 'end' },
						{ name: 'start panel in rtl', rtl: true, panelPosition: 'start', growArrow: 'end', shrinkArrow: 'start' },
						{ name: 'end panel in rtl', rtl: true, panelPosition: 'end', growArrow: 'start', shrinkArrow: 'end' },
					].forEach(test => {

						describe(test.name, () => {
							[
								{ action: 'grow', arrow: test.growArrow, expectedSize: currentSize + step },
								{ action: 'shrink', arrow: test.shrinkArrow, expectedSize: currentSize - step }
							].forEach(({ action, arrow, expectedSize }) => {
								it(`dispatches event with requestedSize ${expectedSize} when "${action}" action requested (Arrow: ${arrow})`, async() => {
									const elem = await fixture(
										createDivider({ panelPosition: test.panelPosition }),
										{ rtl: test.rtl }
									);
									await focusElem(elem);
									clickElem(getDividerArrow(elem, arrow));
									const e = await oneEvent(elem, 'd2l-page-divider-resize');
									expect(e.detail.requestedSize).to.equal(expectedSize);
								});
							});

							[
								{ action: 'grow', arrow: test.growArrow, currentSize: maxSize - halfStep, expectedSize: maxSize },
								{ action: 'shrink', arrow: test.shrinkArrow, currentSize: minSize + halfStep, expectedSize: minSize }
							].forEach(({ action, arrow, currentSize, expectedSize }) => {
								it(`does not ${action} past limits`, async() => {
									const elem = await fixture(
										createDivider({ currentSize, panelPosition: test.panelPosition }),
										{ rtl: test.rtl }
									);
									await focusElem(elem);
									clickElem(getDividerArrow(elem, arrow));
									const e = await oneEvent(elem, 'd2l-page-divider-resize');
									expect(e.detail.requestedSize).to.equal(expectedSize);
								});
							});

							[
								{ arrow: test.growArrow, currentSize: maxSize },
								{ arrow: test.shrinkArrow, currentSize: minSize }
							].forEach(({ arrow, currentSize }) => {
								it(`${arrow} arrow does not appear at limit`, async() => {
									const elem = await fixture(
										createDivider({ currentSize, panelPosition: test.panelPosition }),
										{ rtl: test.rtl }
									);
									const arrowElem = getDividerArrow(elem, arrow);
									expect(arrowElem.hidden).to.be.true;
								});
							});

							it('shrink arrow does not appear when collapsed', async() => {
								const elem = await fixture(
									createDivider({ collapsed: true, currentSize, panelPosition: test.panelPosition }),
									{ rtl: test.rtl }
								);
								const arrowElem = getDividerArrow(elem, test.shrinkArrow);
								expect(arrowElem.hidden).to.be.true;
							});

							it('grow arrow appears and requests a resize to min size when collapsed', async() => {
								const elem = await fixture(
									createDivider({ collapsed: true, currentSize: 0, panelPosition: test.panelPosition }),
									{ rtl: test.rtl }
								);
								await focusElem(elem);
								clickElem(getDividerArrow(elem, test.growArrow));
								const e = await oneEvent(elem, 'd2l-page-divider-resize');
								expect(e.detail.requestedSize).to.equal(minSize);
							});
						});
					});

					it('arrows do not appear in drawer mode', async() => {
						const elem = await fixture(createDivider({ panelType: 'drawer' }));
						const arrows = elem.shadowRoot.querySelectorAll('.divider-arrow');
						expect(arrows.length).to.equal(0);
					});
				});

				describe('dragging', () => {
					// TO DO
				});
			});
		});
	});
});
