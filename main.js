(function () {
    var x = 0;

    var priceBtn = $('#priceForm');


    priceBtn.submit(test);
    function test(e) {
        e.preventDefault();
        console.log(e);
        console.log(e.target[0].value);
    }

    function calc() {

        var lat1 = 10;
        var long1 = 10;

        var brng = 210;
        var d = 100;
        var R = 6371;

        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) +
                    Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng));

        var long2 = long1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
                                 Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2));

        console.log(lat2 + " : " + long2);
    }

}());