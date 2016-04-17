var socket = io();
var scalar = 1;
var face, confirmedurl, origimgurl, errcode;

if (getQueryVariable('link')) {
    $( '#container' ).html( '' );
    $( '#ontop' ).html( '' );
    $( '#text' ).html( '' );
    scalar = 1;
    $( 'form' ).replaceWith('<form action="http://aifunclub.azurewebsites.net/"><input type="submit" id="redirect" value="Wanna make your own deal-with-it animation?">');
    origimgurl = getQueryVariable('link');
    socket.emit('origimgurl', origimgurl);
}

socket.on('face', function(response) {
    if (response == '') { 
        alert('Error! Make sure your image has at least one face and is less than 4 MB.');
        location.reload(true);
    }
    else {
        $('<img>', { src: origimgurl, style: 'opacity:0'} ).appendTo( '#container' );
        //responsestored = response;
        $( 'img' ).load(function(){
                
                imgwidth = (scalar * $('img').width());
                imgheight = (scalar * $('img').height());
                
                //if ( $( '#container' ).height() >= imgheight && $( '#text' ).width() >= imgwidth ) {
                //    }
                
                if ( ($( '#text' ).width() < imgwidth) && ($( '#container' ).height() < imgheight) ) {
                    if ($( '#text' ).width() / imgwidth <= $( '#container' ).height() / imgheight) {
                        scalar = ($( '#text' ).width() / imgwidth);     
                    }  
                    else { scalar = $( '#container' ).height() / imgheight }
                }
                    
                else if ( ($( '#text' ).width() < imgwidth) && ($( '#container' ).height() >= imgheight) ) {
                    scalar = ($( '#text' ).width() / imgwidth);  
                    }
                    
                else if ( ($( '#container' ).height() < imgheight) && ($( '#text' ).width() >= imgwidth)) {
                    scalar = $( '#container' ).height() / imgheight;    
                    }
                    
                else { }
                    
                imgwidth = scalar * imgwidth;   
                imgheight = scalar * imgheight;
                    
                $('img').css("height", imgheight + 'px');
                $('#text').css("font-size", imgwidth/10 + "px");
                $('#text').css("top", (imgheight - (imgwidth/10)) + "px");
                
                console.log('Scalar = ' + scalar);
                
                $('img').animate( {opacity: 1}, 500);
                
            for (i = 0; i < response.length; i++) {
                face = response[i];
                imgMath(face);
            }
            //leftoffset = parseInt($( '.glasses' ).eq(0).css('left'), 10) - parseInt($( '#container' ).css('margin-left'), 10);
            glassesoffset = $( '.glasses' ).eq(0).offset();
            imgoffset = $( 'img' ).offset();
            offsetdiff = parseInt(glassesoffset.left,10) - parseInt(imgoffset.left, 10);
            history.pushState({}, "new url", "?link=" + origimgurl);
            //$( '#share' ).prop('disabled', false);
            // $( 'p' ).prepend( '<strong><a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent('Deal with it... ' + encodeURI('http://aifunclub.azurewebsites.net/index.html?link=') + encodeURI(origimgurl)) + '&hashtags=aifunclub" target="new">Share on twitter</a></strong> ' );
            $( 'form' ).replaceWith('<form action="http://aifunclub.azurewebsites.net/"><input type="button" id="redirect" value="Wanna make another?"> <input type="button" id="twitter" value="Share on twitter">');
        });
    }
});

  
$( window ).resize(function() {
    // var imgleftoffset = parseInt($( '#container' ).css('margin-left'), 10);
    // $( '.glasses' ).eq(0).css('left',  '' + (imgleftoffset + leftoffset) + 'px');
    // console.log('Leftoffset: ' + leftoffset + ', imgleftoffset: ' + imgleftoffset);
    newimgoffset = $( 'img' ).offset();
    newglassesoffset = parseInt(newimgoffset.left, 10) + offsetdiff
    //$( '.glasses' ).eq(0).css('left', newglassesoffset + 'px');
    $( '.glasses' ).css('left', newglassesoffset + 'px');
    
});

$( '#twitter' ).on('click', function(){
    window.open = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Deal with it... ' + encodeURI('http://aifunclub.azurewebsites.net/index.html?link=') + encodeURI(origimgurl)) + '&hashtags=aifunclub" target="new"'
});


    function imgMath(face){
        

                //$('.glasses').width = scalar * $('.glasses').width;
                
                var centerofeyes = ((face.faceLandmarks.pupilLeft.x + face.faceLandmarks.pupilRight.x) / 2);
                if (face.faceAttributes.headPose.yaw > 0) {
                    jQuery('<div>', {
                        class: 'glasses',
                        style: 'transform-origin: 50% 100%; top: 0px; transform: rotateZ(' + (face.faceAttributes.headPose.roll) + 'deg); width:' + (scalar * 1.35 * face.faceRectangle.width) + 'px; left:' + ((scalar * (centerofeyes - 0.62 * (1.35 * face.faceRectangle.width))) + parseInt($('#container').css("margin-left"), 10) + ( ($('#container').width() - imgwidth)/2 )) + 'px; height:' + scalar * (1.2 * 0.15 * face.faceRectangle.width) + 'px;'
                    }).appendTo('#ontop');
                }
                else {
                    jQuery('<div>', {
                        class: 'glasses',
                        style: 'transform-origin: 50% 0%; top: 0px; transform: rotateY(180deg) rotateZ(' + (-1 * face.faceAttributes.headPose.roll) + 'deg); width:' + (scalar * 1.35 * face.faceRectangle.width) + 'px; left:' + ((scalar * (centerofeyes - 0.35 * (1.35 * face.faceRectangle.width))) + parseInt($('#container').css("margin-left"), 10) + ( ($('#container').width() - imgwidth)/2 )) + 'px; height:' + scalar * (1.2 * 0.15 * face.faceRectangle.width) + 'px;'
                    }).appendTo('#ontop');
                }
                
                var landingspot = (scalar * (((face.faceLandmarks.pupilLeft.y + face.faceLandmarks.pupilRight.y) / 2) - (parseInt($(".glasses").eq(i).css('height'), 10) / 2) )) + parseInt($('#container').css("padding-top"));
                
                console.log(scalar + ', ' + landingspot);
                
                $(".glasses").eq(i).animate({ top: (landingspot) }, 1800, function() {
                    if (parseInt($(".glasses").eq(-1).css('top'), 10) >= Math.trunc(landingspot)) {
                        $('#text').html('DEAL WITH IT');
                        console.log("Function happened.");
                        }
                    else {}
                });     
             }
             
function submitUrl() {
    $( '#container' ).html( '' );
    $( '#ontop' ).html( '' );
    $( '#text' ).html( '' );
    scalar = 1;
    origimgurl = $( 'input:first' ).val(); 
    socket.emit('origimgurl', origimgurl);
}


function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
        }
    return(false);
}