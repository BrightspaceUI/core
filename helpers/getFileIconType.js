export function getFileIconTypeFromExtension(extensionString) {
	var iconType;
	switch(extensionString.toLowerCase()) {
		case 'zip':
		case 'tar':
		case 'z':
		case 'gz':
		case 'arj':
		case 'gzip':
		case 'bzip2':
		case 'sit':
			iconType = 'file-archive';
			break;
		case 'aac':
		case 'acc':
		case 'm4a':
		case 'm4p':
		case 'mid':
		case 'midi':
		case 'mp3':
		case 'mpa':
		case 'oga':
		case 'ra':
		case 'ram':
		case 'rax':
		case 'wav':
		case 'wma':
			iconType = 'file-audio';
			break;
		case 'doc':
		case 'docm':
		case 'docx':
		case 'dot':
		case 'dotm':
		case 'dotx':
		case 'rtf':
			iconType = 'file-document';
			break;
		case 'ico':
		case 'jpg':
		case 'jpeg':
		case 'gif':
		case 'bmp':
		case 'png':
		case 'mac':
		case 'pic':
		case 'pict':
		case 'pnt':
		case 'pntg':
		case 'svg':
		case 'tif':
		case 'tiff':
			iconType = 'file-image';
			break;
		case 'pot':
		case 'potx':
		case 'potm':
		case 'ppam':
		case 'ppsx':
		case 'ppsm':
		case 'ppt':
		case 'pptx':
		case 'pptm':
			iconType = 'file-presentation';
			break;
		case '3gp':
		case 'asf':
		case 'asx':
		case 'avi':
		case 'divx':
		case 'flv':
		case 'm4v':
		case 'mkv':
		case 'mov':
		case 'mov':
		case 'mp4':
		case 'mpeg':
		case 'mpg':
		case 'ogg':
		case 'ogv':
		case 'qt':
		case 'qti':
		case 'rm':
		case 'swf':
		case 'webm':
		case 'wm':
		case 'wmv':
			iconType = 'file-video';
			break;
		default: // default to file-document
			iconType = 'file-document';
	}
	return iconType;
}

export function getFileIconTypeFromFilename(filename) {
	const index = filename.lastIndexOf('.');
	if (index < 0) {
		return 'file-document'; // default to file-document
	} else {
		return getFileIconTypeFromExtension(filename.substring(index + 1));
	}
}
