const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
// Equivalent to: function getTop20Keywords(req, res) {}
const getTop20Keywords = (req, res) => {
    const query = `
      SELECT Province_State FROM covid_all
      WHERE Country_Region='US'
      LIMIT 20;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
};


/* ---- Q1b (Dashboard) ---- */
const getTopMoviesWithKeyword = (req, res) => {
    var inputLogin = req.params.keyword;

    // TODO: (3) - Edit query below
    const query = `
    WITH tmp AS (
        SELECT m.title, m.rating, m.num_ratings
        FROM movie_keyword mk, movie m
        WHERE mk.kwd_name = "${inputLogin.slice(1)}"
        AND m.movie_id=mk.movie_id
    )
    SELECT *
    FROM tmp
    ORDER BY rating DESC, num_ratings DESC
    LIMIT 10;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        console.log(rows);
        res.json(rows);
      }
    });

};


/* ---- Q2 (Recommendations) ---- */
const getRecs = (req, res) => {
    var inputMovie = req.params.title;
    console.log(inputMovie);
    // TODO: (3) - Edit query below
    const query = `
    WITH a AS (
        SELECT ci.cast_id, m.movie_id, m.release_year
        FROM cast_in ci, movie m
        WHERE ci.movie_id=m.movie_id AND m.title="${inputMovie}"
        ),
        target_cast AS (
        SELECT a.cast_id, a.movie_id
        FROM a
        WHERE a.release_year>=ALL(SELECT release_year FROM a)
        ),
        all_cast AS (
        SELECT ci.cast_id, m.movie_id, m.rating, m.num_ratings
        FROM cast_in ci, movie m
        WHERE ci.movie_id=m.movie_id
        ORDER BY m.movie_id
        ),
        same_cast AS (
        SELECT ac.cast_id, ac.movie_id, ac.rating, ac.num_ratings
        FROM all_cast ac, target_cast tc
        WHERE ac.cast_id=tc.cast_id
        ),
        mmm AS (
        SELECT movie_id, COUNT(*) as c
        FROM same_cast
        GROUP BY movie_id
        ),
        finals AS (
        SELECT mmm.movie_id, mmm.c, m.title, m.rating, m.num_ratings
        FROM mmm, movie m
        WHERE mmm.movie_id=m.movie_id
        ORDER BY mmm.c DESC, m.rating DESC, m.num_ratings DESC
        )
        SELECT title, movie_id, rating, num_ratings, c
        FROM finals
        WHERE title!="${inputMovie}"
        ORDER BY c DESC, rating DESC, num_ratings DESC
        LIMIT 10;
        ;


    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        console.log(rows);
        res.json(rows);
      }
    });

};


/* ---- Q3a (Best Movies) ---- */
const getDecades = (req, res) => {
    const query = `
    SELECT FLOOR(release_year/10)*10 as Decade
    FROM movie
    GROUP BY FLOOR(release_year/10)*10
    ORDER BY FLOOR(release_year/10)*10;
    `;

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else res.json(rows);
    });
};


/* ---- (Best Movies) ---- */
const getGenres = (req, res) => {
  const query = `
    SELECT name
    FROM genre
    WHERE name <> 'genres'
    ORDER BY name ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q3b (Best Movies) ---- */
const bestMoviesPerDecadeGenre = (req, res) => {
    var inputDecade = req.params.selectedDecade;
    var inputGenre = req.params.selectedGenre;
    console.log(inputDecade);
    console.log(inputGenre);
    const query = `
WITH movie_in_decade AS (
SELECT m.movie_id, m.title, m.rating, mg.genre_name
FROM movie m, movie_genre mg
WHERE m.release_year>='${inputDecade}' AND m.release_year-10<'${inputDecade}'
AND mg.movie_id = m.movie_id
),
all_average_in_decade AS (
SELECT mid.genre_name, AVG(mid.rating) as avgr
FROM movie_in_decade mid
GROUP BY mid.genre_name
),
select_genre_movie AS (
SELECT *
FROM movie_in_decade
WHERE genre_name="${inputGenre}"
),
finals AS (
SELECT sgm.movie_id, sgm.title, sgm.rating, mg.genre_name, aaid.avgr
FROM select_genre_movie sgm, movie_genre mg, all_average_in_decade aaid
WHERE sgm.movie_id=mg.movie_id
AND mg.genre_name=aaid.genre_name
ORDER BY sgm.title
)
SELECT DISTINCT f.movie_id, f.title, f.rating
FROM finals f
WHERE f.rating > f.avgr
AND f.movie_id NOT IN (SELECT movie_id FROM finals WHERE rating<=avgr)
ORDER BY f.title
LIMIT 100;
    `;

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else res.json(rows);
    });

};



