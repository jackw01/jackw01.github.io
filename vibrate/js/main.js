var on = false;

document.getElementById("toggle").onclick = function() { on = !on };

function run() {
    var t1 = parseInt(document.getElementById("on-time").value);
    var t2 = parseInt(document.getElementById("off-time").value);
    if (on) navigator.vibrate([t1, t2]);
    setTimeout(run, t1 + t2);
}

run();
