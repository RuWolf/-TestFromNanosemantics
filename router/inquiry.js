const {Router} = require('express');
const router = Router();
const fetch = require('node-fetch');

router.post('/init', async (req, res) => {
  const uuid = req.body;
  const response = await fetch("https://biz.nanosemantics.ru/api/bat/nkd/json/Chat.init", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      'uuid': uuid.uuid,
    })
  });
  let result = await response.json();
  console.log(result.result)
  res.json({result: result.result})
});

router.post('/request', async (req, res) => {
  const {cuid, text} = req.body;
  const response = await fetch("https://biz.nanosemantics.ru/api/bat/nkd/json/Chat.request", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      'cuid': cuid,
      'text': text
    })
  });
  let result = await response.json();
  res.json({response:result.result.text.value});
});

module.exports = router;