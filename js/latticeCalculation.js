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

        document.getElementById('q').value = '';
        document.getElementById('q').disabled = true;
    }
}

function handleLatticeValueChange() {
    let a = document.getElementById('a').value;
    let b = document.getElementById('b').value;
    let c = document.getElementById('c').value;
    let alpha = document.getElementById('alpha').value;
    let beta = document.getElementById('beta').value;
    let gamma = document.getElementById('gamma').value;
    let h = document.getElementById('h').value;
    let k = document.getElementById('k').value;
    let l = document.getElementById('l').value;

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

    let alphaRad = toRadians(alpha);
    let betaRad = toRadians(beta);
    let gammaRad = toRadians(gamma);
    let ax1 = [1, 0, 0];
    let ax2 = [Math.cos(gammaRad), Math.sin(gammaRad), 0];
    let ax3 = [Math.cos(betaRad), (Math.cos(alphaRad) - Math.cos(gammaRad) * Math.cos(betaRad)) / Math.sin(gammaRad), 0];
    ax3[2] = Math.sqrt(1 - ax3[0] * ax3[0] - ax3[1] * ax3[1]);

    ax1 = numeric.dot(a, ax1);
    ax2 = numeric.dot(b, ax2);
    ax3 = numeric.dot(c, ax3);
    let volume = numeric.dot(ax3, crossProduct(ax1, ax2));
    let reciprocalAx1 = numeric.dot(2 * Math.PI / volume, crossProduct(ax2, ax3));
    let reciprocalAx2 = numeric.dot(2 * Math.PI / volume, crossProduct(ax3, ax1));
    let reciprocalAx3 = numeric.dot(2 * Math.PI / volume, crossProduct(ax1, ax2));

    let queryQ = numeric.add(numeric.dot(h, reciprocalAx1), numeric.dot(k, reciprocalAx2), numeric.dot(l, reciprocalAx3));
    let qNorm = Math.sqrt(numeric.dot(queryQ, queryQ));

    document.getElementById('q').value = parseFloat(qNorm.toFixed(5));
}

function addPoint() {
    let q = document.getElementById('q').valueAsNumber;
    let e = document.getElementById('energy').valueAsNumber;
    if (q == null || q === "" || e == null || e === "") return;
    queryPointsX.push(q);
    queryPointsY.push(e);
    drawCytopAndAlMap();
}

function deletePoints() {
    queryPointsX = [];
    queryPointsY = [];
    drawCytopAndAlMap();
}


function toRadians(degree) {
    return degree * (Math.PI / 180);
}

function crossProduct(v1, v2) {
    return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]];
}
