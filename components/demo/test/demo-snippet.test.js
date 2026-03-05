import '../demo-snippet.js';
import { defineCE, expect, fixture, html, runConstructor } from '@brightspace-ui/testing';
import { LitElement } from 'lit';
import { SkeletonMixin } from '../../skeleton/skeleton-mixin.js';

const skeletonTag = defineCE(class extends SkeletonMixin(LitElement) {
	render() {
		return html`<div>Skeleton element</div>`;
	}
});
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

</script>`;

function addTemplate(inner) {
	return `<template>${inner}</template>`;
}

describe('d2l-demo-snippet', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-demo-snippet');
		});
	});

	describe('code formatting', () => {
		let elem;

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
		[true, false].forEach(useTemplate => {

			function snippetFixture(inner) {
				return fixture(`<d2l-demo-snippet>${useTemplate ? addTemplate(inner) : inner}</d2l-demo-snippet>`, { awaitLoadingComplete: false });
			}

			it(`sets _hasSkeleton when a slotted element exposes skeleton property${useTemplate ? ' - template' : ''}`, async() => {
				const elem = await snippetFixture(`<${skeletonTag}></${skeletonTag}>`);
				expect(elem._hasSkeleton).to.be.true;
			});

			it(`sets _hasSkeleton when a nested slotted element exposes skeleton property${useTemplate ? ' - template' : ''}`, async() => {
				const elem = await snippetFixture(`<div><${skeletonTag}></${skeletonTag}></div>`);
				expect(elem._hasSkeleton).to.be.true;
			});

			it(`does not set _hasSkeleton when a slotted element does not expose skeleton property${useTemplate ? ' - template' : ''}`, async() => {
				const elem = await snippetFixture('<div></div>');
				expect(elem._hasSkeleton).to.be.false;
			});
		});
	});

});
