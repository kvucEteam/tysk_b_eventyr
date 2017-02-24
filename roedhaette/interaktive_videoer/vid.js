var runde = 0;
var spm_taeller = 0;
var score = 0;
var total_spm = 0;
var playing = false;
var player;
var playtime;
var xmlData;

var hojde;
var bredde;
var vid_length
var videoId;
var popudwidth;
var popud_left;
var url_link;

//displayLink();

function displayLink(link) {
	url_link = link;
	$.ajax({

		type : "GET",
		url : url_link,
		dataType : "xml",
		success : function(xml) {
			xmlData = xml;
			var tal = 1;
			var data = $(xmlData);
			hojde = data.find('video').attr('hojde');
			bredde = data.find('video').attr('bredde');
			vid_length = data.find('video').attr('length');
			videoId = data.find('video').attr('videoId');
			var lengde = data.find('runde').length;
			popudwidth = 450;
			popud_left = (bredde / 2) - (popudwidth / 2);
			//alert("pul" + popud_left);
			for(var i = 0; i < lengde; i++) {
				timestamp_Array.push(data.find('runde').eq(i).attr('timestamp'));
			}
			setUpTube();

		},
		error : function() {
			//alert("error loading xml");
		}
	});
}

//"rottkapchen_1.xml";

var m = 0;

var timestamp_Array = new Array();

//Skriv højde og bredde på den youtube film du amvender:

//bredde på popud'en

///

//

//Tilføjer ny højde og bredde ift youtube filmen:

/// PLAYER SCRIPT
function setUpTube() {
	//alert("sut");
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function onYouTubeIframeAPIReady() {
	//alert(videoId);
	$("#overlay").toggle();
	player = new YT.Player('player', {
		height : hojde,
		width : bredde,
		videoId : videoId,
		playerVars : {
			'id' : 'ytPlayer',
			'enablejsapi' : 1,
			'allowScriptAccess' : 'always',
			'version' : 3,
			'controls' : 0,
			'showinfo' : 0,
			'modestbranding' : 1,
			wmode : 'transparent',
			allowFullScreen : false

		},
		events : {
			'onStateChange' : function(event) {

				if(event.data == YT.PlayerState.PLAYING) {
					playing = true;
					////////alert ("pølse");
				}
				else {
					playing = false;
					////////alert ("pølse");
				}
				//	var hallo = player.getCurrentTime();
				////////alert(hallo);
			},
			'onReady' : function(event) {
				//alert("ready");
				setInterval(function() {

					var playTime = Math.round(player.getCurrentTime());
					var s = playTime - (m * 60);
					if(s > 59) {
						m++;
					}

					var dec_s = s;
					if(dec_s < 10) {
						dec_s = "0" + dec_s;
					}

					$('#time').html(m + ":" + dec_s + " / " + vid_length + " [Næste spørgsmål om <b> " + (timestamp_Array[runde] - playTime) + "</b> sekunder]");
					//console.log(playTime + "," + timestamp_Array[runde] + ", " + player.getPlaybackRate());
					if(playTime > timestamp_Array[runde] && playing == true) {
						playing == false;

						poseQuestion();
					}
				}, 1000)
			}
		}
	});
	$("#overlay").css("height", hojde);
	$("#overlay").css("width", bredde);
	$(".popud").css("width", popudwidth);
	$(".popud").css("left", popud_left);
}

// 4. The API will call this function when the video player is ready.

function poseQuestion() {

	//////alert("kør den auf!");
	player.pauseVideo();

	init(runde, spm_taeller);

}

function resumeVideo() {
	player.playVideo();
}

function init(tal, taeller) {

	//alert("runde:" + tal + "spm_taeller" + taeller );

	if(spm_taeller == 0) {
		$("#overlay").fadeToggle();
	}
	$('.popud').animate({
		top : -400,
	}, 0, function() {
		$('.popud').animate({
			top : 80,
		}, 550, function() {
			// Animation complete.
		});
	});
	var data = $(xmlData);

	var akt_runde = data.find('runde').eq(tal);

	var spm = akt_runde.find('spm').eq(taeller);

	var spm_length = akt_runde.find('spm').length;

	var tekst = spm.attr('tekst');

	var bol = spm.attr('korrekt');

	//alert ("bol:" + bol)

	var svar_length = spm.find('svar').length;

	var svar = spm.find('svar');

	var options_text = "";

	//var popud_height = 130 + (svar_length * 30);
	//alert (popud_height);

	//$(".popud").css("height", popud_height);

	for(var i = 0; i < svar_length; i++) {
		options_text = options_text + "<tr id ='" + i + "'> <td><span class='imgspan' >" + (i + 1) + ". " + svar.eq(i).attr("value") + "</span></td></tr>";
	}
	//$("#runde").html("<h4>Quizrunde " + (runde + 1) + ", spørgsmål " + (spm_taeller + 1) + " af " + spm_length + "<br/>Din score: " + score + "</h4>");

	$(".popud").html("<h3>" + tekst + "</h3><table>" + options_text + "</table><div id='feed'></div>");

	$("tr").click(function() {
		//$("tr").unbind('click');
		total_spm++;
		var valgt = $(this).attr("id");
		$(this).css("color", "#dddddd");

		if(valgt == bol) {
			score++;
			//$("#feed").html("<br/>Das ist richtig!").css("color", "green");
			spm_taeller++;
			$("tr").each(function() {
				if($(this).attr("id") == bol) {
					$(this).css("color", "#4b865c");
				} else {
					$(this).css("color", "#dddddd");
				}
			});
			if(spm_taeller < spm_length) {
				setTimeout(function() {
					init(runde, spm_taeller);
				}, 500);
			} else {
				if(tal > timestamp_Array.length - 2) {
					slutFeedback();
				} else {
					$('#overlay').delay(500).fadeToggle('slow', function() {
						//alert("fjern overlay");
						resumeVideo();
						spm_taeller = 0;
						runde++;
					});
				}
			}
		} else {
			$("#feed").html("<br/>Nein, das ist nicht richtig. Versuch noch einmal!").css("color", "red");

		}

	});
}

function slutFeedback() {
	//alert("slut");

	$(".popud").html("<h3 class = 'forfra'>Filmen er slut. <br>Du svarede rigtigt på " + score + " ud af " + total_spm + " spørgsmål.<br/>Klik for at prøve igen</h3>");
	$(".forfra").click(function() {
		//alert ("ost");
		location.reload();
	});
}