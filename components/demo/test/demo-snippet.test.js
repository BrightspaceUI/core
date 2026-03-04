import { LitElement } from 'lit';
import { SkeletonMixin } from '../../skeleton/skeleton-mixin.js';
import { defineCE, expect, fixture, html, runConstructor } from '@brightspace-ui/testing';
import '../demo-snippet.js';

const skeletonTag = defineCE(class extends SkeletonMixin(LitElement) {});
const scriptTestExpected = `<div>
  <script>

    console.log('hi');

  </script>
  <script type="module">

    import { test } from './test.js';
    if (window.test) {
      console.log('test');
    }

  </script>
</div>`;
const tagTestExpected = `<div foo data-keep="ok"></div>
<another-tag bar target="_blank"></another-tag>
<script>

  function _privateFunction() {console.log('Private function name is not removed');}

</script>`


describe('d2l-demo-snippet', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-demo-snippet');
		});
	});

	describe('code formatting', () => {
		let elem;
		function addTemplate(inner) {
			return `<template>${inner}</template>`;
		}

		beforeEach(async() => {
			elem = await fixture(html`<d2l-demo-snippet></d2l-demo-snippet>`);
		});

		[true, false].forEach(useTemplate => {
			it(`sets template flag to ${useTemplate ? 'true' : 'false'}`, async() => {
				const inner = '<div>demo</div>';
				const formatted = elem._formatCode(useTemplate ? addTemplate(inner) : inner);
				expect(formatted).to.equal('<div>demo</div>');
				expect(elem._isTemplate).to.equal(useTemplate);
			});
			it('parses scripts and removes hidden ones', async() => {
				const inner = `
				<div>
					<script>console.log('hi');</script>
					<script type="module">
						import { test } from './test.js';
						if (window.test) {
							console.log('test');
						}
					</script>
					<script data-demo-hide>hidden</script>
				</div>`;
				const formatted = elem._formatCode(useTemplate ? addTemplate(inner) : inner);
				expect(formatted).to.equal(scriptTestExpected);
			});
		});

		it('removes empty and private attributes but keeps normal ones', async() => {
			const elem = await fixture(html`<d2l-demo-snippet></d2l-demo-snippet>`);
			const formatted = elem._formatCode(`
				<div class="" _private foo="" data-keep="ok"></div>
				<another-tag _private="value" bar="" target="_blank"></another-tag>
				<script>
					function _privateFunction() {console.log('Private function name is not removed');}
				</script>
			`);
			expect(formatted).to.equal(tagTestExpected);
		});

	});

	describe('skeleton detection', () => {

		it('sets _hasSkeleton when a slotted element exposes skeleton property', async() => {
			const elem = await fixture(`<d2l-demo-snippet><${skeletonTag}></${skeletonTag}></d2l-demo-snippet>`);
			elem._updateHasSkeleton();
			expect(elem._hasSkeleton).to.be.true;
		});

	});


});
