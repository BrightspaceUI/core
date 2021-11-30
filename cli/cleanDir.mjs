import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';
import path from 'path';

export function cleanDir(dirPath) {

	if (!existsSync(dirPath))
		return;

	const files = readdirSync(dirPath);
	files.forEach((file) => {
		const currentPath = path.join(dirPath, file);
		if (lstatSync(currentPath).isDirectory()) {
			cleanDir(currentPath);
		} else {
			unlinkSync(currentPath);
		}
	});

	rmdirSync(dirPath);

}
