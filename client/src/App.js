import React, { useState, useEffect } from 'react';
//import data from './sample.geo.json';
import { fade, makeStyles } from '@material-ui/core/styles';
import GeoChart from './components/GeoChart';
import { SelectedCountryProvider } from './context/DataContext';
import './App.css';
import EnhancedTable from './components/FilterTable';
import { AppBar, Toolbar, TextField, CircularProgress } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    display: 'flex',
    width: '150px',
    backgroundColor: fade(theme.palette.common.white, 0.25),
    paddingLeft: '20px',
    paddingRight: '20px',
    marginTop: '5px',
    marginBottom: '5px',
  },
  searchInput: {
    width: '20px',
    margin: '5px',
  },
  appBar: {
    background : 'rgba(255, 0, 0, 0.55)',
  },
  loadingCircle: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));


function App() {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const [property, setProperty] = useState('pop_est');
  const [filter, setFilter] = useState('');

   const getWorld = async () => {
    setIsLoading(true);
    let res
    try {
      res = await axios.get('http://localhost:5000/api/v1/world');
      setData(res.data.data)
    } catch (error){
      setError(error.response.data.error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getWorld()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //add text from tool bar to filter
  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  }

  return (
    <>{isLoading ? (
      <div className={classes.loadingCircle}>
        <CircularProgress />
      </div>
    ) : (
      <SelectedCountryProvider>
      <AppBar position='static' className={classes.appBar}>
        <Toolbar backgroundcolor='red'>
          <div className={classes.searchContainer}>
            <TextField onChange={handleSearchChange} label='City' variant='standard' className={classes.searchInput}/>
          </div>
        </Toolbar>
      </AppBar>
        <h2>World Map with d3-geo</h2>
          <GeoChart data={data} property={property} />
        <h2>Select property to highlight</h2>
        <select value={property} onChange={event => setProperty(event.target.value)}>
          <option value='pop_est'>Population</option>
          <option value='gdp_md_est'>GDP</option>
        </select>
          <EnhancedTable data={data} filter={filter} property={property}/>
      </SelectedCountryProvider>
      )}
    </>
  );
}

export default App;
