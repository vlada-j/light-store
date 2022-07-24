const databaseFactory = require("./database");


databaseFactory({ path:"db.bd", password: "loki", algorithm: "AES" })
	.then( onDbConnect )
	.catch(e=> console.log(e))



function onDbConnect(db) {
	if ( db.listCollections().length === 0 ) {
		// db is empty
		db.addCollection('top').insert([
			{term:'JavaScript'      , style :'warning'   , score: 5 },
			{term:'Angular 2'       , style :'danger'    , score: 2 },
			{term:'NodeJS'          , style :'success'   , score: 5 },
			{term:'Golang'          , style :'info'      , score: 3 },
			{term:'iOS'             , style :'default'   , score: 1 },
			{term:'ReactJS'         , style :'warning'   , score: 2 },
			{term:'Ionic'           , style :'info'      , score: 2 },
			{term:'REST'            , style :'primary'   , score: 3 },
			{term:'Authentication'  , style :'default'   , score: 3 },
			{term:'Android'         , style :'success'   , score: 2 }
		]);
	} else {
		console.log(db.listCollections());
	}
	db.close()
}



