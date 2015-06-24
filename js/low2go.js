function getCar2go() {
    return $.ajax({
        url: "https://www.car2go.com/api/v2.1/vehicles",
        dataType: 'jsonp',
        data: {
            loc: "vancouver",
            oauth_consumer_key: "car2gowebsite",
            format: "json"
        }
    })
}

function addMarker(map, data) {
    var infowindow = new google.maps.InfoWindow({
        content: "<div>" + data.address + "<br/>" +
        data.name + "(" + data.fuel + "%)" + "</div>"
    });
    var marker = new google.maps.Marker({
        position: { lat: data.coordinates[1], lng: data.coordinates[0]},
        title: data.name
    });

    // use green marker to show low fuel cars
    if (data.fuel <= 35) {
        marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
    }

    marker.setMap(map);
    google.maps.event.addListener(marker, 'click', function() {
        if (previousWindow) {
            previousWindow.close();
        }
        infowindow.open(map,marker);
        previousWindow = infowindow;
    });
    console.log(data);

    return marker;
}


function updateMap(map, markers, lowFuel) {
    $.each(markers, function(i, marker) {
        marker.setMap(null);
    });

    getCar2go().done(function(data) {
        $.each(data.placemarks, function(i, d) {
            if ((lowFuel && d.fuel <= 35) || !lowFuel) {
                markers.push(addMarker(map, d));
            }
        });
    })
}