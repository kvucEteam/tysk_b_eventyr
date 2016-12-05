$(window).load(function() {
	
	// SKJULER placeringstextdims: 
	$("#ost").hide();
	

	var stregArray = new Array();

	var rigtige_Array = new Array();
	
	for (var i = 0; i <dataArray.length; i++){
		
		rigtige_Array.push(0);
	}
	
	

	//alert(dataArray.length + "," + rigtige_Array.length);

	var field = "";
	var hint = false;

	var score = 0;

	var ordText_Array = new Array();

	//var c = document.getElementById('canvas');
	//var cxt = c.getContext('2d');

$("#canvas").css("background-image", pic);

	for (var i = 0; i < dataArray.length; i++) {

		var string_length = dataArray[i][0].length;
		var blanks = "";
		var ordArray = new Array();
		var ord = 0;
		for (var o = 0; o < string_length; o++) {

			if (dataArray[i][0][o] != " ") {
				blanks = blanks + "-";
				ord++;
			} else {
				ordArray.push(ord);
				ord = 0;
				blanks = blanks + " ";

			}

		}
		stregArray.push(blanks);
		//alert(stregArray);

		ordArray.push(ord);
		////alert(ordArray.length);
		var ordText = "";
		while (ordArray.length > 0) {
			if (ordArray.length > 1) {
				ordText = ordText + ordArray[0] + "+";
			} else {
				ordText = ordText + ordArray[0];
			}
			ordArray.shift();
			////alert("flytter en");
		}
		////alert(ordText);
		ordText_Array.push(ordText);

		////alert(ordText_Array);
		var field = field + "<div class ='txtfield_container' style='top:" + dataArray[i][2] + "px; left:" + dataArray[i][1] + "px'><form onkeypress='return event.keyCode != 13;' onsubmit='tjeksvar();'> <input type='text' class ='txtfield' id ='" + i + "' value='" + blanks + " ' size='" + (string_length) + "'></form><span class ='p'>(" + ordText + ") </span></div>"

		////alert(field);
	};

	//$('#container').html(field);

	$('#container').html(field + "<button id ='hint'>Få hjælp</button> <button id ='submit'>Tjek svar</button>");

	$('#hint').click(function() {
		hint = true;
		$(this).html("Klik på et felt");
	});
	$("#ost").draggable({
		stop : function(event, ui) {
			var position = $(this).position();
			alert("LEFT: " + position.left + ", top: " + position.top);
		}
	});
	$(".txtfield").click(function() {
		var id = $(this).attr("id");

		if (hint == true) {

			var add_hint = rigtige_Array[id] + 1;
			rigtige_Array.splice(id, 1, add_hint);
			$('#hint').html("Mere hjælp");

			hint = false;
		}
		tjeksvar();

		var b_value = "";

		////alert("hallo" + rigtige_Array[id]);

		for (var i = 0; i < rigtige_Array[id]; i++) {
			b_value = b_value + dataArray[id][0][i];
		}

		$(this).attr("value", b_value);

	});

	$("#submit").click(function() {
		tjeksvar();
	});
	function tjeksvar() {

		$(".txtfield").each(function() {
			var brugerinput = $(this).attr("value");
			brugerinput = capitaliseFirstLetter(brugerinput);

			var id = $(this).attr("id");
			var check_text = 0;
			var fejl = 0;
			var b_value = "";

			for (var o = 0; o < dataArray[id][0].length; o++) {
				if (brugerinput[o] == dataArray[id][0][o] && fejl == false) {
					check_text++;
				} else {
					fejl++;
				}
			}

			if (check_text > rigtige_Array[id]) {
				rigtige_Array.splice(id, 1, check_text);
			}
			//alert(rigtige_Array);
			if (fejl < 2) {
				lock_field(id);
			}
			for (var i = 0; i < rigtige_Array[id]; i++) {
				b_value = b_value + dataArray[id][0][i];
			}

			for (var u = rigtige_Array[id]; u < dataArray[id][0].length; u++) {
				b_value = b_value + stregArray[id][u];
			}
			$(this).attr("value", b_value);
		});
	}

	function lock_field(id) {
		//alert ("lock field");
		score++;
		//alert (score+ "," + dataArray.length)
		if (score > dataArray.length - 1) {
			//$("#feed").html("Groooovy threads, man! And you digged them all!<br/>FAR OUT.....!");
			$('#hint').toggle();
			$('#submit').text("Noch einmal");
			$('#submit').click(function() {
				window.location.reload();
			});

		}
		var idstring = "#" + id;
		//$(idstring).
		$(".txtfield_container").eq(id).html("<div>" + dataArray[id][0] + "</div>");
		$(".txtfield_container").eq(id).css("color", "#690e1d").css("padding", "3px").css("font-weight", "bold").css("font-size", "14px").css("background-color", "white").css("opacity", ".8").css("border", "2px solid #690e1d");
		////alert("lock" + id);
	}

	function capitaliseFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}


	$(document).bind('mousemove', function(e) {
		$("#log").text("e.pageX: " + e.pageX + ", e.pageY: " + e.pageY);
	});
	tjeksvar();
});
