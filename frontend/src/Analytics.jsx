import React, { useEffect, useRef, useState } from "react";
import './Analytics.css'
import Chart from "chart.js/auto";
import axios from "axios";
import { CloudRain, Loader, RefreshCw } from "lucide-react";

const fahrenheitToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;
const weatherImages = ["sunny", "cloudy", "rainy", "partly-cloudy"];

export default function Analytics({ darkMode }) {
  // Chart references
  const cropDistributionRef = useRef(null);
  const soilMetricsRef = useRef(null);
  const climateDataRef = useRef(null);
  const performanceRef = useRef(null);

  // Weather state
  const [weatherData, setWeatherData] = useState([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [userCity, setUserCity] = useState("");

  // Add state for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default farmer data
  const [farmerData, setFarmerData] = useState({
    name: "Rajesh Patel",
    avatar: "/api/placeholder/150/150",
    year: 2025,
    country: "India",
    region: "Gujarat",
    landSize: 12.5,
    soilType: "Black Cotton Soil",
    pastYield: 1850,
    cropTypes: ["Wheat", "Cotton", "Chickpeas"],
    annualIncome: 580000,
    soilPH: 6.8,
    nitrogenLevel: "Medium (320 kg/ha)",
    organicMatterLevel: "High (3.2%)",
    landQualityScore: 8.4,
    pastRainfall: 850,
    avgTemperature: 28.5,
    creditScore: 75, // Initial value set within 0-100 range
  });

  // State for loading credit score
  const [isLoadingCreditScore, setIsLoadingCreditScore] = useState(false);

  // Function to fetch credit score from backend
  const handleGetCreditScore = async () => {
    setIsLoadingCreditScore(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const response = await axios.get("http://localhost:8080/user/getCreditScore", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newCreditScore = response.data; // Assuming response.data is a number between 0-100
      setFarmerData((prevData) => ({
        ...prevData,
        creditScore: newCreditScore,
      }));
    } catch (error) {
      console.error("Error fetching credit score:", error);
      alert("Failed to fetch credit score. Please try again.");
    } finally {
      setIsLoadingCreditScore(false);
    }
  };
  useEffect(() => {
    handleGetCreditScore();
  }, []);
  // Get cached weather data
  const getCachedWeatherData = () => {
    const cachedData = localStorage.getItem("weatherData");
    const cacheTimestamp = localStorage.getItem("weatherCacheTime");
    const cachedCity = localStorage.getItem("weatherCity");

    if (cachedData && cacheTimestamp && cachedCity) {
      const currentDate = new Date().toDateString();
      const cachedDate = new Date(parseInt(cacheTimestamp)).toDateString();

      if (currentDate === cachedDate && cachedCity === userCity) {
        return JSON.parse(cachedData);
      }
    }

    return null;
  };

  // Get user's location
  useEffect(() => {
    const getUserLocation = async () => {
      if (farmerData && farmerData.region) {
        setUserCity(farmerData.region);
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const data = await response.json();
              if (data && data.city) {
                setUserCity(data.city);
              } else {
                setUserCity("Ahmedabad");
              }
            } catch (error) {
              console.error("Error getting city name:", error);
              setUserCity("Ahmedabad");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setUserCity("Ahmedabad");
          }
        );
      } else {
        setUserCity("Ahmedabad");
      }
    };

    getUserLocation();
  }, [farmerData]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          return;
        }
        const response = await axios.get("http://localhost:8080/user/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        if (userData) {
          setFarmerData((prevData) => ({
            ...prevData,
            name: userData.name || prevData.name,
            country: userData.country || prevData.country,
            region: userData.region || prevData.region,
            landSize: userData.landSize || prevData.landSize,
            soilType: userData.soilType || prevData.soilType,
            pastYield: userData.pastYield || prevData.pastYield,
            cropTypes: userData.cropTypes
              ? userData.cropTypes.split(",").map((crop) => crop.trim())
              : prevData.cropTypes,
            annualIncome: userData.annualIncome || prevData.annualIncome,
            year: userData.year || prevData.year,
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load farmer data. Using default data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch weather data when userCity changes
  useEffect(() => {
    if (!userCity) return;

    const fetchWeatherData = async () => {
      setIsLoadingWeather(true);
      setWeatherError(null);

      const cachedData = getCachedWeatherData();
      if (cachedData) {
        setWeatherData(cachedData);
        setIsLoadingWeather(false);
        return;
      }

      try {
        const dates = getNext7Dates();
        const weatherResults = [];

        for (const date of dates) {
          const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userCity}/${date}?unitGroup=us&key=BTHN2PFR4DBHZBZSJGQ4GVKWN&contentType=json`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          const tempC = data.days && data.days[0] ? fahrenheitToCelsius(data.days[0].temp).toFixed(1) : null;
          const condition = data.days && data.days[0] ? data.days[0].conditions : "Unknown";
          weatherResults.push({ date, tempC, condition });
        }

        setWeatherData(weatherResults);
        localStorage.setItem("weatherData", JSON.stringify(weatherResults));
        localStorage.setItem("weatherCacheTime", Date.now().toString());
        localStorage.setItem("weatherCity", userCity);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherError("Failed to load weather forecast. Please try again later.");
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeatherData();
  }, [userCity]);

  const getNext7Dates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      dates.push(futureDate.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Chart data
  const cropDistribution = [45, 35, 20];
  const regionalAvg = { yield: 1500, income: 450000, landQuality: 7.2 };

  // Initialize charts
  useEffect(() => {
    if (loading) return;

    const textColor = darkMode ? "#ffffff" : "#333333";
    const gridColor = darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;

    const cropChart = new Chart(cropDistributionRef.current, {
      type: "doughnut",
      data: {
        labels: farmerData.cropTypes,
        datasets: [{ data: cropDistribution, backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"], borderWidth: 1 }],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" }, title: { display: true, text: "Crop Distribution" } } },
    });

    const soilChart = new Chart(soilMetricsRef.current, {
      type: "radar",
      data: {
        labels: ["Soil pH", "Nitrogen Level", "Organic Matter", "Land Quality"],
        datasets: [
          { label: "Current Farm", data: [farmerData.soilPH, 6.4, 8.0, farmerData.landQualityScore], backgroundColor: "rgba(75, 192, 192, 0.2)", borderColor: "rgba(75, 192, 192, 1)", pointBackgroundColor: "rgba(75, 192, 192, 1)" },
          { label: "Optimal Range", data: [7, 7, 7.5, 9], backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)", pointBackgroundColor: "rgba(255, 99, 132, 1)" },
        ],
      },
      options: { scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } } }, plugins: { title: { display: true, text: "Soil Quality Metrics" } } },
    });

    const climateChart = new Chart(climateDataRef.current, {
      type: "bar",
      data: {
        labels: ["Rainfall (mm)", "Avg Temperature (°C)"],
        datasets: [{ label: farmerData.year.toString(), data: [farmerData.pastRainfall, farmerData.avgTemperature], backgroundColor: ["rgba(54, 162, 235, 0.5)", "rgba(255, 159, 64, 0.5)"], borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 159, 64, 1)"], borderWidth: 1 }],
      },
      options: { scales: { y: { beginAtZero: true } }, plugins: { title: { display: true, text: "Climate Data" } } },
    });

    const performanceChart = new Chart(performanceRef.current, {
      type: "bar",
      data: {
        labels: ["Yield (kg/ha)", "Annual Income (₹/10000)", "Land Quality Score"],
        datasets: [
          { label: "Your Farm", data: [farmerData.pastYield, farmerData.annualIncome / 10000, farmerData.landQualityScore], backgroundColor: "rgba(75, 192, 192, 0.5)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 },
          { label: "Regional Average", data: [regionalAvg.yield, regionalAvg.income / 10000, regionalAvg.landQuality], backgroundColor: "rgba(153, 102, 255, 0.5)", borderColor: "rgba(153, 102, 255, 1)", borderWidth: 1 },
        ],
      },
      options: { scales: { y: { beginAtZero: true } }, plugins: { title: { display: true, text: "Performance Comparison" } } },
    });

    return () => {
      cropChart.destroy();
      soilChart.destroy();
      climateChart.destroy();
      performanceChart.destroy();
    };
  }, [darkMode, farmerData, loading]);

  // Get weather icon
  const getWeatherIcon = (condition) => {
    if (!condition) return "partly-cloudy";
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("rain") || conditionLower.includes("shower")) return "rainy";
    if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) return "cloudy";
    if (conditionLower.includes("clear") || conditionLower.includes("sunny")) return "sunny";
    return "partly-cloudy";
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen w-300 ml-10 mt-16 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
        {/* Farmer Profile Header */}
        <div className={`px-4 py-6 mb-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <img src={`/farmer.jpg`} alt={farmerData.name} className="rounded-full h-24 w-24 object-cover border-2 border-gray-300" />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold">{farmerData.name}</h2>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-1`}>
                  {farmerData.region}, {farmerData.country} • {farmerData.landSize} hectares
                </p>
                <p>Soil Type: {farmerData.soilType}</p>
              </div>
              
              <div className="w-full md:w-72">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Credit Score</span>
                  <div>
                    {isLoadingCreditScore ? (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800'}`}>
                        <div className="credit-score-loader">
                          <svg viewBox="0 0 80 20" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="6" fill={darkMode ? '#4ade80' : '#22c55e'} opacity="0.4">
                              <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="40" cy="10" r="6" fill={darkMode ? '#4ade80' : '#22c55e'} opacity="0.4">
                              <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" begin="0.2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="70" cy="10" r="6" fill={darkMode ? '#4ade80' : '#22c55e'} opacity="0.4">
                              <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" begin="0.4s" repeatCount="indefinite" />
                            </circle>
                          </svg>
                        </div>
                        <span className="ml-1">Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${
                          farmerData.creditScore > 70 ? (darkMode ? 'text-green-400' : 'text-green-600') : 
                          farmerData.creditScore > 60 ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') : 
                          (darkMode ? 'text-red-400' : 'text-red-600')
                        }`}>
                          {farmerData.creditScore}/100
                        </span>
                        <button
                          onClick={handleGetCreditScore}
                          disabled={isLoadingCreditScore}
                          className={`p-1.5 rounded-full transition-all ${
                            darkMode 
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          } ${isLoadingCreditScore ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
                        >
                          <RefreshCw size={14} className={isLoadingCreditScore ? "animate-spin" : ""} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full rounded-full h-3 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {isLoadingCreditScore ? (
                    <div className="h-full bg-gradient-to-r from-green-500 via-green-300 to-green-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  ) : (
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        farmerData.creditScore > 70
                          ? "bg-gradient-to-r from-green-600 to-green-400"
                          : farmerData.creditScore > 60
                          ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                          : "bg-gradient-to-r from-red-600 to-red-400"
                      }`}
                      style={{ width: `${farmerData.creditScore}%` }}
                    ></div>
                  )}
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className={darkMode ? "text-red-400" : "text-red-600"}>Poor</span>
                  <span className={darkMode ? "text-yellow-400" : "text-yellow-600"}>Fair</span>
                  <span className={darkMode ? "text-green-400" : "text-green-600"}>Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Annual Income</h3>
              <p className="text-2xl font-bold mt-1">₹{farmerData.annualIncome.toLocaleString()}</p>
              <p className="text-green-500 text-sm mt-2">+15% from last year</p>
            </div>
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Land Quality</h3>
              <p className="text-2xl font-bold mt-1">{farmerData.landQualityScore}/10</p>
              <p className="text-blue-500 text-sm mt-2">Above regional average</p>
            </div>
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Past Yield</h3>
              <p className="text-2xl font-bold mt-1">{farmerData.pastYield} kg/ha</p>
              <p className="text-green-500 text-sm mt-2">+23% from expected</p>
            </div>
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Soil pH</h3>
              <p className="text-2xl font-bold mt-1">{farmerData.soilPH}</p>
              <p className="text-yellow-500 text-sm mt-2">Slightly acidic (ideal: 7.0)</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <canvas ref={cropDistributionRef}></canvas>
            </div>
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <canvas ref={soilMetricsRef}></canvas>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <canvas ref={climateDataRef}></canvas>
            </div>
            <div className={`rounded-lg shadow-md p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <canvas ref={performanceRef}></canvas>
            </div>
          </div>

          {/* Farm Recommendations */}
          <div className={`rounded-lg shadow-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className="text-lg font-medium">Recommendations</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Soil Improvement</h4>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Add lime to increase soil pH by 0.2 points for optimal crop growth.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Crop Rotation</h4>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Consider adding pulses next season to naturally improve nitrogen levels.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Water Management</h4>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Install drip irrigation to improve water efficiency by up to 30%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Forecast */}
          <div className={`rounded-lg shadow-md mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"} flex justify-between items-center`}>
              <h3 className="text-lg font-medium">7-Day Weather Forecast for {userCity}</h3>
              {isLoadingWeather && (
                <div className="flex items-center text-sm">
                  <Loader className="w-4 h-4 mr-1 animate-spin" />
                  <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Loading forecast...</span>
                </div>
              )}
            </div>
            <div className="p-4">
              {isLoadingWeather ? (
                <div className="flex justify-center items-center h-32">
                  <div className="flex flex-col items-center">
                    <CloudRain className={`w-10 h-10 ${darkMode ? "text-blue-400" : "text-blue-500"} animate-bounce`} />
                    <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Fetching weather data...</p>
                  </div>
                </div>
              ) : weatherError ? (
                <div className="text-center p-4 text-red-500">
                  <p>{weatherError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {weatherData.map((item, i) => (
                    <div key={i} className={`flex flex-col items-center p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}>
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(item.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <img src={`/${getWeatherIcon(item.condition)}.png`} alt={item.condition || "Weather"} className="w-10 h-10 my-2 object-contain" />
                      <span className="font-medium">{item.tempC}°C</span>
                      <span className={`text-xs mt-1 text-center ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                        {item.condition?.split(",")[0] || "Unknown"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}