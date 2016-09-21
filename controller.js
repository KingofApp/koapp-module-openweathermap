/* We created this module inspired from these libraries and examples:
	- Current Local Weather by Angeline. See http://codepen.io/atamyo/pen/jAmQZK
	- Local Weather App by Rachel Christian. See https://codepen.io/r_christian/pen/NNKLNz
	- Angular Openweathermap Api Factory by Jonathan Hornung(@JohnnyTheTank). See https://github.com/JohnnyTheTank/angular-openweathermap-api-factory
	- Weather Icons by Erik Flowers. See https://erikflowers.github.io/weather-icons/
*/

(function() {
	'use strict';

	angular
		.module('openweathermap', ['jtt_openweathermap'])
		.controller('openweathermapController', loadFunction);

	loadFunction.$inject = ['$scope', 'structureService', '$location', 'openweathermapFactory'];

	function loadFunction($scope, structureService, $location, openweathermapFactory) {
		//Register upper level modules
		structureService.registerModule($location, $scope, 'openweathermap');

		var vm = this;
		var config = $scope.openweathermap.modulescope;
		var units = config.units || "metric"; // http://openweathermap.org/current#data
		var lang = (structureService.getLang() === "es_ES" ? "es" : "en"); // http://openweathermap.org/current#multi // http://openweathermap.org/current#multi
		var appid = config.appid;
		var lat = config.lat || "40.4262687";
		var lon = config.lon || "-3.6662797";
		var bgColor = '#333';
		var containerElement = angular.element(document.querySelector('#mainContainer'));

		vm.weatherInfo = weatherInfo;

		openweathermapFactory.getWeatherFromLocationByCoordinates({
			lat: lat,
			lon: lon,
			appid: appid,
			units: units,
			lang: lang
		}).then(function(data) {
			if (data.status === 200 && data.data.cod === 200) {
				weatherInfo(data.data);
			} else {
				vm.dataError = true;
				vm.error = {
					code: data.data.cod,
					message: data.data.message
				};
			}
		});

		function weatherInfo(data) {
			vm.lang = lang;
			vm.sunrise = data.sys.sunrise;
			vm.sunset = data.sys.sunset;
			vm.city = data.name;
			vm.current = data.dt;
			vm.country = data.sys.country;
			vm.desc = capitalizeFirstLetter(data.weather[0].description);
			vm.humid = data.main.humidity;
			vm.icon = data.weather[0].icon;
			vm.temp = data.main.temp;
			vm.temp += units === "metric" ?  "ºC" : "ºF";
			vm.windSpeed = (data.wind.speed).toFixed(1);
			vm.windIcon = getIcon(vm.icon);
			vm.windDirect = Math.floor(data.wind.deg);
			bgColor = getSkyColor(vm.current, vm.sunrise, vm.sunset);

			containerElement.css('background-color', bgColor);

			function capitalizeFirstLetter(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			}

			function getIcon(id) {
				var wi = "na";

				switch (id) {
					case "01d":
						wi = "wi-day-sunny";
						break;
					case "02d":
						wi = "wi-day-cloudy";
						break;
					case "03d":
					case "03n":
						wi = "wi-cloud";
						break;
					case "04d":
					case "04n":
						wi = "wi-cloudy";
						break;
					case "09d":
					case "09n":
						wi = "wi-showers";
						break;
					case "10d":
						wi = "wi-day-rain";
						break;
					case "10n":
						wi = "wi-night-alt-rain";
						break;
					case "11d":
						wi = "wi-day-lightning";
						break;
					case "11n":
						wi = "wi-night-alt-lightning";
						break;
					case "13d":
						wi = "wi-day-snow";
						break;
					case "13n":
						wi = "wi-night-alt-snow";
						break;
					case "50d":
					case "50n":
						wi = "wi-fog";
						break;
				}
				return wi;
			}

			function getSkyColor(currTime, sunriseTime, sunsetTime) {
				var hour = 3600; // number of seconds in hour for UTC format
				var morningTime = sunriseTime + (2 * hour);
				var nightTime = sunsetTime + (2 * hour);
				var color = bgColor;
				// Dawn or Dusk
				if ((currTime < sunriseTime) || (currTime >= nightTime)) {
					color = "#003366";
				}
				// Sunrise I
				else if ((currTime >= sunriseTime) && (currTime < (sunriseTime + hour))) {
					color = "#DA70D6";
				}
				// Sunrise II
				else if ((currTime >= (sunriseTime + hour)) && (currTime < morningTime)) {
					color = "#ff8c00";
				}
				// Daytime
				else if ((currTime >= morningTime) && (currTime < sunsetTime)) {
					color = "#40e0d0";
				}
				// Sunset I
				else if ((currTime >= (sunsetTime)) && (currTime < (sunsetTime + hour))) {
					color = "#ff8c00";
				}
				// Sunset II
				else if ((currTime >= (sunsetTime + hour)) && (currTime < nightTime)) {
					color = "#DA70D6";
				}
				return color;
			}
		}
	}
}());
