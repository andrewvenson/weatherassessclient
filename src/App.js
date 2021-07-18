import {useState, useEffect} from "react";
import axios from "axios";
import Globe from "./images/globe.png";
import './App.css';

function App() {
  // states
  const [defaultweather, setDefaultWeather] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geo, setGeo] = useState({
      type: "coords",
      city: "",
      zip: "",
      lat: "",
      lon: ""
  });

 const initialState = {
      type: "coords",
      city: "",
      zip: "",
      lat: "",
      lon: ""
  }

  // handle client front end error
  const handleSetError = () => {
        setGeo(initialState);
        setError(true);
        setTimeout(() => setError(false), 5000);
  }

  // on mount
  useEffect(() => {
    setLoading(true);
    axios.get("https://weathernums.herokuapp.com/").then(response => {
        if(response.data === "error"){
            handleSetError();
        }else{
            setDefaultWeather(response.data);
        }
        setLoading(false);
    }).catch(err => {
        handleSetError();
        setLoading(false);
    });
  }, []);

  // Funcs
  const setQueryParam = () => {
      return geo.type === "coords" ? `${geo.lat},${geo.lon}` : geo.type === "city" ? geo.city : geo.zip
  }

  const getWeatherData = () => {
    setLoading(true);
    axios.get(`https://weathernums.herokuapp.com/location?type=${geo.type}&val=${setQueryParam()}`).then(response => {
        if(response.data === "error"){
            handleSetError();
        }else{
            setDefaultWeather(response.data);
        }
        setLoading(false);
    }).catch(err => {
        handleSetError();
        setLoading(false);
    });
  }

  // handle input changes
  const handleGeoChange = (e, type) => {
      (geo.type === "coords" && type === "lat") && setGeo({...geo, lat: e.target.value});
      (geo.type === "coords" && type === "lon") && setGeo({...geo, lon: e.target.value});
      geo.type === "zip" && setGeo({...geo, zip: e.target.value});
      geo.type === "city" && setGeo({...geo, city: e.target.value});
  }

  const handleGeoTypeChange = (e) => {
      setGeo({...geo, type: e.target.value, zip: "", city: "", lat: "", lon: ""});
  }

  // Styles
  const inputStyle = {
      border: "1px solid lightgray",
      borderRadius: "3px",
      margin: "3px", 
      padding: "5px"
  };
  const containerStyle = {
      padding: "20px", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center",
  };
  const buttonStyle = {
      backgroundColor: "black", 
      color: "white", 
      padding: "10px", 
      borderRadius: "3px", 
      border: "none", 
      margin: "3px", 
      cursor: "pointer"
  }
  const weatherContainer = {
      border: "1px solid gray", padding: "10px", borderRadius: "5px", boxShadow: "3px 4px 15px lightgray", backgroundColor: "white", width: "500px"
  };
  const locationStyle = {
      color: "darkgray", marginTop: "0px", textShadow: "2px 3px 4px lightgray"
  };
  const centerLocationInfo = {display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"};
  const weatherNumStyle = {
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
  };
  const divider = {
      width: "90%", borderBottom: "1px solid lightgray", margin: "10px"
  };

  return (
    <div style={containerStyle}>
      <div>
          <select value={geo.type} onChange={(e) => handleGeoTypeChange(e)}>
            <option value="coords">Coordinates</option>
            <option value="city">City</option>
            <option value="zip">Zip</option>
          </select>
          {
              geo.type === "coords" ? 
              <>
                <input style={inputStyle} type="text" placeholder="lat" value={geo.lat} onChange={(e) => handleGeoChange(e, "lat")}/>
                <input style={inputStyle} type="text" placeholder="lon" value={geo.lon} onChange={(e) => handleGeoChange(e, "lon")}/>
              </> :
              geo.type === "city" ? <input style={inputStyle} type="text" placeholder="city" value={geo.city} onChange={(e) => handleGeoChange(e)}/> :
              <input style={inputStyle} type="text" placeholder="zip,cc (e.g. 78660,us)" value={geo.zip} onChange={(e) => handleGeoChange(e)}/>
          }
          <button style={buttonStyle} onClick={() => getWeatherData()}>Submit</button>
      </div>
      <div style={weatherContainer}>
          <div style={centerLocationInfo}>
              <h4 style={{margin: "0px", color: "green"}}>Next 3 day Temps °F</h4>
              <br/>
              {
                  loading ? <p style={{color: "green"}}>...</p> :
                  <>
                      {/* 0,0 coordinates show globe, zip=globe shows globe image, city=globe shows globe */}
                      {defaultweather.city === "Globe" ? <img width="100px" height="100px" src={Globe} /> :
                          <>
                              {/*Coords*/}
                              <span style={locationStyle}>{!Object.keys(defaultweather).includes("coord") ? `30.2240897, -92.01984270000003` : defaultweather.coord} </span>
                              {/*City*/}
                              <span style={locationStyle}>{!Object.keys(defaultweather).includes("city") ? `Lafayette` : defaultweather.city} </span>
                              {/*Country*/}
                              <span style={locationStyle}>{!Object.keys(defaultweather).includes("country") ? `US` : defaultweather.country} </span>
                          </>
                      }
                  </>
              }
          </div>
          <br/>
          {
              Object.keys(defaultweather).length > 0 && 
              <div style={weatherNumStyle}>
                  <em>Mean ~ </em>
                  <strong>{defaultweather.mean}°</strong>
                  <div style={divider}></div>
                  <em>Median ~ </em>
                  <strong>{defaultweather.median}°</strong>
                  <div style={divider}></div>
                  <em>Mode ~ </em>
                  <strong>{defaultweather.mode === "no mode" ? defaultweather.mode : `${defaultweather.mode}°`}</strong>
              </div>
          }
      </div>
      {
        error && <p style={{color: "red"}}>Could not find data</p>
      }
    </div>
  );
}

export default App;
