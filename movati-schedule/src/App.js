import React, { Component } from 'react';
import { fetchLocations, fetchSchedule } from './api';
import Schedule from './Schedule';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: null
    };
  }

  async componentDidMount() {
    const locations = await fetchLocations();
    const schedules = await fetchSchedule(locations['Trainyards']);
    this.setState({ schedules });
  }

  render() {
    return (
      <div className="App">
      <Schedule/>
      <header className="App-header">
      { this.state.schedules ? JSON.stringify(this.state.schedules, null, 2) : `Mervati` }
      </header>
      </div>
      );
  }
}

export default App;