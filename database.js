const loki = require("lokijs");
const LokiFSCipherAdapterNode = require("./fsAdapter");

module.exports = function databaseFactory(config) {
	return new Promise((resolve, reject) => {
		databaseFactory.db = new loki(config.path, {
			autoload: true,
			autoloadCallback : loadHandler,
			autosave: true,
			autosaveInterval: 1000,
			adapter: new LokiFSCipherAdapterNode({ password: config.password, algorithm: config.algorithm })
		});

		function loadHandler(err) {
			if (err && err instanceof Error) {
				reject(err);
			} else {
				resolve( databaseFactory.db )
			}
		}
	})
}
