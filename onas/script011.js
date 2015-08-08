// *********************************
// script written by Radek HULAN
// http://hulan.cz/
// (C) 2011
// *********************************

// eshop
function calcTotalPrice() {
	var price = $('#totalprice span').text();
	price = price.replace(" ","");
	price = price.replace(",",".");
	price = parseFloat(price);
	var uhradaid = parseInt( $('input[name=uhrada]:checked').attr('rel') );
	if (isNaN(uhradaid)) {
		$('input[name=uhrada]:visible').first().attr('checked','checked');
		uhradaid = parseInt( $('input[name=uhrada]:checked').attr('rel') );
	}
	var uhrada = parseFloat($('#uhrada'+uhradaid).attr('title'));
	var doruceniid = parseInt( $('input[name=doruceni]:checked').attr('rel') ); 
	if (isNaN(doruceniid)) {
		$('input[name=doruceni]:visible').first().attr('checked','checked');
		doruceniid = parseInt( $('input[name=doruceni]:checked').attr('rel') ); 
	}
	var doruceni = parseFloat($('#doruceni'+doruceniid).attr('title'));
	$('p.doruceniswitch').hide();
	var isok = false; 
	for (var i=0; i < relaceDU[uhradaid-1].length; i++) {
		$('#doruceni'+relaceDU[uhradaid-1][i]).show();
		if (doruceniid == parseInt(relaceDU[uhradaid-1][i]))
			isok = true;
	}
	if (!isok) {
		$('input[name=doruceni]:visible').first().attr('checked',true);
		var doruceni = parseFloat($('input[name=doruceni]:visible').first().parents('p').attr('title'));
	}
	var celkem = price + uhrada + doruceni;
	$('#totalpricedelivery span').text(celkem);
}

// menu functions
var oMenuTimeout, noClickProcess = false;
function hideMenu(){ if (oMenuTimeout) window.clearTimeout(oMenuTimeout); oMenuTimeout=window.setTimeout("hideAllMenu()",400); }
function showMenu(item){
	if (oMenuTimeout) window.clearTimeout(oMenuTimeout);
	for (var i = 1; i<=6; i++) {
		if (i == item) $('#menu'+i).show(150); else $('#menu'+i).hide(150);
	}
}
function hideAllMenu(){ showMenu(0); }

// colorbox
function processLightbox() {
	$("a[rel='lightbox']").colorbox( {
		slideshow:true, 
  		slideshowAuto:false, 
  		href: function() { return $(this).attr('href'); },
  		maxWidth:'95%', 
  		maxHeight:'95%', 
  		scalePhotos:true
	});
}
$(document).ready(function(){ processLightbox(); });

var filtrcenarange, filtrvyskarange;

function hashAJAXkola() {
   var oldhash = window.location.hash;
   $(window).hashchange( function(){
     var hash = window.location.hash;
     if (hash == oldhash) return;
     oldhash = hash;
     $('#loader').toggleClass('hide');
     if (hash) hash = hash.substr(1);
     $.ajax({
		url: "/wizard-ajax.php",
       	type: "GET",
       	dataType: "html", 
       	data: hash,
       	success: function(result) { 
			$('#koloresult').html(result);      
			var o = $('#koloresult').offset();
			$('html, body').animate({scrollTop:o.top}, 400);
			setMinMax();
       	},
       	error: function(jqXHR, textStatus, errorThrown) {
       		$('#loader').toggleClass('hide');
       	}
     });
   })
   if (oldhash) {
     oldhash = '';
     $(window).hashchange();
   }
}

function hashAJAXeshop() {
   var oldhash = window.location.hash;
   $(window).hashchange( function(){
     var hash = window.location.hash;
     if (hash == oldhash) return;
     oldhash = hash;
     $('#loader').toggleClass('hide');
     if (hash) hash = hash.substr(1);
     $.ajax({
		url: "/eshop-ajax.php",
       	type: "GET",
       	dataType: "html", 
       	data: hash,
       	success: function(result) { 
       		$('#eshopresult').html(result); 
			var o = $('#eshopresult').offset();
			$('html, body').animate({scrollTop:o.top}, 400);
       	},
       	error: function(jqXHR, textStatus, errorThrown) {
       		$('#loader').toggleClass('hide');
       	}
     });
   })
   if (oldhash) {
     oldhash = '';
     $(window).hashchange();
   }
}

function setMinMax() {
	var api = $(filtrcenarange).data("rangeinput");
    api.setMin($('#mincena').text());
    api.setMax($('#maxcena').text());
    $('#cenakola').html('Cena kola od <strong>'+$('#mincena').text()+' Kč</strong> do <strong>'+$('#maxcena').text()+' Kč</strong>');
    var api = $(filtrvyskarange).data("rangeinput");
    api.setMin($('#minvyska').text());
	api.setMax($('#maxvyska').text());
}

