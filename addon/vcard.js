export default {

	regex: {
		vcardIntern: /^(BEGIN:VCARD|END:VCARD){1,}$/i,
		globalField: /^(version|title|prodid|uid|source|kind):(.+)$/i,
		valueLine: /^([^:]*):(.+)$/i,
		notASeperator: /((\r\n )|(\n )|(\r ))+/g,
	},

	parse: function(vcardText, bringinForm=false) {
		/*
		* vCard has this special Syntax '\r\n ' (a line feed/cr followed by a space as first character)
		* which doesn't count as a new value, but is the same value - for longer things like photos, address labels, even on a country name...
		* So, what I do here is: replace every '\r\n ' with #NOTASEPERATOR#
		* and then later replace the #NOTASEPERATOR# with an empty string. sorry.
		*/
		vcardText = vcardText.replace(this.regex.notASeperator, '#NOTASEPERATOR#');
		let lines = vcardText.split(/\r\n|\r|\n/);

		let result = {};
		let matches = [];
		lines.forEach(line => {
			line = line.replace(/(#NOTASEPERATOR#)/g,'');

			if(this.regex.vcardIntern.test(line)) {
				// skip, it's either BEGINN:VCARD or END:VCARD
				return;
			} 

			if(this.regex.globalField.test(line)) {
				matches = line.match(this.regex.globalField);
				result[matches[1]] = matches[2];
			} else {
				if(this.regex.valueLine.test(line)) {
					matches = line.match(this.regex.valueLine);
					let keys = matches[1];
					let values = matches[2];
					if(keys.indexOf(';')!=-1) {
						// check if the key has params to it like: 'TEL;CELL;VOICE'
						// split that, take the first item as key, the rest as meta
						let keyOptions = keys.split(';');
						let key = keyOptions.shift();
						let meta = keyOptions;
						let item = {
							meta: this.seperateMeta(meta),
							value: this.seperateValues(values, key)
						}

						if(result[key]) { // if this key was already used, we need to change that into an array
							if(Array.isArray(result[key])) { // we have an array already, so we can just push
								result[key].push(item);
							}
							if(typeof result[key] == 'object' || typeof result[key] == 'string') { // we have an object, so a single meta/value pair
								let oldItem = result[key];
								result[key] = [];
								result[key].push(oldItem);
								result[key].push(item);
							}
						} else {
							result[key] = item;
						}
					} else {
					// or if it's a simple 'EMAIL'
						if(result[keys]) { // if this key was already used, we need to change that into an array
							console.log('keyalready used: '+keys);
							if(Array.isArray(result[keys])) { // we have an array already, so we can just push
								result[keys].push(this.seperateValues(values, keys));
							}
							if(typeof result[keys] == 'object' || typeof result[keys] == 'string') { // we have an object, so a single meta/value pair
								console.log('and its an object:');
								console.log(result[keys]);
								let oldItem = result[keys];
								result[keys] = [];
								result[keys].push(oldItem);
								result[keys].push(this.seperateValues(values, keys));
							}
						} else {
							result[keys] = {};
							result[keys] = this.seperateValues(values, keys);
						}

					}
				}
			}
		});
		if(bringinForm) {
			result = this.bringinForm(result);
		}
		return result;
	},

	seperateMeta: function(meta) {
		if(Array.isArray(meta)) {
			let result = {};
			let i = 1;
			meta.forEach(m => {
				// check if META is in style TYPE=PREF or TYPE=WORK,VOICE
				if(m.indexOf('=')!=-1) {
					let itemParts = m.split('=');
					let item = {};
					// item[itemParts[0]] = itemParts[1];
					result[itemParts[0]] = itemParts[1]; //.push(item);
				} else {
					result['value'+i++] = m;
				}
			});
			return result;
		} else {
			return meta;
		}
	},

	seperateValues: function(values, key=null) {
		if(values.indexOf(';')!=-1) {
			values = values.split(';');
		} else if (values.indexOf(',')!=-1) {
			values = values.split(',');
		} else {
			return values;
		}

		switch (key) {
			case 'N':
				let name = {};
				name.lastName = values.shift();
				name.firstName = values[0] ? values.shift() : '';
				name.middleName = values[0] ? values.shift() : '';
				name.titles = values ? values : [];
				return name;
			case 'ORG':
				let org = {};
				org.company = values[0];
				org.departement = values[1];
				if(values[2]) {
					org.other = values[2];
				}
				return org;
			case 'ADR':
				let adr = {};
				adr.postOfficeBox = values.shift();
				adr.extendedAddress = values.shift();
				adr.street = values.shift();
				adr.city = values.shift();
				adr.region = values.shift();
				adr.postal = values.shift();
				adr.country = values.shift();
				return adr;
			default:
				return values;
		}
	},

	/*
	* here I'm trying to grab all the things that make sense, rename the properties, group it and dump the thing that we don't need.
	*/
	bringinForm: function(r) {
		let object = {};
		// 1. we need a name
		object.name = {};
		if(r.N) {
			r.N.fullName = r.FN ? r.FN : '';
			object.name = r.N;
		} else {
			object.name = r.FN;
		}
		object.name.nickname = r.NICKNAME ? r.NICKNAME : '';

		// 2. let's get that contact infos going
		object.contact = {};
		object.contact.email = r.EMAIL ? r.EMAIL : [];
		object.contact.tel = r.TEL ? r.TEL : [];
		object.contact.adress = r.ADR ? r.ADR : [];
		object.contact.websites = r.URL ? r.URL : [];

		object.contact.organisation = r.ORG ? r.ORG : {};
		if(r.TITLE) {
			object.contact.organisation.title = r.TITLE;
		}

		object.private = {};
		object.private.birthday = r.BDAY ? r.BDAY : '';




		return object;
	},

	/*
	* this is a parse-function I've found here http://jsfiddle.net/ARTsinn/P2t2P/
	* that I used as basic idea.
	* It didn't give me the desired results and flexibility, so I refrained from adapting and wrote new...
	* 
	*/
	/*
	origparse: function(vcardText) {

		var Re1 = /^(version|fn|title|org):(.+)$/i;
		var Re2 = /^(([^:;]+);)+([^:]+):(.+)$/;
		var ReKey = /item\d{1,2}\./;
		var fields = {};

		vcardText.split(/\r\n|\r|\n/).forEach(function (line) {
			var results, key;

			if (Re1.test(line)) {
				results = line.match(Re1);
				key = results[1].toLowerCase();
				fields[key] = results[2];
			} else if (Re2.test(line)) {
				results = line.match(Re2);
				key = results[1].replace(ReKey, '').toLowerCase();

				var meta = {};
				results[2].split(';')
					.map(function (p, i) {
					var match = p.match(/([a-z]+)=(.*)/i);
					if (match) {
						return [match[1], match[2]];
					} else {
						return ["TYPE" + (i === 0 ? "" : i), p];
					}
				})
					.forEach(function (p) {
					meta[p[0]] = p[1];
				});

				if (!fields[key]) fields[key] = [];

				fields[key].push({
					meta: meta,
					value: results[3].split(';')
				})
			}
		});

		return fields;
	}
	*/
}

// GENERATOR
/*
var vcard= {
    str_vcard:'BEGIN:VCARD\nVERSION:3.0\n',
    str_end:'\nEND:VCARD',
    goog_chart:'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=',
    build_name: function(){
        var first_name = $('input[name="first_name"]').val(),
            last_name = $('input[name="last_name"]').val();
        
        vcard.str_vcard += 'N:'+last_name+';'+first_name+'\n'+
                            'FN:'+first_name+' '+last_name;
    },
    build_address: function(){
        var home_street = $('input[name="home_street"]').val(),
            home_city = $('input[name="home_city"]').val(),
            home_region = $('input[name="home_region"]').val(),
            home_post = $('input[name="home_post"]').val(),
            home_country = $('input[name="home_country"]').val(),
            org_street = $('input[name="org_street"]').val(),
            org_city = $('input[name="org_city"]').val(),
            org_region = $('input[name="org_region"]').val(),
            org_post = $('input[name="org_post"]').val(),
            org_country = $('input[name="org_country"]').val();
        
        vcard.str_vcard += '\nADR;TYPE=home:;;'+home_street+';'+home_city+';'+home_region+
                            ';'+home_post+';'+home_country+
                            '\nADR;TYPE=work:;;'+org_street+';'+org_city+';'+org_region+
                            ';'+org_post+';'+org_country;
      },      
    save: function(){
        vcard.build_name();
        
        vcard.build_address();
        
        vcard.str_vcard += vcard.str_end;
        ,
        $('textarea[name="vcard"]').val(vcard.str_vcard);
     
        $('#qr').attr('src',vcard.goog_chart+vcard.str_vcard);
    }
}
*/