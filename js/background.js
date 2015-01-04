chrome.webRequest.onBeforeSendHeaders.addListener( function ( details ) {
	details.requestHeaders.forEach( function ( header ) {
		if ( header.name.toLowerCase() === 'referer' ) {
			header.value = 'https://www.tumblr.com/new/text';
		}
		if ( header.name.toLowerCase() === 'origin' ) {
			header.value = 'https://www.tumblr.com'
		}
	} );
	return { requestHeaders: details.requestHeaders };
}, {
	urls: [ 'https://www.tumblr.com/*' ],
	types: [ 'xmlhttprequest' ]
}, [
	'blocking',
	'requestHeaders'
] );
