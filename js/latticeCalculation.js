window.onload = function() {
    document.getElementById('add_btn').onclick = addPoint;
    document.getElementById('delete_btn').onclick = deletePoints;
};

function handleQValueKnownClick() {
    if (document.getElementById('QValueKnownYes').checked) {
        document.getElementById('a').disabled = true;
        document.getElementById('b').disabled = true;
        document.getElementById('c').disabled = true;
        document.getElementById('alpha').disabled = true;
        document.getElementById('beta').disabled = true;
        document.getElementById('gamma').disabled = true;
        document.getElementById('h').disabled = true;
        document.getElementById('k').disabled = true;
        document.getElementById('l').disabled = true;
        document.getElementById('q').disabled = false;

        document.getElementById('a').value = '';
        document.getElementById('b').value = '';
        document.getElementById('c').value = '';
        document.getElementById('alpha').value = '';
        document.getElementById('beta').value = '';
        document.getElementById('gamma').value = '';
        document.getElementById('h').value = '';
        document.getElementById('k').value = '';
        document.getElementById('l').value = '';
    } else {
        document.getElementById('a').disabled = false;
        document.getElementById('b').disabled = false;
        document.getElementById('c').disabled = false;
        document.getElementById('alpha').disabled = false;
        document.getElementById('beta').disabled = false;
        document.getElementById('gamma').disabled = false;
        document.getElementById('h').disabled = false;
        document.getElementById('k').disabled = false;
        document.getElementById('l').disabled = false;
        document.getElementById('q').disabled = true;

        document.getElementById('q').value = '';
    }
}

function handleLatticeValueChange() {
    var a = document.getElementById('a').value;
    var b = document.getElementById('b').value;
    var c = document.getElementById('c').value;
    var alpha = document.getElementById('alpha').value;
    var beta = document.getElementById('beta').value;
    var gamma = document.getElementById('gamma').value;
    var h = document.getElementById('h').value;
    var k = document.getElementById('k').value;
    var l = document.getElementById('l').value;

    if (a == null || a === ""
        || b == null || b === ""
        || c == null || c === ""
        || alpha == null || alpha === ""
        || beta == null || beta === ""
        || gamma == null || gamma === ""
        || h == null || h === ""
        || k == null || k === ""
        || l == null || l === ""
    ) {
        return;
    }

    var alphaRad = toRadians(alpha);
    var betaRad = toRadians(beta);
    var gammaRad = toRadians(gamma);
    var ax1 = [1, 0, 0];
    var ax2 = [Math.cos(gammaRad), Math.sin(gammaRad), 0];
    var ax3 = [Math.cos(betaRad), //TODO]

}

function toRadians(degree) {
    return degree * (Math.PI / 180);
}