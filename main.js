(function () {
    var x = 0;

    var priceBtn = $('#priceForm');


    priceBtn.submit(test);
    function test(e) {
        e.preventDefault();
        console.log(e);
        console.log(e.target[0].value);
        console.log(priceToUberDist(e.target[0].value));
        var slat, slon;
        slat = 47.6739881;
        slon = -122.121512;
        //getPrice({ lat: slat, lon: slon }, calc(slat, slon, 150, 5));
    }

    function getPrice(start, end) {
        console.log(end.lat);
        $.get('https://api.uber.com/v1/estimates/price', {
            server_token: 'o1iNjGxcHmGue5VjdYpWmzD4mw5jfmVQaTfBSIgf',
            start_latitude: start.lat,
            start_longitude: start.lon,
            end_latitude: end.lat,
            end_longitude: end.lon
        }).done(function (data) {
            console.log(data);

        });

    }

    function priceToUberDist(price) {
        var BASE = 1.35;
        var BSFEE = 1;
        var MINFARE = 4;
        var MINMULT = .24;
        var MILEMULT = 1.35;

        var distance = (price - BASE - BSFEE) / (MILEMULT + MINMULT);
        return price > 4 ? distance : 4;
    }



    console.log(calc(47.6739881, -122.121512, 150, 15));


    function calc(lat, lon, brng, dist) {

        var radius = 3959; //of earth in miles

        var theta = toRadians(Number(brng));
        var delta = Number(dist) / radius; // angular distance in radians

        var phi1 = toRadians(lat);
        var lambda1 = toRadians(lon);

        var phi2 = Math.asin( Math.sin(phi1)*Math.cos(delta) +
                            Math.cos(phi1)*Math.sin(delta)*Math.cos(theta) );

        var lambda2 = lambda1 + Math.atan2(Math.sin(theta)*Math.sin(delta)*Math.cos(phi1),
                                 Math.cos(delta)-Math.sin(phi1)*Math.sin(phi2));
        lambda2 = (lambda2+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180

        return { lat: toDegrees(phi2), lon: toDegrees(lambda2) };
    }

    function toRadians(deg) {
        return deg * Math.PI / 180;
    }

    function toDegrees(rad) {
        return rad * 180 / Math.PI;
    }

}());