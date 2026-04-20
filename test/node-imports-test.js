import assert from 'node:assert';

describe('node imports', () => {

	it('should import link styles in a node environment', async() => {
		const t = await import('../components/link/link-styles.js');
		assert.ok(t._generateLinkStyles);
	});

	it('should import typography styles in a node environment', async() => {
		const t = await import('../components/typography/styles.js');
		assert.ok(t.baseTypographyStyles);
		assert.ok(t._generateBodyCompactStyles);
		assert.ok(t._generateBodySmallStyles);
		assert.ok(t._generateBodyStandardStyles);
		assert.ok(t._generateHeading1Styles);
		assert.ok(t._generateHeading2Styles);
		assert.ok(t._generateHeading3Styles);
		assert.ok(t._generateHeading4Styles);
	});

});
