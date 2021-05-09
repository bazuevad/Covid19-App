const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


//function for the map
const getMap = (req,res)=>{
  const query = `
  SELECT cases.Country, cases.Confirmed, cases.Recovered, cases.Deaths,ll.latitude,ll.longitude
  FROM
  (SELECT joined.Country,joined.Confirmed,joined.Deaths,R.Recovered 
  FROM
  (SELECT C.Country, C.Confirmed,D.Deaths
  FROM
  ((SELECT Country_Region as Country, SUM(Confirm) as Confirmed
  FROM Confirm_cases
  WHERE Date='2020-12-31'
  GROUP BY Country) AS C
  JOIN 
  (SELECT Country_Region as Country, SUM(Death) as Deaths
  FROM Death_cases
  WHERE Date='2020-12-31'
  GROUP BY Country) AS D
  ON C.Country=D.Country)) AS joined
  JOIN 
  (SELECT Country_Region as Country, SUM(Recover) as Recovered
  FROM Recover_cases
  WHERE Date='2020-12-31'
  GROUP BY Country) AS R
  ON joined.Country=R.Country) AS cases
  JOIN Countries AS ll
  ON cases.Country=ll.name;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      // console.log(res.json(rows));
    }
  });
};
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
        // console.log(rows);
        res.json(rows);
      }
    });
};

//getWeeks function
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
const getRecForCountry = (req, res) => {
  let country = req.params.selectedCountry;
  const query = `
  SELECT Average.Alcoholic_Beverages - lAG(Average.Alcoholic_Beverages) OVER(ORDER BY  Average.Country DESC) AS Alcohol, Average.Animal_fats - lAG(Average.Animal_fats) OVER(ORDER BY  Average.Country DESC) AS Animal_fats, Average.Animal_Products - lAG(Average.Animal_Products) OVER(ORDER BY  Average.Country DESC) AS Animal_Products , Average.Sugar - lAG(Average.Sugar) OVER(ORDER BY  Average.Country DESC) AS Sugar, Average.Milk - lAG(Average.Milk) OVER(ORDER BY  Average.Country DESC) AS Milk, Average.Fruits - lAG(Average.Fruits) OVER(ORDER BY  Average.Country DESC) AS Fruits, Average.Fish_Seafood - lAG(Average.Fish_Seafood) OVER(ORDER BY  Average.Country DESC) AS Fish_Seafood, Average.Cereals - lAG(Average.Cereals) OVER(ORDER BY  Average.Country DESC) AS Cereals, Average.Starchy_Roots - lAG(Average.Starchy_Roots) OVER(ORDER BY  Average.Country DESC) AS Starchy_Roots, Average.Vegetable_Oils - lAG(Average.Vegetable_Oils) OVER(ORDER BY  Average.Country DESC) AS Vegetable_Oils, Average.Vegetable_Products - lAG(Average.Vegetable_Products) OVER(ORDER BY  Average.Country DESC) AS Vegetable_Products, Average.Meat - lAG(Average.Meat) OVER(ORDER BY  Average.Country DESC) AS Meat
  FROM
  (SELECT Country, Alcoholic_Beverages,Animal_fats,Animal_Products,Cereals,Fish_Seafood,Fruits, Vegetable_Oils, Vegetable_Products, Starchy_Roots, Sugar, Milk, Meat
  FROM cis550_project.Food_supply
  WHERE Country='${country}'
  UNION
  SELECT DP.Country, AVG(FS.Alcoholic_Beverages) AS Alcoholic_Beverage,AVG(FS.Animal_fats) AS Animal_fats, AVG(FS.Animal_Products) AS Animal_Products, AVG(FS.Cereals) AS Cereals, AVG(FS.Fish_Seafood) AS Fish_Seafood,AVG(FS.Fruits) AS Fruits, AVG(FS.Vegetable_Oils) AS Vegetable_Oils, AVG(FS.Vegetable_Products) AS Vegetable_Products, AVG(FS.Starchy_Roots) AS Starchy_Roots, AVG(FS.Sugar) AS Sugar, AVG(FS.Milk) AS Milk, AVG(FS.Meat) AS Meat
  FROM
  (SELECT cases.Country, cases.Confirmed, cases.Recovered, cases.Deaths, Deaths/Confirmed * 100 AS Death_percentage
    FROM
    (SELECT joined.Country,joined.Confirmed,joined.Deaths,R.Recovered 
    FROM
    (SELECT C.Country, C.Confirmed,D.Deaths
    FROM
    ((SELECT Country_Region as Country, SUM(Confirm) as Confirmed
    FROM Confirm_cases
    WHERE Date='2020-12-31'
    GROUP BY Country) AS C
    JOIN 
    (SELECT Country_Region as Country, SUM(Death) as Deaths
    FROM Death_cases
    WHERE Date='2020-12-31'
    GROUP BY Country) AS D
    ON C.Country=D.Country)) AS joined
    JOIN 
    (SELECT Country_Region as Country, SUM(Recover) as Recovered
    FROM Recover_cases
    WHERE Date='2020-12-31'
    GROUP BY Country) AS R
    ON joined.Country=R.Country) AS cases
    JOIN Countries AS ll
    ON cases.Country=ll.name
   WHERE Deaths > 100
   ORDER BY Death_percentage
   LIMIT 10) AS DP
   JOIN cis550_project.Food_supply AS FS
   ON DP.Country=FS.Country) AS Average
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getByWeek = (req, res) => {
  var inputWeek = req.params.selectedWeek;
  //console.log(inputGenre);
  const query = `
  SELECT cases.Country, cases.Confirmed, cases.Recovered, cases.Deaths,ll.latitude,ll.longitude
  FROM
  (SELECT joined.Country,joined.Confirmed,joined.Deaths,R.Recovered 
  FROM
  (SELECT C.Country, C.Confirmed,D.Deaths
  FROM
  ((SELECT Country_Region as Country, SUM(Confirm) as Confirmed
  FROM Confirm_cases
  WHERE Date='${inputWeek}'
  GROUP BY Country) AS C
  JOIN 
  (SELECT Country_Region as Country, SUM(Death) as Deaths
  FROM Death_cases
  WHERE Date='${inputWeek}'
  GROUP BY Country) AS D
  ON C.Country=D.Country)) AS joined
  JOIN 
  (SELECT Country_Region as Country, SUM(Recover) as Recovered
  FROM Recover_cases
  WHERE Date='${inputWeek}'
  GROUP BY Country) AS R
  ON joined.Country=R.Country) AS cases
  JOIN Countries AS ll
  ON cases.Country=ll.name;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });

};

/* ---- Q1a (Dashboard) ---- */
// Equivalent to: function getTop20Keywords(req, res) {}
const getWeeks = (req, res) => {
    const query = `
    SELECT DISTINCT(Date) FROM cis550_project.Confirm_cases;
    `;
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        // console.log(rows);
        res.json(rows);
      }
    });
};


const getCountries = (req, res) => {
  console.log("HELLO");
  const query = `
  SELECT Distinct(Country) FROM cis550_project.Food_supply;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
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


// /* ---- Q3a (Best Movies) ---- */
// const getDecades = (req, res) => {
//     const query = `
//     SELECT FLOOR(release_year/10)*10 as Decade
//     FROM movie
//     GROUP BY FLOOR(release_year/10)*10
//     ORDER BY FLOOR(release_year/10)*10;
//     `;

//     connection.query(query, (err, rows, fields) => {
//       if (err) console.log(err);
//       else res.json(rows);
//     });
// };


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

const getForCountry = (req, res) => {
  var inputCountry = req.params.selectedCountry;
  const query = `
  SELECT * 
  FROM cis550_project.Food_supply 
  WHERE Country = "${inputCountry}";
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

module.exports = {
	getTop20Keywords: getTop20Keywords,
	getTopMoviesWithKeyword: getTopMoviesWithKeyword,
	getRecs: getRecs,
  getDecades: getDecades,
  getGenres: getGenres,
  bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre,
  getMap : getMap,
  getWeeks: getWeeks,
  getByWeek:getByWeek,
  getCountries: getCountries,
  getForCountry:getForCountry,
  getRecForCountry:getRecForCountry
};
