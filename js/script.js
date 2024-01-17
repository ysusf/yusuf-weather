async function getCurrentWeather(location) {
  const fetchData = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=1f6f03a427f44898ae362916233107&q=${location}`
  );
  const jsonData = await fetchData.json();
  return jsonData;
}
async function get3days(location) {
  const fetchData = await fetch(`https://api.weatherapi.com/v1/forecast.json?
key=1f6f03a427f44898ae362916233107&q=${location}&days=3`);
  const jsonData = await fetchData.json();
  return jsonData;
}
async function searchCity(location) {
  const fetchData = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=1f6f03a427f44898ae362916233107&q=${location}`
  );
  const jsonData = await fetchData.json();
  return jsonData;
}

function convertDateToObject(dateString) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(dateString);
  const dayOfWeek = dayNames[date.getDay()];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const formattedDate = {
    day: dayOfWeek,
    date: day + " " + month,
  };
  return formattedDate;
}

let city = "egypt";
getAll("cairo");
let searchInput = document.querySelector("input");
searchInput.addEventListener("keyup", async function (e) {
  e.stopPropagation();
  let searchTerm = e.target.value;
  let data_searchCity = await searchCity(searchTerm);
  if (data_searchCity.length > 0) {
    city = data_searchCity[0].name;
    getAll(city);
  } else if (navigator.geolocation) {
    let liveMap = navigator.geolocation.watchPosition(function (position) {
      // console.log(position);
      getAll(`${position.coords.latitude},${position.coords.latitude}`);
    });
  } else {
    getAll("cairo");
  }
});

if (navigator.geolocation) {
  let liveMap = navigator.geolocation.watchPosition(function (position) {
    // console.log(position);
    getAll(`${position.coords.latitude},${position.coords.latitude}`);
  });
} else {
  getAll("cairo");
}

async function getAll(searchedCity) {
  const data_GetCurrentWeather = await getCurrentWeather(searchedCity);
  // console.log("GetCurrentWeather", data_GetCurrentWeather);
  const today = convertDateToObject(
    data_GetCurrentWeather.current.last_updated
  );

  document.getElementById("currentWeather").innerHTML = `
    <div class="layer bg-gray text-light rounded-3">
      <div
        class="date d-flex justify-content-between bg-dark p-3 text-gray"
      >
        <span>${today.day}</span>
        <span>${today.date}</span>
      </div>
      <span class="d-block p-3">${data_GetCurrentWeather.location.name}</span>
      <div
        class="Temperature d-flex align-items-center justify-content-around p-3"
      >
        <span class="display-1 fw-semibold">${data_GetCurrentWeather.current.feelslike_c}<sup>o</sup>C</span>
        <img src="${data_GetCurrentWeather.current.condition.icon}" alt="" />
      </div>
      <span class="text-primary d-block p-3">${data_GetCurrentWeather.current.condition.text}</span>
      <div
        class="weather-bar d-flex align-items-center gap-4 p-3 text-gray"
      >
        <div class="UV">
          <img src="./images/icon-umberella.png" alt="" />
          <span>${data_GetCurrentWeather.current.uv}%</span>
        </div>

        <div class="wind">
          <img src="./images/icon-wind.png" alt="" />
          <span>${data_GetCurrentWeather.current.wind_kph}km/h</span>
        </div>
        <div class="compass">
          <img src="./images/icon-compass.png" alt="" />
          <span>${data_GetCurrentWeather.current.wind_dir}</span>
        </div>
      </div>
    </div>
`;

  const data_get3days = await get3days(searchedCity);
  // console.log("get3days", data_get3days);
  const tomorrow = convertDateToObject(
    data_get3days.forecast.forecastday[1].date
  );
  const afterTomorrow = convertDateToObject(
    data_get3days.forecast.forecastday[2].date
  );

  document.getElementById("tomorrowWeather").innerHTML = `
      <div class="layer bg-gray text-light rounded-3">
    <div class="date text-center bg-dark p-3 text-gray">
      <span>${tomorrow.day}</span>
    </div>
    <div class="Temperature p-3 text-center">
      <img src="${data_get3days.forecast.forecastday[1].day.condition.icon}" alt="" />
      <span class="display-5 fw-semibold d-block p-3"
        >${data_get3days.forecast.forecastday[1].day.maxtemp_c}<sup>o</sup>C</span
      >
      <span class="p-3 text-gray">${data_get3days.forecast.forecastday[1].day.mintemp_c}<sup>o</sup>C</span>
      <span class="text-primary d-block p-3">${data_get3days.forecast.forecastday[1].day.condition.text}</span>
    </div>
  </div>
    `;

  document.getElementById("afterTomorrowWeather").innerHTML = `
  <div class="layer bg-gray text-light rounded-3">
    <div class="date text-center bg-dark p-3 text-gray">
      <span>${afterTomorrow.day}</span>
    </div>
    <div class="Temperature p-3 text-center">
      <img src="${data_get3days.forecast.forecastday[2].day.condition.icon}" alt="" />
      <span class="display-5 fw-semibold d-block p-3"
        >${data_get3days.forecast.forecastday[2].day.maxtemp_c}<sup>o</sup>C</span
      >
      <span class="p-3 text-gray">${data_get3days.forecast.forecastday[2].day.mintemp_c}<sup>o</sup>C</span>
      <span class="text-primary d-block p-3">${data_get3days.forecast.forecastday[2].day.condition.text}</span>
    </div>
  </div>
`;
}
