/*global $:true, console:true */
;( function( ){
    'use strict';
	var fading = false;

	var _methods = {

		show : function( showThis ){

			var $tab,
				$divToShow,
				$tabLinks,
				options,
				$currentTab;

			//if showThis is defined it means this method was called
			//manually and should have the id of the element to
			//show as the showThis parameter
			if( typeof showThis !== 'undefined' ){
				$tab = $('[data-toggle=' + showThis + ']');
			}
			//if showThis undefined that means the this scope is the element (already wrapped in jquery)
			else{
				$tab = this;
			}

			//if($tab)
			console.log( arguments );

			//cached
			$tabLinks = $tab.data( 'tabs' );



			if( $tabLinks === 'undefined' ){
				throw new Error( 'Tab links not defined in element' );
			}

			$currentTab = $tabLinks.data( 'currentTab' );

			options = $tabLinks.data( 'options' )

			$divToShow = $( $tab.attr( 'data-toggle' ) );

			//if the user clicks a tab while one is fading kick them out or if they click the active tab
			if( fading || $currentTab.is( $divToShow ) ){
				return;
			}

			//have to refer to this objects name since this is bound to the jQuery collection
			_methods.setIndicator( $tab );

			$tabLinks.find( 'li' ).removeClass( options.selectedClassName );

			$tab.addClass( options.selectedClassName );

			fading = true;

			$currentTab.fadeOut( 300, function(){

				$divToShow.fadeIn( 300 );

				$tabLinks.data( 'currentTab', $divToShow );

				fading = false;
			} );
		},

		setIndicator : function( $tab ){
			var $tabLinks = $tab.data( 'tabs' ),
				options = $tabLinks.data( 'options' ),
				isjQuery = options.tabSelectedIndicator instanceof window.jQuery,
				action = ( isjQuery ) ? 'append' : 'addClass';

			if( options.tabIndicatorLocation ){
				//$tab.find( options.tabIndicatorLocation )[ action ]( options.tabSelectedIndicator || options.selectedClassName );	
				var $addSelectedTo = $tab.find( options.tabIndicatorLocation );

				$addSelectedTo[ action ].call( $addSelectedTo, options.tabSelectedIndicator || options.selectedClassName );
			}
			else{

				$tab[ action ]( options.tabSelectedIndicator );
			}

			//this is another function
			//remove it from all the others`
			if( isjQuery ){
				//this is not going to work if the selected indicator does not have a class
				$tabLinks.find( options.tabSelectedIndicator.attr( 'class' ) ).remove( );
			}
			else{
				$tabLinks.find('li').each( function(){
					if( ! $(this).is( $tab )){
						$(this).find( options.tabIndicatorLocation ).
						removeClass( options.tabSelectedIndicator || options.selectedClassName );	
					}
				} );
			}	
			//end another function
		}
	};

	$.fn.nmTabs = function( options ){
		var method,
			i,
			selectedFound = false,
			defaults,
			self = this;

		

		if( typeof options === 'string' && typeof _methods[ options ] !== 'undefined' ){

			method = options;
			console.log( arguments );
			//dynamically call the method, passing in the parameters, minus the first one (which is thie method to call)
			return _methods[ method ]( Array.prototype.slice.call( arguments, 1 ) );
		}

		defaults = {
			selectedClassName : 'selected',
			tabSelectedIndicator : null,
			tabIndicatorLocation : null	
		};

		options = $.extend( defaults, options );

		this.data( 'options', options);
		this.data( 'currentTab', null );

		this.find( 'li' ).each( function(){

			var $tabElement = $( this ),
				$contentElement = $( $tabElement.attr( 'data-toggle' ) ); //the data-toggle attribute should be a jquery selector

			$tabElement.data( 'tabs', self );

			//if the selected tab has not yet been found and the current element has the selected class
			if( !selectedFound && ( $tabElement.hasClass( options.selectedClassName ) ||$tabElement.find( options.tabIndicatorLocation ).hasClass( options.selectedClassName ) ) ){

				//make sure there is an indicator to add
				if( options.tabSelectedIndicator && options.tabSelectedIndicator instanceof window.jQuery ){
					//if there is a location specified find that element and add the indicator to it
					if( options.tabIndicatorLocation ){
						$tabElement.find( options.tabIndicatorLocation ).append( options.tabSelectedIndicator || options.selectedClassName );
					}
					else{
						//add the indicator directly to the element
						$tabElement.append( options.tabSelectedIndicator );
					}
				}
					
				//show the div that this tab is tied to 
				if( !$contentElement.is( ':visible' ) ){
					$contentElement.show();
				}

				//set the current tab on the list of tabs to the 
				self.data( 'currentTab', $contentElement );

				selectedFound = true;
			}
			else{

				$contentElement.hide( );
			}

		} );

		this.on( 'click', 'li', function(){
			_methods.show.apply( $( this ) );
		} );

		return this;
	};

} ( ) );
