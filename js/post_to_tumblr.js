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
			self.getKey( function ( formKey, secureFormKey ) {
				var payload = self.getPayload( formKey );
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
					console.log("@document.referer:", document.referer);
					console.log("@arguments:", arguments);
				} );
			} );
		};

		self.getPageInfo = function () {
			var title = $( 'title' ).text();
			var url = document.location.href;
			var description = $( 'p.caption' ).text();
			var tags = $( 'a.text' ).map( function( i, t ){ return $( t ).text(); } ).toArray();
			return {
				title: title,
				url: url,
				description: description,
				tags: tags
			};
		};

		self.getKey = function ( callback ) {
			$.get( self.TUMBLR + '/new/text' ).done( function ( res ) {
				var match = res.match( /<input type="hidden" name="form_key" value="(\w+)"\/>/ );
				var formKey = match[ 1 ];
				$.ajax( {
					url: self.TUMBLR + '/svc/secure_form_key',
					type: 'POST',
					headers: {
						'X-tumblr-form-key': formKey
					}
				} ).done( function ( res, status, req ) {
					var secureFormKey = req.getResponseHeader( 'X-tumblr-secure-form-key' );
					callback( formKey, secureFormKey );
				} );
			} );
		};

		self.getPayload = function ( formKey ) {
			return {
				channel_id: 'little-pretenders2',
				context_id: '',
				context_page: 'dashboard',
				editor_type: 'rich',
				form_key: formKey,
				'is_rich_text[one]': '0',
				'is_rich_text[three]': '0',
				'is_rich_text[two]': '1',
				post: {},
				'post[date]': '',
				'post[one]': '',
				'post[publish_on]': '',
				'post[slug]': '',
				'post[source_url]': 'http://',
				'post[state]': '0 3',
				'post[tags]': '',
				'post[two]': '<p>hogehogehogehgoehgoehgoegheogheogheohgehogehgo</p>',
				'post[type]': 'regular'
			};
		}
	};
}() );

( new PostToTumblr() ).run();