function filtrAJAXkola() {
	$('#filtrbutton').click( function(){
		$('#filtrcontent').toggle(400);
		$('#filtrbutton').toggleClass('active');
	});
	filtrcenarange = $("#cenaid").rangeinput();
	filtrvyskarange = $("#vyskaid").rangeinput();
  	$(".slider").mousedown(function() {
    	var el = $(this).parent().find(".sliderswitcher").first();
    	if (el.text() == 'zapnout')
      		el.addClass('active').text('vypnout').parent().find("input").attr('disabled','');
  	});
  	$(".sliderswitcher").click( function(){
    	var r = $(this).attr('rel');
    	var t = $(this).text();
    	if (t == 'zapnout') {
      		$(this).addClass('active').text('vypnout');
      		$('input[name='+r+']').attr('disabled','');
    	} else {
      		$(this).removeClass('active').text('zapnout');
      	$('input[name='+r+']').attr('disabled','disabled');
    	}
  	});
}

function confirmDoIt() {
	return confirm("Skutečně chcete provést tuto akci?");
}

function processDoplnky() {
	$('table.doplnky input').change(function(){
		var el = $(this).parents('tr');
		var c = el.find('td:first input:checked').size();
		var m = $(this).parents('td').next().next().next().find('input');
		if (c) {
			el.addClass('red'); 
			m.removeAttr('disabled');
		} else { 
			el.removeClass('red');
			m.removeAttr('checked').attr('disabled','disabled');
		}
		c = 0;
		$('table.doplnky input:checked').each(function(){
			c = c + parseFloat( $(this).attr('data-value') );
		});
		$('#totaldoplnky').text(c);
	});
 	$('img.image').live('mouseenter',function() {
 		var s = $(this).attr('data-url');
 		s = s.toString();
 		if (s == 'undefined' || s == '') return;
 		var b = $('#bigimage');
 		if (!b.size()) {
 			$('#items').prepend('<div id="bigimage"></div>');
 			b = $('#bigimage');
 		}
		b.html($(this).attr('data-title')+'<img src="'+s+'" />');
		var h = $(window).scrollTop();
		if (h > 170) h = h - 170; else h = 0;
		b.css('top',h+'px').show();
 	}).live('mouseleave',function() {
		$('#bigimage').hide();
 	});
	
}

 	var productImageTimer, productImageElement;
	function clearProduktTimeout() {
		if (productImageTimer) window.clearTimeout(productImageTimer);
	}
 	function setProduktImage() {
 		clearProduktTimeout();
 		var s = $(productImageElement).attr('data-url');
 		s = s.toString();
 		if (s == 'undefined' || s == '') return;
 		var b = $('#bigimage');
 		if (!b.size()) {
 			$('#items').prepend('<div id="bigimage"></div>');
 			b = $('#bigimage');
 		}
 		var el = $(productImageElement).parents('.produkt');
 		var p1 = el.find('h3 a').text();
 		var p2 = el.find('.cena strong').html();
 		b.hide();
		b.html('<p>'+p1+' - <strong>'+p2+'</strong></p><img src="'+s+'" /><div id="kolodata"></div>');
		var h = $(window).scrollTop();
		if (h > 170) h = h - 170; else h = 0;
		b.css('top',h+'px').show();
		var i = $(productImageElement).attr('data-itemid');
		if (!isNaN(i)) {
			var hash = 'itemid=' + i;
    	 	$.ajax({
				url: "/produkt-ajax.php",
       			type: "GET",
	       		dataType: "html", 
    	   		data: hash,
       			success: function(result) { $('#kolodata').hide().html(result).show(200); }
     		});
     	}
 	}

$(document).ready(function(){
	// menu
    $('#menu > ul > li').mouseenter( function(){
    	noClickProcess = true;
    	var i = parseInt($(this).attr('rel')); 
   		showMenu(i); 
    }).click( function() {
    	if (noClickProcess) return;
    	var i = parseInt($(this).attr('rel'));
    	if (i > 0) {
    		var s = $('#menu'+i+':hidden').size();
    		if (s > 0) showMenu(i); else hideAllMenu();
    	} else hideAllMenu();
    	return false;
    });
	$('#menu').mouseleave( function(){ hideMenu(); });
	
	// produktove nahledy
 	$('.produkt p.image').live('mouseenter',function() {
 		if (productImageTimer) window.clearTimeout(productImageTimer);
 		productImageElement = this;
 		productImageTimer = window.setTimeout("setProduktImage()",100);
 	}).live('mouseleave',function() {
 		clearProduktTimeout();
		$('#bigimage').remove();
 	});
 	$('#koloresult').mouseleave(function(){
 		clearProduktTimeout();
		$('#bigimage').remove();
 	});
 	
});
