const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const port = 5000;
const app = express();

app.use(bodyParser.json());

//Because the code implements inter-services communication, it needs to know the address of the heroes service
//If changed the port on which the heroes service runs then need to edit this line

const heroesService = 'http://localhost:4000';

//the challenges that only a superhero can overcome. It also provides an API endpoint for matching superheros to threats.

const threats = [
  {
      id: 1,
      displayName: 'Pisa tower is about to collapse.',
      necessaryPowers: ['flying'],
      img: 'tower.jpg',
      assignedHero: 0
  },
  {
      id: 2,
      displayName: 'Engineer is going to clean up server-room.',
      necessaryPowers: ['teleporting'],
      img: 'mess.jpg',
      assignedHero: 0
  },
  {
      id: 3,
      displayName: 'John will not understand the joke',
      necessaryPowers: ['clairvoyance'],
      img: 'joke.jpg',
      assignedHero: 0
  }
];

app.get('/threats', (req, res) => {
  console.log('Returning threats list');
  res.send(threats);
});

///assignment, which attaches a hero to the given threat

app.post('/assignment', (req, res) => {
  request.post({
      headers: {'content-type': 'application/json'},
      url: `${heroesService}/hero/${req.body.heroId}`,
      body: `{
          "busy": true
      }`
  }, (err, heroResponse, body) => {
      if (!err) {
          const threatId = parseInt(req.body.threatId);
          const threat = threats.find(subject => subject.id === threatId);
          threat.assignedHero = req.body.heroId;
          res.status(202).send(threat);
      } else {
          res.status(400).send({problem: `Hero Service responded with issue ${err}`});
      }
  });
});

app.use('/img', express.static(path.join(__dirname,'img')));

console.log(`Threats service listening on port ${port}`);
app.listen(port);