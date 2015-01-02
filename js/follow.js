var isFollow = function () {
	return $( '#favorite-button .sprites-checked' ).length === 1;
};

var onClickButton = function () {
	var fd = new FormData( $('form[action="/bookmark_add.php"]')[0] );
	console.log("@fd:", fd);
	$.ajax( {
		url: '/bookmark_add.php',
		type: 'POST',
		data: fd,
		processData: false,
		contentType: false
	} ).done( function ( res ) {
		console.log("@res:", res);
		$( '#oneclick_follow' ).text( '多分フォロー済み' );
	} );
};

var addOneClickButton = function () {
	$( 'ul.user-relation' ).prepend( '<li><a class="follow" id="oneclick_follow"><i class="_icon sprites-follow"></i><span class="text">ワンクリックフォロー</span></a></li>' );
	$( '#oneclick_follow' ).click( onClickButton );
};

if ( !isFollow() ) {
	addOneClickButton();
}
