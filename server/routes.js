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
  const query = `
  SELECT Distinct(Country) FROM cis550_project.Food_supply;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // console.log(rows);
      res.json(rows);
    }
  });
};









/* ---- Q3b (Best Movies) ---- */
const groupExploration = (req, res) => {
        var inputSex = req.params.selectedSex;
    var inputAge = req.params.selectedAgegroup;
    var inputRace = req.params.selectedRace;
    const query = `
    WITH a AS (
        SELECT *
        FROM Covid_groups
        WHERE sex="${inputSex}"
        AND age_group="${inputAge}"
        AND hosp_yn='Yes'
        ),
        b AS (
            SELECT *
            FROM Covid_groups
        WHERE sex="${inputSex}"
        AND age_group="${inputAge}"
            AND icu_yn='Yes'
        ),
        c AS (
            SELECT *
            FROM Covid_groups
        WHERE sex="${inputSex}"
        AND age_group="${inputAge}"
            AND death_yn='Yes'
        ),
        tmp1 AS (
        SELECT race_ethnicity_combined, COUNT(*) AS race_count
        FROM a
        GROUP BY race_ethnicity_combined
        ),
        T1 AS (
        SELECT SUM(race_count) As c
        FROM tmp1
        ),
        T2 AS (
        SELECT SUM(race_count) As c
        FROM tmp1
        WHERE race_ethnicity_combined="${inputRace}"
        ),
        tmp2 AS (
        SELECT race_ethnicity_combined, COUNT(*) AS race_count
        FROM b
        GROUP BY race_ethnicity_combined
        ),
        T3 AS (
        SELECT SUM(race_count) As c
        FROM tmp2
        ),
        T4 AS (
        SELECT SUM(race_count) As c
        FROM tmp2
        WHERE race_ethnicity_combined="${inputRace}"
        ),
        tmp3 AS (
        SELECT race_ethnicity_combined, COUNT(*) AS race_count
        FROM c
        GROUP BY race_ethnicity_combined
        ),
        T5 AS (
        SELECT SUM(race_count) As c
        FROM tmp3
        ),
        T6 AS (
        SELECT SUM(race_count) As c
        FROM tmp3
        WHERE race_ethnicity_combined="${inputRace}"
        )
        SELECT IFNULL((CAST(T2.c AS FLOAT)/T1.c), 0) AS ratio1, IFNULL((CAST(T4.c AS FLOAT)/T3.c), 0) AS ratio2, IFNULL((CAST(T6.c AS FLOAT)/T5.c), 0) AS ratio3
        FROM T1, T2, T3, T4, T5, T6;

    `;
//m.release_year-10<'${inputDecade}'//
 console.log(query);
    

    connection.query(query, (err, rows, fields) => {
      if (err) console.log(err);
      else res.json(rows);
    });

};



/*Case Situation */

/*Covid Info */
const getCountry = (req, res) => {
const query = `
SELECT cou FROM cis550_project.Faster_countries
WHERE try_='0';
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(rows);
    else {res.json(rows);}
    // console.log(rows)};
  });
};

const getProvince = (req, res) => {
  var inputCountry = req.params.selectedCountry;
  // console.log(inputCountry);
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
  var query=null;
  console.log(inputProvince);
  if(inputProvince!="null"){
    query = `
  Select  c.Country_Region as Country, c.Province_State as Province,sum(c.Confirmed) as Confirm,sum(c.Recovered) as Recover,sum(c.Deaths) as Death
  from covid_all c
  where c.Country_Region = '${inputCountry}' and c.Province_State = '${inputProvince}'  and Date(c.Date)>'${inputTime}'  and Date(c.Date)<'${endTime}' 
  group by c.Country_Region,c.Province_State; 
  `;
  }
  else{
    query = `
    Select  c.Country_Region as Country, c.Province_State as Province,sum(c.Confirmed) as Confirm,sum(c.Recovered) as Recover,sum(c.Deaths) as Death
    from covid_all c
    where c.Country_Region = '${inputCountry}' and Date(c.Date)>'${inputTime}'  and Date(c.Date)<'${endTime}' 
    group by c.Country_Region,c.Province_State; 
    `;
  }
  


  connection.query(query, (err, rows, fields) => {

    if (err){
      console.log(err);
    } 
    else {
    res.json(rows);
  }
  });
};



module.exports = {
	getTop20Keywords: getTop20Keywords,
	// clgetTopMoviesWithKeyword: getTopMoviesWithKeyword,
  getDecades: getDecades,
  getMap : getMap,
  getWeeks: getWeeks,
  getByWeek:getByWeek,
  getCountries: getCountries,
  getForCountry:getForCountry,
  getRecForCountry:getRecForCountry,
groupExploration: groupExploration,

  getCountry:getCountry,
  getProvince:getProvince,
  getStartTime:getStartTime,
  getEndTime:getEndTime,
  getDisplayed:getDisplayed
};
