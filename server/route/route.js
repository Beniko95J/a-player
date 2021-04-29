module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const Song = require('../models/Song');

  router.post('/add', async (req, res) => {
    console.log(req.body);
    const result = await Song.find({id: req.body.id})
    if (result.length != 0) {
      res.send('避免重复收藏同一首歌')
    }
    else  {
      const model = await Song.create(req.body);
      res.send(model);
    }
  });

  router.get('/list', async (req, res) => {
    const items = await Song.find();
    res.send(items);
  });

  router.delete('/delete/:id', async (req, res) => {
    await Song.deleteMany({id: req.params.id});
    res.send({
      success: true
    })
  });

  app.use('/api', router);
}
