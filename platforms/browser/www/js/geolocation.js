let map, centered = false, myName;

const serverIP = '10.199.1.77:1337'
myName = 'Mike Persson';

const userMarker = []
const userInfo = []

$(function () {
  function initMap() {
    // map = new google.maps.Map(document.getElementById('map'), {
    //   center: { lat: -34.397, lng: 150.644 },
    //   zoom: 13
    // });

    centered = false;

    getUserLocation();
    setInterval(function () {
      getUserLocation();
    }, 3000);
  }

  google.maps.event.addDomListener(window, 'load', initMap);
})


function geoSuccessCb(position) {
  let point = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );

  if (!map) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: point,
      zoom: 13
    });
  }

  centered = true;

  var locations = []
  var res;
  $.get('http://' + serverIP + '/store/name/' + myName + '/lat/' + point.lat() + '/lon/' + point.lng(), (res) => {
    console.log("Result = ", res);
  })

  $.get('http://' + serverIP + '/locations', (locations) => {
    console.log(locations);
    locations = JSON.parse(locations);
    console.log("JSON: ", locations);
    markerHandler(locations)
  })
}

function markerHandler(locations) {
  locations.forEach(location => {

    let point = new google.maps.LatLng(
      location.pos.lat,
      location.pos.lon
    );

    let idx = -1;
    for (var i = 0; i < userInfo.length; i++) {
      if (location.name == userInfo[i].content) {
        idx = i;
        break;
      }
    }

    if (idx != -1) {
      userMarker[idx].setPosition(point);
      userInfo[idx].setPosition(point);
    } else {
      let marker = new google.maps.Marker({
        position: point,
        map: map
      })

      let info = new google.maps.InfoWindow({
        content: location.name,
        position: point
      })

      marker.addListener('click', function () {
        info.open(map, marker);
      })

      userMarker.push(marker);
      userInfo.push(info);
    }


    if (location.name == myName && !centered) {
      map.setCenter(point);
      centered = true;
    }
  })
}

function geoErrorCb(error) {
  alert('NEJ');
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccessCb, geoErrorCb);
  }
}