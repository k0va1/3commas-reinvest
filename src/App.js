import './App.css';

import React from "react";
import axios from "axios";

export default class App extends React.Component {
  state = {
    bots: [],
  };

  componentDidMount() {
    axios.get("/bots.json").then((response) => {
      this.setState({ bots: response.data.bots });
    });
  };

  reinvest(botId, amount) {
     axios.post(`/bots/${botId}/reinvest`).then((response) => {
       console.log(response.data)
    });
  };

  render() {
    const {bots} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>My DCA bots</h1>
          {bots.map((bot) => (
            <div>
              <p>{bot.name}</p>
              <p>Finished deals profit(USD): {bot.finished_deals_profit_usd}</p>
              <button onClick={(e) => this.reinvest(bot.id, 10, e)}>Reinvest all profit({bot.finished_deals_profit_usd})</button>
              <hr/>
            </div>
          ))}
        </header>
      </div>
    )
  }
}
