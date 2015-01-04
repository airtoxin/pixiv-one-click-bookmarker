var PostToTumblr = ( function () {
	return function () {
		var self = this;
		self.TUMBLR = 'https://www.tumblr.com';
		self.TUMBLR_BUTTON_ID ='post_to_tumblrrsgsdfghshdrth';

		self.run = function () {
			self.injectTumblrButton();
			self.setHandler();
		};

		self.injectTumblrButton = function () {
			var tumblrButton = '<li id="' + self.TUMBLR_BUTTON_ID + '"><a href="javascript:void(0);" title="Post to Tumblr" style="display:inline-block; text-indent:-9999px; overflow:hidden; width:81px; height:20px; background:url(\'https://platform.tumblr.com/v1/share_1.png\') top left no-repeat transparent;">Post to Tumblr</a></li>';
			$( 'ul.share-button' ).prepend( tumblrButton );
		};

		self.setHandler = function () {
			$( '#' + self.TUMBLR_BUTTON_ID ).click( self.handler );
		};

		self.handler = function () {
			var info = self.getPageInfo();
			self.getKey( function ( formKey, secureFormKey, channelId ) {
				info.channelId = channelId;
				var payload = self.getPayload( formKey, info );
				$.ajax( {
					url: self.TUMBLR + '/svc/post/update',
					type: 'POST',
					dataType: 'json',
					contentType: 'application/json',
					headers: {
						'X-tumblr-puppies' : secureFormKey
					},
					processData: false,
					data: JSON.stringify( payload )
				} ).done( function () {
					console.log("@arguments:", arguments);
				} );
			} );
		};

		self.getPageInfo = function () {
			var title = $( 'title' ).text();
			var url = document.location.href;
			var description = $( 'p.caption' ).text();
			var tags = $( 'a.text' ).map( function( i, t ){ return $( t ).text(); } ).toArray();
			var imageTag = $( '.original-image' );
			var imageUrl = imageTag.data( 'src' );
			var imageWidth = imageTag.attr( 'width' );
			var imageHeight = imageTag.attr( 'height' );
			return {
				title: title,
				url: url,
				description: description,
				tags: tags
			};
		};

		self.getKey = function ( callback ) {
			$.get( self.TUMBLR + '/new/text' ).done( function ( res ) {
				console.log("@res:", res);
				var match = res.match( /<input type="hidden" name="form_key" value="(\w+)"\/>/ );
				var formKey = match[ 1 ];
				var channelId = res.match( /<input type="hidden" name="t" value="([0-9a-zA-Z-]+)"\/>/ )[ 1 ];
				console.log("@channelId:", channelId);
				$.ajax( {
					url: self.TUMBLR + '/svc/secure_form_key',
					type: 'POST',
					headers: {
						'X-tumblr-form-key': formKey
					}
				} ).done( function ( res, status, req ) {
					var secureFormKey = req.getResponseHeader( 'X-tumblr-secure-form-key' );
					callback( formKey, secureFormKey, channelId );
				} );
			} );
		};

		self.getPayload = function ( formKey, info ) {
			return {
				MAX_FILE_SIZE: '10485760',
				channel_id: info.channelId,
				context_id: '',
				context_page: 'dashboard',
				editor_type: 'rich',
				form_key: formKey,
				'images[o1]': 'https://pbs.twimg.com/media/B6iZiGZCQAAe3Bo.jpg',
				'is_rich_text[one]': '0',
				'is_rich_text[two]': '1',
				'is_rich_text[three]': '0',
				post: {},
				'post[date]': '',
				'post[photoset_layout]': '1',
				'post[photoset_order]': 'o1',
				'post[publish_on]': '',
				'post[slug]': '',
				'post[source_url]': 'http://',
				'post[state]': '0 3',
				'post[tags]': info.tags.join( ',' ),
				'post[two]': '<a href="' + info.url + '">' + info.title + '</a>',
				'post[type]': 'photo'
			};
		};
	};
}() );

( new PostToTumblr() ).run();
