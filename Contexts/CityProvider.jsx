import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
const BASE_URL = "http://localhost:9000";
const CityContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: "",
  isError: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loaded":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "city/loaded":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: [...state.cities.filter((city) => city.id !== action.payload)],
        isLoading: false,
      };
    case "error":
      return {
        ...state,
        isLoading: false,
        isError: action.payload,
      };
    default:
      throw new Error("unknown Action Type");
  }
}

function CityProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState("");

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    const fetchData = async function () {
      try {
        dispatch({ type: "loaded" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "error", payload: "There was error loading cities" });
      }
    };
    fetchData();
  }, []);

  const getCity = async function (id) {
    const res = await fetch(`${BASE_URL}/cities/${id}`);
    const data = await res.json();
    dispatch({ type: "city/loaded", payload: data });
  };

  const createCity = async function (newCity) {
    try {
      dispatch({ type: "loaded" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // setCities((city) => [...city, data]);
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({ type: "error", payload: "There was error creating city" });
    }
  };
  const deleteCity = async function (id) {
    try {
      dispatch({ type: "loaded" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      // setCities(cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "error", payload: "There was error deleting city" });
    }
  };

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const context = useContext(CityContext);
  if (context === undefined) throw new Error("CityContext was used before ");
  return context;
}
export { CityProvider, useCities };
