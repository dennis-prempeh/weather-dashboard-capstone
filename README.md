# ☁️ A React Weather Dashboard

A responsive single-page application built to display real-time weather data fetched from the OpenWeatherMap API. This project fulfills the requirements for the Capstone assignment.

## 🎯 Project Goals & Key Features

This dashboard was developed focusing on user experience, stability, and meeting the core project requirements, including a few stretch goals:

* **Real-Time Weather Data:** Fetches and displays current conditions, temperature, humidity, and wind speed.
* **Persistent Theme Toggle:** Implemented a Light/Dark mode switch. The user's theme preference is saved and restored using **Local Storage** (Stretch Goal 3).
* **Automatic Location Detection:** On initial load, the app attempts to use the browser's Geolocation API to find the user's current weather (Stretch Goal 4). Falls back to a default city if permission is denied.
* **Data Auto-Refresh:** The weather data is automatically updated every **5 minutes** (300,000ms) using `setInterval` to ensure data freshness (Functional Requirement 4).
* **Modern UI/UX:** Styled using Tailwind CSS with a focus on high contrast, a cohesive Teal-based color palette, and full responsiveness.
* **Robust Error Handling:** Clear messages are displayed to the user for invalid city names (404) or network failures.

## 🛠 Tech Stack

* **Frontend:** React with Vite
* **Styling:** Tailwind CSS (configured for class-based dark mode)
* **API Client:** `axios`
* **Weather Service:** OpenWeatherMap API

## 📝 Running Locally (Setup)

Follow these steps to set up the project environment on your local machine.

### Prerequisites

* Node.js (LTS recommended)
* npm (or yarn)

### Step 1: Clone the Project and Install Dependencies

```bash
git clone [YOUR_REPOSITORY_URL_HERE]
cd react-weather-dashboard
npm install
```
### Step 2: Acquire an API Key
You need a personal API key to fetch weather data:

Register an account at [OpenWeatherMap].

Locate your API key on their dashboard.

### Step 3: Configure Environment Variables
Create a file named .env in the root directory of the project and add your key using the VITE_ prefix required by Vite:

Code snippet

VITE_WEATHER_API_KEY="YOUR_API_KEY_GOES_HERE"
VITE_BASE_URL="[https://api.openweathermap.org/data/2.5/](https://api.openweathermap.org/data/2.5/)"

### Step 4: Start the Development Server
```Bash            
npm run dev
```
The application should now be accessible at http://localhost:5173. You will be prompted by your browser to share your location.

#📂 Project Organization Highlights
src/App.jsx: Contains the main state management and all core logic for theme switching, fetching (by coordinates or city name), and managing the auto-refresh interval.

src/services/weatherService.js: A dedicated service file to abstract the API interaction, keeping components clean. It handles error codes and data structuring.

tailwind.config.js: Key configuration file where darkMode: 'class' is set to enable manual theme switching, overriding system preferences.

#🚀 Final Deployment
The project is built using Vite and the resulting files in the dist/ folder were deployed to Vercel/Netlify. Crucially, the VITE_WEATHER_API_KEY was added as an Environment Variable within the hosting platform's settings.