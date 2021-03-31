import './App.css';

import React from "react";
import axios from "axios";

export default class App extends React.Component {
  state = {
    bots: [],
    mode: "paper"
  };

  reinvest(botId, amount) {
     axios.post(`/bots/${botId}/reinvest`, {amount: amount}).then((response) => {
       console.log(response.data)
    });
  };

  switchToMode(mode) {
    axios.post("/mode", { mode: mode }).then((response) => {
      this.setState({ mode: mode});

      axios.get("/bots.json").then((response) => {
        this.setState({ bots: response.data.bots });
      });
    });
  };

  componentDidMount() {
    this.switchToMode(this.state.mode)
  };


  render() {
    const {bots, mode} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>My DCA bots</h1>
          <div>
            <h2> Current mode: {mode}</h2>
            <button onClick={(e) => this.switchToMode("real")}>Switch to real</button>
            <button onClick={(e) => this.switchToMode("paper")}>Switch to paper</button>
          </div>
          <br/>
          <br/>
          {bots.map((bot) => (
            <div key={bot.id}>
              <p>{bot.name}</p>
              <p>Base order volume: {bot.base_order_volume}</p>
              <p>Finished deals profit(USD): {bot.finished_deals_profit_usd}</p>
              <button onClick={(e) => this.reinvest(bot.id, bot.finished_deals_profit_usd, e)}>Reinvest all profit({bot.finished_deals_profit_usd})</button>
              <hr/>
            </div>
          ))}
        </header>
      </div>
    )
  }
}
