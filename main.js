(function () {
    var x = 0;

    var priceBtn = $('#priceForm');


    priceBtn.submit(test);
    function test(e) {
        e.preventDefault();
        console.log(e);
        console.log(e.target[0].value);
    }


    console.log(calc(47.6739881, -122.121512, 150, 15));

    function calc(lat, lon, brng, dist) {

        var radius = 3959;

        var theta = toRadians(Number(brng));
        var delta = Number(dist) / radius; // angular distance in radians

        var phi1 = toRadians(lat);
        var lambda1 = toRadians(lon);

        var phi2 = Math.asin( Math.sin(phi1)*Math.cos(delta) +
                            Math.cos(phi1)*Math.sin(delta)*Math.cos(theta) );

        var lambda2 = lambda1 + Math.atan2(Math.sin(theta)*Math.sin(delta)*Math.cos(phi1),
                                 Math.cos(delta)-Math.sin(phi1)*Math.sin(phi2));
        lambda2 = (lambda2+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180º

        return { lat: toDegrees(phi2), lon: toDegrees(lambda2) };
    }

    function toRadians(deg) {
        return deg * Math.PI / 180;
    }

    function toDegrees(rad) {
        return rad * 180 / Math.PI;
    }

}());