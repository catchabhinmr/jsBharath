weather_code_reference = {
	"0": "Clear sky",
	"1": "Mainly clear",
	"2": "Partly cloudy",
	"3": "Overcast",
	"45": "Fog",
	"48": "Depositing rime fog",
	"51": "Light drizzle",
	"53": "Moderate drizzle",
	"55": "Dense drizzle",
	"56": "Light freezing drizzle",
	"57": "Dense freezing drizzle",
	"61": "Slight rain",
	"63": "Moderate rain",
	"65": "Heavy rain",
	"66": "Light freezing rain",
	"67": "Heavy freezing rain",
	"71": "Slight snowfall",
	"73": "Moderate snowfall",
	"75": "Heavy snowfall",
	"77": "Snow grains",
	"80": "Slight rain showers",
	"81": "Moderate rain showers",
	"82": "Violent rain showers",
	"85": "Slight snow showers",
	"86": "Heavy snow showers",
	"95": "Thunderstorm",
	"96": "Thunderstorm with slight hail",
	"97": "Heavy thunderstorm",
	"99": "Thunderstorm with heavy hail"
}
async function getWeather(params) {
    const args = process.argv.slice(2);
    if(!args[0]){
        console.log(`Usage: node weather.js "<city>"`);
    }
    else{
        const city = args[0];
        const encoded = encodeURI(city);
        const geoLocationInfoUri = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}`;
        var geoLocationInfo;
        try{
            geoLocationInfo = await fetch(geoLocationInfoUri);
        }catch(err){
            console.log("Couldn't reach the weather service. Check your connection.");
            process.exit(1);
        }
        if(!geoLocationInfo["results"]){
            console.log(`City not found: ${city}`);
            process.exit(1);
        }
        const geoCodeJson = await geoLocationInfo.json();
        console.log(geoCodeJson);
        const latitude = geoCodeJson["results"][0]["latitude"];
        const longitude = geoCodeJson["results"][0]["longitude"];
        // console.log(`latitude: ${latitude} longitude: ${longitude}`);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`;
        const weatherInfoRes = await fetch(url);
        if(!weatherInfoRes.ok){
            throw new Error(`HTTP ${weatherInfoRes.status}`);
        }
        const weatherInfoJSON = await weatherInfoRes.json();
        // console.log(weatherInfoJSON);
        const temperature = weatherInfoJSON["current"]["temperature_2m"];
        const windSpeed = weatherInfoJSON["current"]["wind_speed_10m"];
        const conidtions = weather_code_reference[weatherInfoJSON["current"]["weather_code"]];
        console.log(`${geoCodeJson["results"][0]["name"]}, ${geoCodeJson["results"][0]["country"]}`);
        console.log(`Temperature: ${temperature} degree Celsius`);
        console.log(`Wind:${windSpeed} km/hr`);
        console.log(`Conditions: ${conidtions}`);
        
    }
}
getWeather();