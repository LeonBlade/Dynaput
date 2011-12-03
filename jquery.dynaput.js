/**
 * jquery.dynaput.js by James Stine (leon.blade@gmail.com)
 * version 1.1
**/
(function($) {
	
	$.fn.dynaput = function() {
		
		return this.each(function() {
			var format = $(this).attr('format');
			var delim = $(this).attr('delim');
			var pieces = format.split(delim);
			var placeholder = $(this).attr('placeholder');
			var field = $(this).attr('id');
			var values = $(this).val().split(delim);
			var container = $('<div>');
			var elements = $.map(pieces, function(v, i) {
				var element = $('<input>').attr({
					type: 'text',
					size: v.length,
					maxlength: v.length,
					placeholder: (placeholder=='yes')?v:'',
					class: '_dynaput',
					field: field,
					'value': (values[i] == undefined)?'':values[i]
				});
				return element[0].outerHTML;
			});
			$(this).after(container);
			$(container).prepend($(this)).append(elements.join(delim));
		});
	};
	
	// this will respond to any field object with class dynaput
	$('._dynaput').live('keydown', function(key) {
		// grab field and delim
		var field = $(this).attr('field');
		var delim = $('#'+field).attr('delim');
		// switch out the keyCode
		switch (key.keyCode) {
			case KEY_LEFT:
				if (getCaret($(this)[0]) == 0) {
					setCaretPosition($(this).prev('._dynaput')[0], $(this).prev('._dynaput').attr('maxlength'));
					return false;
				}
				break;
			case KEY_RIGHT:
				if (getCaret($(this)[0]) == $(this).val().length) {
					setCaretPosition($(this).next('._dynaput')[0], 0);
					return false;
				}
				break;
			case KEY_BACKSPACE:
				if ($(this).val() == "") {
					setCaretPosition($(this).prev('._dynaput')[0], $(this).prev('._dynaput').attr('maxlength'));
					return false;
				}
				break;
			case KEY_DELETE:
				if ($(this).val() == "" || getCaret($(this)[0]) == $(this).val().length) {
					setCaretPosition($(this).next('._dynaput')[0], 0);
					return false;
				}
				break;
			default:
				if ($(this).val().length == $(this).attr("maxlength") && key.which != KEY_UP && key.which != KEY_DOWN) {
					$(this).next('._dynaput').focus();
				}
				break;
		}
		// set the hidden value to a map of the fields joined by the inputs delimiter attribute
		$('#'+field).val($.map($(this).parent().children('._dynaput'),function(n,i){return $(n).val()}).join(delim));
	});
	
	$('._dynaput').live('blur', function() {
		// grab field and delim
		var field = $(this).attr('field');
		var delim = $('#'+field).attr('delim');
		$('#'+field).val($.map($(this).parent().children('._dynaput'),function(n,i){return $(n).val()}).join(delim)); 
	});
	
	function getCaret(el) { 
		if (el) {
			if (el.selectionStart) { 
		    	return el.selectionStart; 
		  	} else if (document.selection) { 
		    	el.focus(); 
		    	var r = document.selection.createRange(); 
		    	if (r == null) { 
		      		return 0; 
		    	} 
		    	var re = el.createTextRange(), 
		        rc = re.duplicate(); 
		    	re.moveToBookmark(r.getBookmark()); 
		    	rc.setEndPoint('EndToStart', re); 
		    	return rc.text.length; 
		  	}
		}
		return 0;
	}
	function setCaretPosition(el, pos) {
		if (el) {
	    	if(el.setSelectionRange) {
		        el.focus();
		        el.setSelectionRange(pos, pos);
		    }
		    else if (el.createTextRange) {
		        var range = el.createTextRange();
		        range.collapse(true);
		        range.moveEnd('character', pos);
		        range.moveStart('character', pos);
		        range.select();
		    }
		}
	}
	
	// keycodes
	var KEY_BACKSPACE = 8;
	var KEY_LEFT = 37;
	var KEY_UP = 38;
	var KEY_RIGHT = 39;
	var KEY_DOWN = 40;
	var KEY_DELETE = 46;
	
})(jQuery);