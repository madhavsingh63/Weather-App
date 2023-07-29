const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const searchForm = document.querySelector("[data-searchForm]");
const grantAccessContainer = document.querySelector(".grant-access-container");
const loadingScreen = document.querySelector(".loading-container");
const userWeatherInfo = document.querySelector(".weather-info-container");
const grantAccess = document.querySelector("[data-grantAccess]");

const searchInput = document.querySelector("[data-searchInput]");
const notFound = document.querySelector(".not-found");

// initially variables need?

let currentTab = userTab;
const API_KEY = "4b68cd63709ee8d024a9442004357b0f";
currentTab.classList.add("current-tab");
getfromSessionStorage();


// switchTab function

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userWeatherInfo.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // m pahle searchWeather wale tab pr tha, ab mene your weather tab pr click kya h
            searchForm.classList.remove("active");
            userWeatherInfo.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    // passed click tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    // passed click tab as input parameter
    switchTab(searchTab);
})

// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        let coordinates = JSON.parse(localCoordinates);
        fetchUserWeather(coordinates);
    }
}

async function fetchUserWeather(coordinates){


    let {lat, lon}   = coordinates;

    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        
        // API Call

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)

        const data = await response.json();
        loadingScreen.classList.remove("active");
        notFound.classList.remove("active");
        userWeatherInfo.classList.add("active");
        renderWeatherInfo(data);


    } 
    catch (error) {
        console.log(error)
    }
}

function renderWeatherInfo(weatherInfo){
    // fiirstly we have to fetch the element 

    const cityName = document.querySelector("[data-cityName]");

    const countryFlag = document.querySelector("[data-countryFlag]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");

    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");

    const cloudiness = document.querySelector("[data-clouds]");


    cityName.innerText = weatherInfo?.name;

    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp} °C `;

    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;

    humidity.innerText = `${weatherInfo?.main?.humidity}%`;

    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

    grantAccess.addEventListener('click', getLocation);



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Your Browser Does not suppport location");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeather(userCoordinates);
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "")
        return;

    else
        fetchSearchWeatherInfo(cityName);
        searchInput.value = "";
})


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userWeatherInfo.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        loadingScreen.classList.remove("active");
        userWeatherInfo.classList.add("active");
        if(data?.name == undefined){
            userWeatherInfo.classList.remove("active");
            notFound.classList.add("active");
        }
        renderWeatherInfo(data);
    } 
    catch (error) {
        alert("Sorry! Please try again later");
    }
}