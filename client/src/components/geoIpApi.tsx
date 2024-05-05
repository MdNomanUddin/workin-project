// geoIpApi.ts
export const fetchIpGeolocation = async (): Promise<{ latitude: number; longitude: number }> => {
    try {
      const apiKey = '74b46d60153f4601a05a2c7d046f0655'; // Replace with your actual Geoapify API key
      const url = `https://api.geoapify.com/v1/ipinfo?apiKey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.location) {
        const { latitude, longitude } = data.location;
        console.log("inside geoapi");
        return { latitude, longitude };
      } else {
        console.error('Failed to fetch geolocation from IP address.');
        return { latitude: 0.0, longitude: 0.0 }; // Or handle missing location differently
      }
    } catch (error) {
      console.error('Error fetching IP geolocation:', error);
      return { latitude: 0.0, longitude: 0.0 }; // Or handle error differently
    }
  };
  