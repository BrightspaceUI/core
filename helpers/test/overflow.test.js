import { getOverflowDeclarations, overflowEllipsisDeclarations, overflowHiddenDeclarations } from '../overflow.js';
import { expect } from '@brightspace-ui/testing';
import { set } from '../template-tags.js';

describe('overflow', () => {

	describe('getOverflowDeclarations', () => {

		it('should produce lit css templates by default', () => {
			const declarations = getOverflowDeclarations();
			expect(declarations).to.include.all.keys('_$cssResult$', 'cssText');
		})

		it('should return precomputed overflowHiddenDeclarations with no arguments', () => {
			const declarations = getOverflowDeclarations();
			expect(declarations).to.equal(overflowHiddenDeclarations);
		});

		it('should return an equivalent string when lit == false', () => {
			const defaultDeclarations = getOverflowDeclarations({ lit: false });
			expect(defaultDeclarations).to.equal(overflowHiddenDeclarations.cssText);
		})

		it('should return line clamping declarations when lines > 0', () => {
			const declarations = getOverflowDeclarations({ lines: 3 });
			expect(declarations.cssText).to.equal(set`
				min-width: 0; /* clamps width of flex items */
				overflow-x: clip;
				display: -webkit-box;
				overflow-clip-margin: 0.2em;
				overflow-wrap: anywhere;
				overflow-y: clip;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
			`);
		});

		it('should return text-overflow declarations when textOverflow is provided', () => {
			const textOverflow = 'clip';
			const declarations = getOverflowDeclarations({ textOverflow: textOverflow });
			expect(declarations.cssText).to.equal(set`
				min-width: 0; /* clamps width of flex items */
				overflow-x: clip;
				overflow-clip-margin: 1em;
				overflow-y: visible;
				text-overflow: ${textOverflow};
				white-space: nowrap;
			`);
		});
	});

	describe('overflowEllipsisDeclarations', () => {
		it('should produce overflow ellipsis declarations', () => {
			const declarations = overflowEllipsisDeclarations;
			expect(declarations.cssText).to.equal(set`
				min-width: 0; /* clamps width of flex items */
				overflow-x: clip;
				overflow-clip-margin: 1em;
				overflow-y: visible;
				text-overflow: ellipsis;
				white-space: nowrap;
			`);
		});
	});

	describe('overflowHiddenDeclarations', () => {
		it('should produce overflow hidden declarations', () => {
			const declarations = overflowHiddenDeclarations;
			expect(declarations.cssText).to.equal(set`
				min-width: 0; /* clamps width of flex items */
				overflow-x: clip;
				overflow-clip-margin: 1em;
				overflow-y: clip;
			`);
		});
	});

});
