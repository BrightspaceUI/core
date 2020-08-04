import { getFileIconTypeFromExtension, getFileIconTypeFromFilename } from '../getFileIconType.js';
import { expect } from '@open-wc/testing';
describe('getFileIconType', () => {
	describe('getFileIconTypeFromExtension', () => {
		const emptyExts = ['', ' ', '.'];
		const files = [['DoCx', 'file-document'], ['PNG', 'file-image'], ['mp4', 'file-video']];
		it('should return the correct default', () => {
			emptyExts.forEach(ext => {
				expect(getFileIconTypeFromExtension(ext)).to.equal('file-document');
			});
		});
		it('should return correct file type', () => {
			files.forEach(([ext, expected]) => {
				expect(getFileIconTypeFromExtension(ext)).to.equal(expected);
			});
		});
	});
	describe('getFileIconTypeFromFilename', () => {
		const emptyNames = ['', ' ', 'some_file', '.config'];
		const filenames = [['my-document.DoCx', 'file-document'], ['..PNG', 'file-image'], ['.mp4', 'file-video']];
		it('should return the correct default', () => {
			emptyNames.forEach(name => {
				expect(getFileIconTypeFromFilename(name)).to.equal('file-document');
			});
		});
		it('should return correct file type', () => {
			filenames.forEach(([name, expected]) => {
				expect(getFileIconTypeFromFilename(name)).to.equal(expected);
			});
		});
	});
});
