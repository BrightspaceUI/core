import '../demo/visibility-test.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const moveYValue = 10;
const simpleFixture = html`<d2l-visibility-test></d2l-visibility-test>`;

describe('VisibilityMixin', () => {

	let elem;

	describe('default dummy values', () => {

		beforeEach(async() => {
			elem = await fixture(simpleFixture);
		});

		it('should default "overflow" to "hidden"', () => {
			expect(elem.dummy.style.overflow).to.equal('hidden');
		});

		it('should default "display" to "grid"', () => {
			expect(elem.dummy.style.display).to.equal('grid');
		});

	});

	describe('events', () => {

		beforeEach(async() => {
			elem = await fixture(simpleFixture);
		});

		it('should fire "d2l-visibility-mixin-show-(start|end)" events when "animate" attribute is changed to "show"', async() => {
			elem.animate = 'show';
			const eventStart = await oneEvent(elem, 'd2l-visibility-mixin-show-start');
			expect(eventStart.target).to.equal(elem);
			const eventEnd = await oneEvent(elem, 'd2l-visibility-mixin-show-end');
			expect(eventEnd.target).to.equal(elem);
		});

		describe('requires completed "show"', () => {

			beforeEach(async() => {
				elem.animate = 'show';
				await oneEvent(elem, 'd2l-visibility-mixin-show-start');
				await oneEvent(elem, 'd2l-visibility-mixin-show-end');
			});

			it('should not display "dummy" after "show" ends', () => {
				expect(document.body.contains(elem.dummy)).to.be.false;
			});

			it('should have the original "opacity" after "show" ends', () => {
				expect(elem.style.opacity).to.equal(elem.opacityOriginal);
			});

			it('should have the original "transform" after "show" ends', () => {
				expect(elem.style.transform).to.equal(elem.transformOriginal);
			});

			it('should have the original "display" after "show" ends', () => {
				expect(elem.style.display).to.equal(elem.displayOriginal);
			});

			it('should have the original "transition" after "show" ends', () => {
				expect(elem.style.transition).to.equal(elem.transitionOriginal);
			});

			it('should fire "d2l-visibility-mixin-hide-(start|end)" events when "animate" attribute is changed to "hide"', async() => {
				elem.animate = 'hide';
				const eventStart = await oneEvent(elem, 'd2l-visibility-mixin-hide-start');
				expect(eventStart.target).to.equal(elem);
				const eventEnd = await oneEvent(elem, 'd2l-visibility-mixin-hide-end');
				expect(eventEnd.target).to.equal(elem);
			});

			describe('requires completed "hide"', () => {

				beforeEach(async() => {
					elem.animate = 'hide';
					await oneEvent(elem, 'd2l-visibility-mixin-hide-start');
					await oneEvent(elem, 'd2l-visibility-mixin-hide-end');
				});

				it('should not display "dummy" after "hide" ends', () => {
					expect(document.body.contains(elem.dummy)).to.be.false;
				});

				it('should have "opacity" set to "0" after "hide" ends', () => {
					expect(elem.style.opacity).to.equal('0');
				});

				it('should have "transform" set to "0" after "hide" ends', () => {
					expect(elem.style.transform).to.equal(`translateY(-${moveYValue}px)`);
				});

				it('should have "display" set to "none" after "hide" ends', () => {
					expect(elem.style.display).to.equal('none');
				});

			});

			it('should fire "d2l-visibility-mixin-remove-(start|end)" events when "animate" attribute is changed to "remove"', async() => {
				elem.animate = 'remove';
				const eventStart = await oneEvent(elem, 'd2l-visibility-mixin-remove-start');
				expect(eventStart.target).to.equal(elem);
				const eventEnd = await oneEvent(elem, 'd2l-visibility-mixin-remove-end');
				expect(eventEnd.target).to.equal(elem);
			});

			describe('requires completed "remove"', () => {

				beforeEach(async() => {
					elem.animate = 'remove';
					await oneEvent(elem, 'd2l-visibility-mixin-remove-start');
					await oneEvent(elem, 'd2l-visibility-mixin-remove-end');
				});

				it('should not display "dummy" after "remove" ends', () => {
					expect(document.body.contains(elem.dummy)).to.be.false;
				});

				it('should have "opacity" set to "0" after "remove" ends', () => {
					expect(elem.style.opacity).to.equal('0');
				});

				it('should have "transform" set to "0" after "remove" ends', () => {
					expect(elem.style.transform).to.equal(`translateY(-${moveYValue}px)`);
				});

				it('should not be displayed after "remove" ends', () => {
					expect(document.body.contains(elem)).to.be.false;
				});

			});

		});

	});

});
