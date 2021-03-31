require('dotenv-flow').config()
var express = require('express')
var path = require('path');
var app = express();
var router = express.Router()

const threeCommasAPI = require('./client')

const api = new threeCommasAPI({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
})


app.use('/', router);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get('/bots.json', async(req, res, next) => {
  try {
    const bots = await api.getBots()
    res.json({bots: bots});
  } catch (error) {
    return next(error)
  }
});

app.post('/bots/:id/reinvest', async(req, res, next) => {
  try {
    const bot = await api.botShow(req.params.id)
    const newBaseOrderVolume = parseFloat(bot.base_order_volume) + parseFloat(req.body.amount)
    const paramsForUpdate = Object.assign(bot, {bot_id: bot.id, base_order_volume: newBaseOrderVolume || bot.base_order_volume})
    const updatedBot = await api.botUpdate(paramsForUpdate)
    res.json({success: true, bot: updatedBot})
  } catch (error) {
    return next(error)
  }
})

app.post('/mode', async(req, res, next) => {
  try {
    const mode = req.body.mode || "real"
    await api.changeMode(mode)
    res.json({success: true})
} catch (error) {
    return next(error)
  }
})


module.exports = app;
