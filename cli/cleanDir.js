const fs = require('fs'),
	path = require('path');

module.exports = function cleanDir(dirPath) {

	if (!fs.existsSync(dirPath))
		return;

	const files = fs.readdirSync(dirPath);
	files.forEach((file) => {
		const currentPath = path.join(dirPath, file);
		if (fs.lstatSync(currentPath).isDirectory()) {
			cleanDir(currentPath);
		} else {
			fs.unlinkSync(currentPath);
		}
	});

	fs.rmdirSync(dirPath);

};
