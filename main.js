(function () {
    var locationfound = false;
    var currentLat = 47.6739881;
    var currentLon = -122.121512;

    navigator.geolocation.getCurrentPosition(function (position) {
        locationfound = true;
        console.log(position);
    });
    var x = 0;

    var priceBtn = $('#priceForm');


    priceBtn.submit(test);
    function test(e) {
        e.preventDefault();
        console.log(e);

        /*
        $.get('https://api.uber.com/v1/products', {
            server_token: 'Y-AVmleGPtdlppZLpGTlDaA0fUtrKp-zEMvjRcsT',
            latitude: currentLat,
            longitude: currentLon 
        }).done(function (data) {
            console.log(data);
        });
        */

        console.log(e.target[0].value);
        runThrough(e.target[0].value);

    }

    function getPrice(start, end, possibleDestinations, index, price, cb) {
        console.log(end.lat);
        var x = "Test";
        $.get('https://api.uber.com/v1/estimates/price', {
            server_token: 'Y-AVmleGPtdlppZLpGTlDaA0fUtrKp-zEMvjRcsT',
            start_latitude: start.lat,
            start_longitude: start.lon,
            end_latitude: end.lat,
            end_longitude: end.lon
        }).done(function (data) {
            console.log(data);
            var workingLocation = {};
            var success = false;
            if (data.prices[0].high_estimate <= price) {
                success = true;
                workingLocation = { lat: end.lat, lon: end.lon };
            }
            cb(workingLocation, success, start, possibleDestinations, index + 1, price);
        });

    }

    function runThrough(price) {
        var distance = priceToUberDist(price);
        var possibleDestinations = getDestinations(currentLat, currentLon, distance, 40);
        console.log(distance);
        getPrice({lat: currentLat, lon: currentLon}, possibleDestinations[0], possibleDestinations, 0, price, getPriceCb);

    }

    function getPriceCb(workingLocation, success, start, possibleDestinations, index, price) {
        if (success) {
            launchUber(workingLocation);

        }
        else {
            getPrice(start, possibleDestinations[index], possibleDestinations, index, price, getPriceCb);
        }

    }

    function launchUber(location) {
        console.log(location);
        console.log('IT WORKS');
        var clientID = 'QhylZEag9VXCJV03SaVNv49eCa8vF237';
        var productParam = '&product_id=6450cc0f-4d39-4473-8632-1e2c2049fefe';
        var pickupParam = '&pickup_latitude=' + currentLat + '&pickup_longitude=' + currentLon + '&pickup_nickname=Your%20Location';
        var dropoffParam = '&dropoff_latitude=' + location.lat + '&dropoff_longitude=' + location.lon + '&dropoff_nickname=Surprise%20Location&dropoff_address=Hidden%20St';
        var uberURL = 'https://m.uber.com/sign-up?client_id=' + clientID + productParam + pickupParam + dropoffParam;
        console.log(uberURL);
        window.location = uberURL;

    }

    function priceToUberDist(price) {
        var BASE = 1.35;
        var BSFEE = 1; //uw0tm8
        var MINFARE = 4;
        var MINMULT = .24;
        var MILEMULT = 1.35;

        var actualprice = price > MINFARE ? price : MINFARE; //make sure price is at least minimum

        return (actualprice - BASE - BSFEE) / (MILEMULT + MINMULT);
    }

    function getDestinations(lat, lon, dist, iter) {
        var possibleDesinations = [];
        console.log("dist: " + dist);

        for (var i = 0; i < iter; i++) {
            var minDist = dist / (i + 1);
            var randomizeDist = Math.random() * (dist - minDist) + minDist;
            var randomizeDirection = Math.random() * 360;
            possibleDesinations.push(calc(lat, lon, randomizeDirection, randomizeDist));
        }
        console.log(possibleDesinations);
        return possibleDesinations;

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