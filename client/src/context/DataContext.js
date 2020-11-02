import React, { useState, createContext } from 'react';


export const SelectedCountryContext = createContext({
  selectedCountry: null,
  setSelectedCountry: () => null,
  cities: [],
  setCities: () => null,
});

export const SelectedCountryProvider = props => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [cities, setCities] = useState([]);  

  return(
    <SelectedCountryContext.Provider value = { { selectedCountry, setSelectedCountry, cities, setCities } }>
      {props.children}
    </SelectedCountryContext.Provider>
  );
}