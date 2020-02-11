const express = require('express');
const cors = require('cors');
const config = require('config');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const routerInquiry = require('./router/inquiry')

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
// app.use('api/auth', require('./router/auth.routes'));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);

app.use('/api', routerInquiry);

// app.post('/api/inquiry/init', async (req, res) => {
//   const response = await fetch("https://biz.nanosemantics.ru/api/bat/nkd/json/Chat.init", {
//     headers: {
//       "Content-Type": "application/json"
//     },
//     method: "POST",
//     body: JSON.stringify({
//       'uuid': '772c9859-4dd3-4a0d-b87d-d76b9f43cfa4',
//     })
//   });
//   let result = await response.json();
//   res.json({result: result.result})
// });

// app.post('/api/inquiry/request', async (req, res) => {
//   const {cuid, text} = req.body;
//   // console.log(req.body);
//   const response = await fetch("https://biz.nanosemantics.ru/api/bat/nkd/json/Chat.request", {
//     headers: {
//       "Content-Type": "application/json"
//     },
//     method: "POST",
//     body: JSON.stringify({
//       'cuid': cuid,
//       'text': text
//     })
//   });
//   let result = await response.json();
//   res.json({result})
// });

const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
  } catch (e) {
    console.log('Server error, ', e.message);
    process.exit(1);
  }
}

start();
