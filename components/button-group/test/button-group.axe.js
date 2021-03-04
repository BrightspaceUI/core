import '../button-group.js';
import '../../button/button.js';
import '../../button/button-subtle.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-button-group', () => {

	it('default', async() => {
		const normal = await fixture(html`<d2l-button-group>
			<d2l-button>1</d2l-button>
			<d2l-button>2</d2l-button>
			<d2l-button>3</d2l-button>
		</d2l-button-group>`);
		await expect(normal).to.be.accessible;
	});
	it('overflowing', async() => {
		const overflow = await fixture(html`<d2l-button-group max-to-show="2">
			<d2l-button>1</d2l-button>
			<d2l-button>2</d2l-button>
			<d2l-button>3</d2l-button>
		</d2l-button-group>`);
		await expect(overflow).to.be.accessible;
	});
	it('subtle', async() => {
		const subtle = await fixture(html`<d2l-button-group subtle>
			<d2l-button-subtle>1</d2l-button-subtle>
			<d2l-button-subtle>2</d2l-button-subtle>
			<d2l-button-subtle>3</d2l-button-subtle>
		</d2l-button-group>`);
		await expect(subtle).to.be.accessible;
	});
	it('subtle-overflow', async() => {
		const subtleOverflow = await fixture(html`<d2l-button-group subtle max-to-show="2">
			<d2l-button-subtle>1</d2l-button-subtle>
			<d2l-button-subtle>2</d2l-button-subtle>
			<d2l-button-subtle>3</d2l-button-subtle>
		</d2l-button-group>`);
		await expect(subtleOverflow).to.be.accessible;
	});
});
