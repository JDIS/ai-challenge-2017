$(function () {
    var $dropZone = $("html");
    var $filePicker = $("#filePicker");

    var replayFilePath = getUrlParameter('path');

    if(replayFilePath){
        handleUrlPathFile(replayFilePath)
    }

    function handleUrlPathFile(replayFilePath) {

        var request = new XMLHttpRequest();
        request.open('GET', replayFilePath, true);
        request.responseType = 'blob';

        request.onload = function(filename) {
            var reader = new FileReader();
            reader.onload = (function(filename) { // finished reading file data.
                return function(e2) {
                    console.log('Fetched replay file.');
                    var fsHeight = $("#fileSelect").outerHeight();
                    showGame(textToGame(e2.target.result, filename), $("#displayArea"), null, -fsHeight, true, false, true);
                };
            })(filename);
            reader.readAsText(request.response);
        };
        request.send();
    }

    function handleFiles(files) {
        // only use the first file.
        file = files[0];
        var reader = new FileReader();

        reader.onload = (function(filename) { // finished reading file data.
            return function(e2) {
                $("#displayArea").empty();
                $("label[for=filePicker]").text("Choisir un autre fichier");
                var fsHeight = $("#fileSelect").outerHeight();
                console.log(filename)
                showGame(textToGame(e2.target.result, filename), $("#displayArea"), null, -fsHeight, true, false, true);
            };
        })(file.name);
        reader.readAsText(file); // start reading the file data.
    }

    $dropZone.on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $dropZone.on('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.originalEvent.dataTransfer.files; // Array of all files
        handleFiles(files)
    });
    $filePicker.on('change', function(e) {
        var files = e.target.files
        handleFiles(files)
    });
})

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};