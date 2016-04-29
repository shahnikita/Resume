var texts = [
"Hello!", "I'm Nikita Shah", "I'm a web developer"
]

var captionLength = 0;
var caption = '';
var i = 0;



function testTypingEffect() {
    if (i == texts.length) {
        i = 0;
    }
    caption = texts[i];
    i++;
    type();


}

function type() {
    captionEl.html(caption.substr(0, captionLength++));

    if (captionLength < caption.length + 1) {
        setTimeout('type()', 150);
    }
    if (captionLength == caption.length + 1) {
        setTimeout('testErasingEffect()', 200);
    }
}

function testErasingEffect() {
    caption = captionEl.html();
    captionLength = caption.length;
    if (captionLength > 0) {
        erase();
    }
}

function erase() {
    captionEl.html(caption.substr(0, captionLength--));
    if (captionLength >= 0) {
        setTimeout('erase()', 150);
    } else {
        captionLength = 0;
        caption = '';
        testTypingEffect();
    }
}




$(document).ready(function () {
   
    captionEl = $('#changingText');
    testTypingEffect();


    

});





