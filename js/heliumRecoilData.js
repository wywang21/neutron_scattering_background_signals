const kb = 1.3806e-23; // Boltzmann Constant
const hbar = 1.055e-34; // Planck Constant
const eV2J = 1.6022e-22; // energy conversion
const neutronmass = 1.661e-27; // unit atom mass in Kg
const heliummass = 4 * neutronmass; // Helium mass in Kg

function getHeliumRecoilData() {
    let temperature1 = document.getElementById('T1').valueAsNumber;
    let temperature2 = document.getElementById('T2').value;
    if (temperature2 == null || temperature2 === "") {
        temperature2 = 300;
    }
    let xValues = numeric.linspace(0, 4, 200);
    let yValues = numeric.linspace(-1, 20, 85);
    let intensity1 = [];
    let intensity2 = [];
    let intensityDiff = [];

    for (let rowIndex = 0; rowIndex < yValues.length; ++rowIndex) {
        let currIntensity1 = [];
        let currIntensity2 = [];
        let currIntensityDiff = [];
        for (let colIndex = 0; colIndex < xValues.length; ++colIndex) {
            let currQ = xValues[colIndex] * 1e10;
            let currE = yValues[rowIndex];
            let energyRConv = hbar * hbar / 2.0 / heliummass * currQ * currQ;
            let energyConv = currE * eV2J;
            let beta1 = 1.0 / (kb * temperature1);
            let beta2 = 1.0 / (kb * temperature2);

            let s1 = Math.sqrt((beta1/(4*Math.PI*energyRConv)))
                * Math.pow(Math.E
                    , ((-1)*beta1/(4*Math.PI*energyRConv) * (energyConv - energyRConv) * (energyConv - energyRConv)))
                /(1e21);
            let s2 = Math.sqrt((beta2/(4*Math.PI*energyRConv)))
                * Math.pow(Math.E
                    , ((-1)*beta2/(4*Math.PI*energyRConv) * (energyConv - energyRConv) * (energyConv - energyRConv)))
                /(1e21);
            let sDiff = s1 - s2;
            currIntensity1.push(s1);
            currIntensity2.push(s2);
            currIntensityDiff.push(sDiff);
        }
        intensity1.push(currIntensity1);
        intensity2.push(currIntensity2);
        intensityDiff.push(currIntensityDiff);
    }

    g_heatMapX = xValues;
    g_heatMapY = yValues;
    if (document.getElementById('plotTemperatureDiff').checked && document.getElementById('T2').value != null) {
        g_heatMapIntensity = intensityDiff;
    } else {
        g_heatMapIntensity = intensity1;
    }
    // the error is set to zero for helium recoil simulation.
    let errorMatrix = [];
    for (let ii = 0; ii < yValues.length; ++ii) {
        errorMatrix.push(numeric.linspace(0, 0, xValues.length));
    }
    g_heatMapError = errorMatrix;
}