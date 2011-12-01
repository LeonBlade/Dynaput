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
			var elements = $.each(pieces, function(i, v) {
				var element = $('<input>').attr({
					type: 'text',
					size: v.length,
					maxlength: v.length,
					placeholder: (placeholder=='yes')?v:'',
					field: field,
					value: (values[i])?values[i]:''
				});
				// whenever you type in the phone fields
				$(element).bind('keydown', function(key) {
					// check for a selection
					var _field = '[field='+field+']';
					// left
					if (key.which == 37) {
						if (getCaret($(this)[0]) == 0) {
							setCaretPosition($(this).prev(_field)[0], $(this).prev(_field).attr('maxlength'));
							return false;
						}
					}
					// right
					else if (key.which == 39) {
						if (getCaret($(this)[0]) == $(this).val().length) {
							setCaretPosition($(this).next(_field)[0], 0);
							return false;
						}
					}
					// backspace
					else if (key.which == 8) {
						if ($(this).val() == "") {
							$(this).prev(_field).focus();
							return false;
						}
					}
					// delete
					else if (key.which == 46) {
						if ($(this).val() == "") {
							$(this).next(_field).focus();
							return false;
						}
					}
					// up and down (this is so hitting either up or down wont advance to the next input for the next conditional)
					else if (key.which == 38 || key.which == 40) {}
					// if we have reached this input's maxlength then we will move to the next input
					else if ($(this).val().length == $(this).attr("maxlength") && key.which != 38 && key.which != 40) {
						$(this).next(_field).focus();
					}
					// set the hidden value to a map of the fields joined by the inputs delimiter attribute
					$('#'+field).val($.map($('[field='+field+']'),function(n,i){return $(n).val()}).join(delim));
				});
				$(container).append(element);
			});
			$(this).after(container);
			$(container).prepend($(this));
		});
	};
	
	function getCaret(el) { 
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
		return 0; 
	}
	function setCaretPosition(el, pos) {
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
	
})(jQuery);