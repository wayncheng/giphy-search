// $("button").on("click", function(event) {
$(document).ready(function() {

	var arr = ['corgi','puppy','elephant','giraffe','pug','kangaroo','teacup pig','baby goat','french bulldog','capybara'];
	
	// Build Buttons from array
	for (var i=0; i<arr.length; i++) {
		var ai = arr[i];
		buildButton(ai);
	};
	
	function buildButton(x){
		var ai = x;
		var buttonEl = $('<button/>');
		buttonEl.attr('data-query', ai);
		buttonEl.text(ai);
		buttonEl.addClass('btn-query');

		buttonEl.on('click',function(event){
			event.preventDefault();
			var t = $(this);
			btnAction(t);
		});

		$('#btn-container').append(buttonEl);
	};


	$('.btn-submit').on('click',function(event){
		var userInput = $('#userInput').val().trim();
		buildButton(userInput);
	})

	function btnAction(t){
		// Clear current feed
		$('#feed').empty();

		var q = t.attr('data-query');
		var limit = '10';
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + q + "&api_key=dc6zaTOxFJmzC&limit=" + limit;

		  $.ajax({
		      url: queryURL,
		      method: "GET"
		    })
		    .done(function(response) {
		    	var r = response.data;
		    	console.log('r',r);

		      for (var i = 0; i < r.length; i++) {

		        var containerEl = $("<div class='item-wrap'>");
		        var rating = r[i].rating;
		        var sizeRaw = parseInt(r[i].images.fixed_height.size);
		    	var size;

		        if ( sizeRaw >= 1000000 ) {
		        	// Convert to Mb (divided in weird way in order to leave 1 decimal place)
		    	    size = Math.round(sizeRaw/100000)/10 + ' Mb'
		        } else if ( sizeRaw >= 1000 ){
		        	//  Convert to kb
		        	size = Math.round(sizeRaw/1000) + ' kb'
		        } else {
		        	// Everything left over is just bytes.
		        	size = sizeRaw + 'b'
		        }


		        var sizeHTML = "<br>Size: " + size;
		        var p = $("<p>").html("Rated: " + rating.toUpperCase() + sizeHTML);
		        p.addClass('caption');

		        var img = $("<img>");
		        img.addClass('media');
		        img.attr("src", r[i].images.fixed_height_still.url);
		        img.attr("data-still", r[i].images.fixed_height_still.url);
		        img.attr("data-play", r[i].images.fixed_height.url);
		        img.attr("data-state", "still");
				img.on('click', function(event){
					// Prevent from firing on load.
					event.preventDefault();
					var t = $(this);
					mediaAction(t);
				});

		        containerEl.append(img).append(p);
		        $('#feed').append(containerEl);
		      }
		    });
	}

	function mediaAction(t){
		var $t = t;
		var dataState = $t.attr('data-state');
		var playURL = $t.attr('data-play');
		var stillURL = $t.attr('data-still');
		console.log('dataState',dataState);

		// Evaluate what the images current state is and switch
		// the src attribute accordingly
		if( dataState === 'still') {

			// Set the src attribute equal to the moving URL
			$t.attr('src', playURL);
			// Toggle the data-state attribute
			$t.attr('data-state', "play");

		} else {

			// Set the src attribute equal to the moving URL
			$t.attr('src', stillURL);
			// Toggle the data-state attribute
			$t.attr('data-state', "still");
		}
	};

////////////////////////////////////////////////////
});
