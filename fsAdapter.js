const fs = require('fs');
const CryptoJS = require("crypto-js")


// loki-fs-cipher-adapter-node
module.exports = class LokiFSCipherAdapterNode {

	options = {
		algorithm: 'AES',
		password : ''
	};

	constructor(options) {
		options = options || {};

		Object.keys(options)
			.forEach(key => this.options[key] = options[key])
	}

	_saveFile(path, data) {
		return new Promise(
			(resolve, reject) => fs.writeFile(path, data, { encoding: "utf8" }, (error) => error ? reject(error.code) : resolve() )
		)
	}

	_loadFile(path) {
		return new Promise(
			(resolve, reject) => fs.readFile(path, "utf8", (error, content) => error ? reject(error.code) : resolve(content) )
		)
	}

	_getMethod(algorithmName) {
		algorithmName = algorithmName || this.options.algorithm;
		const algorithm = CryptoJS[algorithmName];

		if ( !algorithm ) {
			console.log(new Error(`LokiFSCipherAdapterNode error: No support for ${algorithmName} algorithm`));
		}

		return algorithm;
	}

	saveDatabase(dbname, dbstring, callback) {
		const algorithm = this._getMethod();
		if (!algorithm) callback(false)
		dbstring = algorithm.encrypt(dbstring, this.options.password).toString();

		this._saveFile(dbname, dbstring)
			.then(callback)
			.catch(() => callback(null))
	}

	loadDatabase(dbname, callback) {
		const algorithm = this._getMethod();
		if (!algorithm) callback(false)

		this._loadFile(dbname)
			.then(content => {
				if (!content || content.length === 0) {
					callback(null);
					return null
				}

				const bytes = algorithm.decrypt(content, this.options.password)

				try {
					if (bytes.sigBytes < 0) {
						callback(new Error("Wrong Password for Database!"));
					} else {
						content = bytes.toString(CryptoJS.enc.Utf8);

						callback(content);
					}
				} catch(error) {
					callback(new Error("Wrong Password for Database!"));
				}
			})
			.catch(() => callback(null))
	}
}