/*Case Situation */

/*Covid Info */
const getCountry = (req, res) => {
  const query = `
  Select distinct Country_Region as country_name
  from Confirm_cases
  where Country_Region  != '"Bahamas'
  order by Country_Region;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(rows);
    else {res.json(rows);
    console.log(rows)};
  });
};

const getProvince = (req, res) => {
  var inputCountry = req.params.selectedCountry;
  console.log(inputCountry);
  const query = `
  Select distinct Province_State as province_name
  from Confirm_cases
  where Country_Region = '${inputCountry}'
  order by Country_Region;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(rows);
    else res.json(rows);
  });
};

const getStartTime = (req, res) => {
  const query = `Select distinct Date(Date) as StartDate 
  from Confirm_cases
  where Date(Date) >  '2020-01-01'
  order by Date;`
;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(rows);
    else res.json(rows);
  });
};


const getEndTime = (req, res) => {
  var inputTime = req.params.selectedStartTime;
  const query = `Select distinct Date(Date) as EndDate 
  from Confirm_cases
  where Date(Date) >  '${inputTime}'
  order by Date;`
;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(rows);
    else res.json(rows);
  });
};

const getDisplayed = (req, res) => {
  // console.log(req.params);
  var inputCountry = req.params.country;
  var inputProvince = req.params.province;
  var inputTime = req.params.selectedStartTime;
  var endTime = req.params.selectedEndTime;
  const query = `
  Select  c.Country_Region as Country, c.Province_State as Province,sum(c.Confirmed) as Confirm,sum(c.Recovered) as Recover,sum(c.Deaths) as Death
  from covid_all c
  where c.Country_Region = '${inputCountry}' and c.Province_State = '${inputProvince}'  and Date(c.Date)>'${inputTime}'  and Date(c.Date)<'${endTime}' 
  group by c.Country_Region,c.Province_State; 
  `
  
  /*`
  Select c.Country_Region as Country, c.Province_State as Province,c.Confirm,d.Death,r.Recover
  from Confirm_cases c,Death_cases d, Recover_cases r
  where c.Country_Region = '${inputCountry}' and c.Province_State = '${inputProvince}' 
  limit 10;
   `*/
  // const query = `Select c.Country_Region as Country, c.Province_State as Province,c.Confirm,d.Death,r.Recover
  // from Confirm_cases c,Death_cases d, Recover_cases r
  // where c.Country_Region = 'China' and c.Province_State = 'Guizhou'
  // limit 8;`
;

  connection.query(query, (err, rows, fields) => {

    if (err) console.log(rows);
    else {
  
    // console.log(rows); 
    // console.log(req.params.country);
    // console.log(req.params.province);
    // console.log(req.params.selectedStartTime);
    // console.log(req.params.selectedEndTime);
    res.json(rows);}
  });
};



module.exports = {
	getTop20Keywords: getTop20Keywords,
	getTopMoviesWithKeyword: getTopMoviesWithKeyword,
	getRecs: getRecs,
  getDecades: getDecades,
  getGenres: getGenres,
  bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre,


  getCountry:getCountry,
  getProvince:getProvince,
  getStartTime:getStartTime,
  getEndTime:getEndTime,
  getDisplayed:getDisplayed
};
