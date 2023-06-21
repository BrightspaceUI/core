
import '../overflow-group.js';
import '../../button/button.js';
import '../../button/button-subtle.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-overflow-group', () => {

	it('default', async() => {
		const normal = await fixture(html`<d2l-overflow-group>
			<d2l-button>1</d2l-button>
			<d2l-button>2</d2l-button>
			<d2l-button>3</d2l-button>
		</d2l-overflow-group>`);
		await expect(normal).to.be.accessible();
	});
	it('overflowing', async() => {
		const overflow = await fixture(html`<d2l-overflow-group max-to-show="2">
			<d2l-button>1</d2l-button>
			<d2l-button>2</d2l-button>
			<d2l-button>3</d2l-button>
		</d2l-overflow-group>`);
		await expect(overflow).to.be.accessible();
	});
	it('subtle', async() => {
		const subtle = await fixture(html`<d2l-overflow-group opener-style="subtle">
			<d2l-button-subtle>1</d2l-button-subtle>
			<d2l-button-subtle>2</d2l-button-subtle>
			<d2l-button-subtle>3</d2l-button-subtle>
		</d2l-overflow-group>`);
		await expect(subtle).to.be.accessible();
	});
	it('subtle-overflow', async() => {
		const subtleOverflow = await fixture(html`<d2l-overflow-group opener-style="subtle" max-to-show="2">
			<d2l-button-subtle>1</d2l-button-subtle>
			<d2l-button-subtle>2</d2l-button-subtle>
			<d2l-button-subtle>3</d2l-button-subtle>
		</d2l-overflow-group>`);
		await expect(subtleOverflow).to.be.accessible();
	});
});
