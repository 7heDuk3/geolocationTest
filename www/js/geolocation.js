let map, centered = false, myName;

const serverIP = '10.199.2.151:1337'
myName = 'Mike Persson';

const userMarker = []
const userInfo = []

$(function () {
  function initMap() {
    // document.getElementById('enable-location').style.display = 'block';

    // map = new google.maps.Map(document.getElementById('map'), {
    //   center: { lat: -34.397, lng: 150.644 },
    //   zoom: 13
    // });

    // document.addEventListener("deviceready", function () {
    //   cordova.dialogGPS("Your GPS is Disabled, this app needs to be enable to      works.",//message
    //     "Use GPS, with wifi or 3G.",//description
    //     function (buttonIndex) {//callback
    //       switch (buttonIndex) {
    //         case 0: break;//cancel
    //         case 1: break;//neutro option
    //         case 2: break;//user go to configuration
    //       }
    //     },
    //     "Please Turn on GPS",//title
    //     ["Cancel", "Later", "Go"]);//buttons
    // });

    // cordova.diagnostic.isGpsLocationEnabled(function (enabled) {
    //   if (!enabled) {
    //     console.log("To see people nearby, please enable your device's location!")
    //   }
    // })

    // cordova.plugins.diagnostic.isGpsLocationEnabled(function (available) {
    //   document.getElementById('enable-location').style.display = 'block';

    //   if (available) {
    //     getUserLocation();
    //     setInterval(function () {
    //       getUserLocation();
    //     }, 3000);
    //   } else {
    //     document.getElementById('enable-location').style.display = 'block';


    //   }

    //   console.log("Location is " + (available ? "available" : "not available"));
    // }, function (error) {
    //   console.error("The following error occurred: " + error);
    // });

    centered = false;

    getUserLocation();
    setInterval(function () {
      getUserLocation();
    }, 3000);
  }

  google.maps.event.addDomListener(window, 'load', initMap);
})

// $('#location-settings').click(function () {
//   document.getElementById('enable-location').style.display = 'none';
//   cordova.plugins.diagnostic.switchToLocationSettings();
// })

// $('#decline').click(function () {
//   document.getElementById('enable-location').style.display = 'none';
// })

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
  // document.addEventListener(window, function () {
  //   cordova.dialogGPS("Your GPS is Disabled, this app needs to be enable to      works.",//message
  //     "Use GPS, with wifi or 3G.",//description
  //     function (buttonIndex) {//callback
  //       switch (buttonIndex) {
  //         case 0: break;//cancel
  //         case 1: break;//neutro option
  //         case 2: break;//user go to configuration
  //       }
  //     },
  //     "Please Turn on GPS",//title
  //     ["Cancel", "Later", "Go"]);//buttons
  // });
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccessCb, geoErrorCb);
  }
}