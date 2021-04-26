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

module.exports = {
	getTop20Keywords: getTop20Keywords,
	getTopMoviesWithKeyword: getTopMoviesWithKeyword,
	getRecs: getRecs,
  getDecades: getDecades,
  getGenres: getGenres,
  bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre
};
