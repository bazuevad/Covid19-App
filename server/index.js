const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
app.get('/keywords', routes.getTop20Keywords);


/* ---- (Best Movies) ---- */
app.get('/decades', routes.getDecades);
app.get('/map', routes.getMap);
app.get('/week', routes.getWeeks);
app.get('/byWeek/:selectedWeek', routes.getByWeek);
app.get('/nutrition', routes.getCountries);
app.get('/byCountry/:selectedCountry', routes.getForCountry);
app.get('/foodRecommendation/:selectedCountry', routes.getRecForCountry);
/* ---- Covid group exploration ---- */
app.get('/groups/:selectedSex/:selectedAgegroup/:selectedRace', routes.groupExploration);



/*Case Situation*/
app.get('/country', routes.getCountry);

app.get('/province/:selectedCountry', routes.getProvince);

app.get('/startTime', routes.getStartTime);


app.get('/startTime/:selectedStartTime', routes.getEndTime);

app.get('/display/:country/:province/:selectedStartTime/:selectedEndTime',routes.getDisplayed)





app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
