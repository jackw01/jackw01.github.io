/*
IconScaler
Copyright (C) 2018 jackw01
This program is distrubuted under the MIT License, see LICENSE for details
*/

// Icon sizes
var iconSizes = {
    "iOS": {
        "Icon-29@1x":            29,
        "Icon-40@1x":            40,
        "Icon-50@1x":            50,
        "Icon-57@1x":            57,
        "Icon-29@2x":            58,
        "Icon-60@1x":            60,
        "Icon-72@1x":            72,
        "Icon-76@1x":            76,
        "Icon-40@2x":            80,
        "Icon-29@3x":            87,
        "Icon-50@2x":            100,
        "Icon-57@2x":            114,
        "Icon-40@3x":            120,
        "Icon-60@2x":            120,
        "Icon-72@2x":            144,
        "Icon-76@2x":            152,
        "Icon-83.5@2x":          167,
        "Icon-60@3x":            180,
        "Icon-76@3x":            228,
        "Icon-512@1x":           512,
        "Icon-512@2x":           1024,
        "Icon-512@3x":           1536
    },
    "Android": {
        "drawable-ldpi-icon":    36,
        "drawable-mdpi-icon":    48,
        "drawable-hdpi-icon":    72,
        "drawable-xhdpi-icon":   96,
        "drawable-xxhdpi-icon":  144,
        "drawable-xxxhdpi-icon": 192,
        "play-store":            512
    }
};

// Global variables
var c = document.getElementById("canvas").getContext("2d");
var tc1 = document.getElementById("canvas-temp1").getContext("2d");
var tc2 = document.getElementById("canvas-temp2").getContext("2d");
var imageReady = false;
var sourceImage;

// Input processing
$("#input-image").change(function() {

    var reader = new FileReader();

    reader.onload = function(event) {
        sourceImage = new Image();
        sourceImage.onload = function() {
            imageReady = true;
            $("#button-generate").show();
        }
        sourceImage.src = event.target.result;
    }

    reader.readAsDataURL(this.files[0]);
});

$("#button-generate").click(function() {

    var os = $("#select-os").val();

    var zip = new JSZip();
    var folder = zip.folder(os);

    for (var key in iconSizes[os]) {

        if (!iconSizes[os].hasOwnProperty(key)) continue;

        c.canvas.width = c.canvas.height = iconSizes[os][key];

        // Incremental downsampling - dirty hack to deal with default nearest-neighbor sampling
        if (iconSizes[os][key] <= sourceImage.width / 2) {

            var targetSize = sourceImage.width; // Initialize
            var currentSize = tc2.canvas.width = tc2.canvas.height = sourceImage.width; // Starting width
            tc2.drawImage(sourceImage, 0, 0, tc2.canvas.width, tc2.canvas.width); // Draw image on tc2

            while (targetSize > iconSizes[os][key] * 2) {
                targetSize = tc1.canvas.width = tc1.canvas.height = Math.round(currentSize / 2); // Set tc1 to target size
                tc1.drawImage(tc2.canvas, 0, 0, tc1.canvas.width, tc1.canvas.width); // Scale tc2 to target size
                currentSize = tc2.canvas.width = tc2.canvas.height = targetSize; // Set tc2 to target size
                tc2.drawImage(tc1.canvas, 0, 0, tc2.canvas.width, tc2.canvas.width); // Draw scaled tc2 to tc2
            }

            c.drawImage(tc2.canvas, 0, 0, c.canvas.width, c.canvas.width);

        } else {
            c.drawImage(sourceImage, 0, 0, c.canvas.width, c.canvas.width);
        }

        var data = c.canvas.toDataURL("image/png").split("base64,")[1];
        folder.file(key + ".png", data, { base64: true });
    }

    zip.generateAsync({ type: "blob", compression: "DEFLATE" }).then(function(content) {
        saveAs(content, os + ".zip");
    });
});

// Run on page load
$(document).ready(function() {

    $("#button-generate").hide();
});
