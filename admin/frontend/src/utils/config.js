
const isProd = process.env.NODE_ENV === 'production';
let API_URL;
if (isProd) {
	API_URL = `${window.location.protocol}//${window.location.host}`;
	// if (window.location.port != ''){
	// 	API_URL += `:${window.location.port}`;
	// }
	// API_URL = '';
} else {
	API_URL = `${process.env.REACT_APP_URL}`;
}

console.log(`🚀 ~ file: config.js ~ line 12 ~ API_URL`, API_URL);
export default {
	API_URL,
	IMAGE_URI: isProd ? API_URL: process.env.REACT_APP_IMAGE_URI,
	FILE_MANAGER: isProd ? API_URL: process.env.REACT_APP_FILE_MANAGER
};
