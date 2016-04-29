function createFields() {

    var container = document.getElementById("container");
    for (var i = 0; i < 6 ; i++) {
        var node = document.createElement("div");


        node.className = "rcorners";

        container.appendChild(node);
    }
}

function distributeFields() {

    var fields = document.getElementsByClassName("rcorners"),
        container = document.getElementById("container"),
        width = container.offsetWidth,
        height = container.offsetHeight,
        angle = 0, step = (2 * Math.PI) / fields.length;

    var radius = width / 2;
    for (var i = 0; i < fields.length; i++) {



        var x = Math.round(width / 2 + radius * Math.cos(angle) - fields[i].offsetWidth / 2);
        var y = Math.round(height / 2 + radius * Math.sin(angle) - fields[i].offsetHeight / 2);

        
        

        fields[i].style.left = parseFloat(100 * x / window.screen.width) + '%';
        fields[i].style.top = parseFloat(100 * y / window.screen.height) + '%'


        angle += step;
    };


}



createFields();
distributeFields();