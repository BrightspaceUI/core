import { clickArrow, clickHandle, createDivider, dragArrow, dragDivider, dragHandle, getDividerArrow, getSlider } from './page-divider-internal-fixtures.js';
import { clickElem, expect, fixture, html, nextFrame, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';
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
					clickHandle(elem);
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
					clickHandle(elem);
					await oneEvent(elem, 'd2l-page-divider-toggle');
				});

				it('dispatches event when divider line is clicked if collapsed', async() => {
					const elem = await fixture(createDivider({ collapsed: true }));
					clickElem(elem);
					await oneEvent(elem, 'd2l-page-divider-toggle');
				});

				describe('dragging', () => {
					const collapsedSize = 14;
					const currentSize = 450;
					const minSize = 320;
					const dragDistance = 250;
					const autoCollapseDistance = currentSize - (minSize * 0.75);
					const autoExpandDistance = minSize * 0.1 - collapsedSize;

					[
						{ name: 'start panel', panelType: 'panel', panelPosition: 'start', growPositive: true, coord: 'x' },
						{ name: 'end panel', panelType: 'panel', panelPosition: 'end', growPositive: false, coord: 'x' },
						{ name: 'drawer', panelType: 'drawer', growPositive: false, coord: 'y' },
						{ name: 'start panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'start', growPositive: false, coord: 'x' },
						{ name: 'end panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'end', growPositive: true, coord: 'x' },
						{ name: 'drawer in rtl', rtl: true, panelType: 'drawer', growPositive: false, coord: 'y' },
					].forEach(test => {

						describe(test.name, () => {

							it('dispatches event when dragging expands a collapsed panel', async() => {
								const elem = await fixture(
									createDivider({ collapsed: true, currentSize: 0, panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
									{ rtl: test.rtl }
								);
								dragDivider(elem, { [test.coord]: dragDistance * (test.growPositive ? 1 : -1) });
								await oneEvent(elem, 'd2l-page-divider-toggle');
							});

							it('dispatches event when dragging collapses an expanded panel', async() => {
								const elem = await fixture(
									createDivider({ panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
									{ rtl: test.rtl }
								);
								dragDivider(elem, { [test.coord]: dragDistance * (test.growPositive ? -1 : 1) });
								await oneEvent(elem, 'd2l-page-divider-toggle');
							});

							it('does not dispatch event when dragging to resize within limits', async() => {
								const elem = await fixture(
									createDivider({ panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
									{ rtl: test.rtl }
								);
								let dispatched = false;
								elem.addEventListener('d2l-page-divider-toggle', () => dispatched = true);
								await dragDivider(elem, { [test.coord]: 50 * (test.growPositive ? 1 : -1) });
								await dragDivider(elem, { [test.coord]: 100 * (test.growPositive ? -1 : 1) });
								expect(dispatched).to.be.false;
							});

							it('does not dispatch event when dragging above auto-collapse factor', async() => {
								const elem = await fixture(
									createDivider({ panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
									{ rtl: test.rtl }
								);
								let dispatched = false;
								elem.addEventListener('d2l-page-divider-toggle', () => dispatched = true);
								await dragDivider(elem, { [test.coord]: autoCollapseDistance * (test.growPositive ? -1 : 1) });
								expect(dispatched).to.be.false;
							});

							it('does not dispatch event when dragging below auto-expand factor', async() => {
								const elem = await fixture(
									createDivider({ collapsed: true, currentSize: 0, panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
									{ rtl: test.rtl }
								);
								let dispatched = false;
								elem.addEventListener('d2l-page-divider-toggle', () => dispatched = true);
								await dragDivider(elem, { [test.coord]: autoExpandDistance * (test.growPositive ? 1 : -1) });
								expect(dispatched).to.be.false;
							});
						});
					});

					it('dispatches event when the handle is dragged', async() => {
						const elem = await fixture(createDivider({ margin: 350 }));
						dragHandle(elem, { x: -250 });
						await oneEvent(elem, 'd2l-page-divider-toggle');
					});

					it('does not dispatch event when the arrows are dragged', async() => {
						const elem = await fixture(createDivider({ margin: 350 }));
						let dispatched = false;
						elem.addEventListener('d2l-page-divider-toggle', () => dispatched = true);
						await dragArrow(elem, 'start', { x: -250 });
						expect(dispatched).to.be.false;
					});
				});
			});

		});

		describe('d2l-page-divider-resize', () => {
			const collapsedSize = 14;
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
									clickArrow(elem, arrow);
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
									clickArrow(elem, arrow);
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

							[0, collapsedSize].forEach(size => {
								it(`both arrows are hidden when currentSize is ${size}`, async() => {
									const elem = await fixture(
										createDivider({ currentSize: size, panelPosition: test.panelPosition }),
										{ rtl: test.rtl }
									);
									const shrinkArrowElem = getDividerArrow(elem, test.shrinkArrow);
									expect(shrinkArrowElem.hidden).to.be.true;
									const growArrowElem = getDividerArrow(elem, test.growArrow);
									expect(growArrowElem.hidden).to.be.true;
								});
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
					const dragDistance = 50;
					const halfDragDistance = dragDistance / 2;
					const autoCollapseDistance = currentSize - (minSize * 0.75);
					[
						{ name: 'start panel', panelType: 'panel', panelPosition: 'start', growPositive: true, coord: 'x' },
						{ name: 'end panel', panelType: 'panel', panelPosition: 'end', growPositive: false, coord: 'x' },
						{ name: 'drawer', panelType: 'drawer', growPositive: false, coord: 'y' },
						{ name: 'start panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'start', growPositive: false, coord: 'x' },
						{ name: 'end panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'end', growPositive: true, coord: 'x' },
						{ name: 'drawer in rtl', rtl: true, panelType: 'drawer', growPositive: false, coord: 'y' },
					].forEach(test => {

						describe(test.name, () => {
							[
								{ action: 'grow', dragSign: test.growPositive ? 1 : -1, expectedSize: currentSize + dragDistance },
								{ action: 'shrink', dragSign: test.growPositive ? -1 : 1, expectedSize: currentSize - dragDistance }
							].forEach(({ action, dragSign, expectedSize }) => {
								it(`dispatches event with requestedSize ${expectedSize} when dragged to ${action}`, async() => {
									const elem = await fixture(
										createDivider({ panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
										{ rtl: test.rtl }
									);
									dragDivider(elem, { [test.coord]: dragDistance * dragSign });
									const e = await oneEvent(elem, 'd2l-page-divider-resize');
									expect(e.detail.requestedSize).to.equal(expectedSize);
								});
							});

							[
								{ action: 'grow', dragSign: test.growPositive ? 1 : -1, currentSize: maxSize - halfDragDistance, expectedSize: maxSize },
								{ action: 'shrink', dragSign: test.growPositive ? -1 : 1, currentSize: minSize + halfDragDistance, expectedSize: minSize }
							].forEach(({ action, dragSign, currentSize, expectedSize }) => {
								it(`does not ${action} past limits`, async() => {
									const elem = await fixture(
										createDivider({ currentSize, panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
										{ rtl: test.rtl }
									);
									dragDivider(elem, { [test.coord]: dragDistance * dragSign });
									const e = await oneEvent(elem, 'd2l-page-divider-resize');
									expect(e.detail.requestedSize).to.equal(expectedSize);
								});
							});

							it('does not dispatch event when dragged closed (keep previous size stored)', async() => {
								const elem = await fixture(
									createDivider({ panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
									{ rtl: test.rtl }
								);
								let dispatched = false;
								elem.addEventListener('d2l-page-divider-resize', () => dispatched = true);
								await dragDivider(elem, { [test.coord]: (autoCollapseDistance + 20) * (test.growPositive ? -1 : 1) });
								expect(dispatched).to.be.false;
							});

							it('dispatches event when dragged open', async() => {
								const elem = await fixture(
									createDivider({ collapsed: true, currentSize: 0, panelType: test.panelType, panelPosition: test.panelPosition, margin: 400 }),
									{ rtl: test.rtl, viewport: { width: 900, height: 900 } }
								);

								dragDivider(elem, { [test.coord]: 375 * (test.growPositive ? 1 : -1) });
								const e = await oneEvent(elem, 'd2l-page-divider-resize');
								expect(e.detail.requestedSize).to.equal(collapsedSize + 375);
							});

							it('dispatches event when dragged slightly open (update to min panel size)', async() => {
								const elem = await fixture(
									createDivider({ collapsed: true, currentSize: 0, panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
									{ rtl: test.rtl }
								);

								dragDivider(elem, { [test.coord]: 3 * (test.growPositive ? 1 : -1) });
								const e = await oneEvent(elem, 'd2l-page-divider-resize');
								expect(e.detail.requestedSize).to.equal(minSize);
							});

							it('does not dispatch event when drag does not exceed threshold', async() => {
								const elem = await fixture(
									createDivider({ panelType: test.panelType, panelPosition: test.panelPosition }),
									{ rtl: test.rtl }
								);
								let dispatched = false;
								elem.addEventListener('d2l-page-divider-resize', () => dispatched = true);
								await dragDivider(elem, { [test.coord]: 2 });
								expect(dispatched).to.be.false;
							});
						});
					});

					it('dispatches event when the handle is dragged', async() => {
						const elem = await fixture(createDivider({ margin: 350 }));
						dragHandle(elem, { x: 50 });
						const e = await oneEvent(elem, 'd2l-page-divider-resize');
						expect(e.detail.requestedSize).to.equal(currentSize + 50);
					});

					it('does not dispatch event when the arrows are dragged', async() => {
						const elem = await fixture(createDivider({ margin: 350 }));
						let dispatched = false;
						elem.addEventListener('d2l-page-divider-resize', () => dispatched = true);
						await dragArrow(elem, 'end', { x: 50 });
						expect(dispatched).to.be.false;
					});
				});
			});
		});

		describe('d2l-page-divider-resize-live', () => {
			const collapsedSize = 14;
			const currentSize = 450;
			const minSize = 320;
			const maxSize = 600;
			const dragDistance = 50;
			[
				{ name: 'start panel', panelType: 'panel', panelPosition: 'start', growPositive: true, coord: 'x' },
				{ name: 'end panel', panelType: 'panel', panelPosition: 'end', growPositive: false, coord: 'x' },
				{ name: 'drawer', panelType: 'drawer', growPositive: false, coord: 'y' },
				{ name: 'start panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'start', growPositive: false, coord: 'x' },
				{ name: 'end panel in rtl', rtl: true, panelType: 'panel', panelPosition: 'end', growPositive: true, coord: 'x' },
				{ name: 'drawer in rtl', rtl: true, panelType: 'drawer', growPositive: false, coord: 'y' },
			].forEach(test => {

				describe(test.name, () => {
					[
						{ action: 'growing', dragSign: test.growPositive ? 1 : -1, expectedSize: currentSize + dragDistance },
						{ action: 'shrinking', dragSign: test.growPositive ? -1 : 1, expectedSize: currentSize - dragDistance }
					].forEach(({ action, dragSign, expectedSize }) => {
						it(`dispatches events throughout drag while ${action}`, async() => {
							const elem = await fixture(
								createDivider({ panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
								{ rtl: test.rtl }
							);
							const requestedSizes = [];
							let resizeCount = 0;
							elem.addEventListener('d2l-page-divider-resize-live', (e) => requestedSizes.push(e.detail.requestedSize));
							elem.addEventListener('d2l-page-divider-resize', () => resizeCount += 1);
							await dragDivider(elem, { [test.coord]: dragDistance * dragSign });

							expect(requestedSizes.length).to.be.greaterThan(1);
							expect(requestedSizes.at(-1)).to.equal(expectedSize);
							expect(resizeCount).to.equal(1);
						});
					});

					it('clamps to max size while dragging past max', async() => {
						const elem = await fixture(
							createDivider({ currentSize: maxSize - 30, panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
							{ rtl: test.rtl }
						);
						const requestedSizes = [];
						elem.addEventListener('d2l-page-divider-resize-live', (e) => requestedSizes.push(e.detail.requestedSize));
						await dragDivider(elem, { [test.coord]: 50 * (test.growPositive ? 1 : -1) });
						expect(requestedSizes.at(-1)).to.equal(maxSize);
					});

					it('dispatches the event for sizes below min while dragging past min', async() => {
						const elem = await fixture(
							createDivider({ panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
							{ rtl: test.rtl }
						);
						const requestedSizes = [];
						elem.addEventListener('d2l-page-divider-resize-live', (e) => requestedSizes.push(e.detail.requestedSize));
						await dragDivider(elem, { [test.coord]: 200 * (test.growPositive ? -1 : 1) });
						expect(requestedSizes.at(-1)).to.equal(currentSize - 200);
						expect(requestedSizes.at(-1)).to.be.below(minSize);
					});

					it('clamps to collapsed size while dragging past collapsed start', async() => {
						const elem = await fixture(
							createDivider({ currentSize: 40, panelType: test.panelType, panelPosition: test.panelPosition, margin: 350 }),
							{ rtl: test.rtl }
						);
						const requestedSizes = [];
						elem.addEventListener('d2l-page-divider-resize-live', (e) => requestedSizes.push(e.detail.requestedSize));
						await dragDivider(elem, { [test.coord]: 50 * (test.growPositive ? -1 : 1) });
						expect(requestedSizes.at(-1)).to.equal(collapsedSize);
					});

					it('does not dispatch event when drag does not exceed threshold', async() => {
						const elem = await fixture(
							createDivider({ panelType: test.panelType, panelPosition: test.panelPosition }),
							{ rtl: test.rtl }
						);
						let dispatched = false;
						elem.addEventListener('d2l-page-divider-resize-live', () => dispatched = true);
						await dragDivider(elem, { [test.coord]: 2 });
						expect(dispatched).to.be.false;
					});
				});
			});

			it('does not dispatch event when the size is unchanged', async() => {
				const elem = await fixture(createDivider({ currentSize: maxSize, margin: 350 }));
				let dispatched = false;
				elem.addEventListener('d2l-page-divider-resize-live', () => dispatched = true);
				await dragDivider(elem, { x: 50 });
				expect(dispatched).to.be.false;
			});

			it('dispatches event when the handle is dragged', async() => {
				const elem = await fixture(createDivider({ margin: 350 }));
				const requestedSizes = [];
				elem.addEventListener('d2l-page-divider-resize-live', (e) => requestedSizes.push(e.detail.requestedSize));
				await dragHandle(elem, { x: 50 });
				expect(requestedSizes.at(-1)).to.equal(currentSize + 50);
			});

			it('does not dispatch event when the arrows are dragged', async() => {
				const elem = await fixture(createDivider({ margin: 350 }));
				let dispatched = false;
				elem.addEventListener('d2l-page-divider-resize-live', () => dispatched = true);
				await dragArrow(elem, 'end', { x: 50 });
				expect(dispatched).to.be.false;
			});
		});
	});
});
