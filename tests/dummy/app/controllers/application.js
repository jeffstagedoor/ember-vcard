import Ember from 'ember';
import vcard from 'ember-vcard/vcard';

export default Ember.Controller.extend({
	vcardText: Ember.computed(function() {
		return `BEGIN:VCARD
VERSION:2.1
N:Albert;Yannick;;
FN:Yannick Albert
ORG:ARTsinn
TITLE:CEO
TEL;CELL;VOICE:+49 1525 9999999
ADR;WORK:;;Somestr. 31;Kiel;SH;24114;Deutschland
LABEL;WORK;ENCODING=QUOTED-PRINTABLE:ARTsinn=0D=0A=
 Yannick Albert=0D=0A=
 Fockstr. 31=0D=0A=
 24114 Kiel, SH, Deutschland
ADR;HOME:;Somestr. 31;;Kiel;SH;24114;Deutschland
LABEL;HOME;ENCODING=QUOTED-PRINTABLE: Yannick Albert=0D=0A=
 Fockstr. 31=0D=0A=
 24114 Kiel, SH, Deutschland
X-WAB-GENDER:2
URL;HOME:http://yckart.com/
URL;WORK:http://artsinn.de/
BDAY:19911008
EMAIL;PREF;INTERNET:info@artsinn.de
REV:20130619T014947Z
END:VCARD`;
	}),

	vcardText2: Ember.computed(function() {
		return `BEGIN:VCARD
VERSION:3.0
PRODID:-//MailClient.VObject/7.1.31849.0
UID:a410f7e5-7d6c-4a67-bfe5-6f834dc336a7
CATEGORIES:Business,Important
N:Frohner Thurgau;Jeff;van;Dr.;
SORT-STRING:Frohner Thurgau\, Jeff van
NICKNAME:Jeffrey
X-SALUTATION:Herr
FN:Dr. Jeff van Frohner Thurgau
TITLE:CEO
EMAIL;X-CN=Email 1 Adresse;TYPE=PREF:email1@test.at
EMAIL;X-CN=Email 2 Adresse Show As;TYPE=WORK:email2@test.at
TEL;TYPE=CELL:+48/123456789-1200
TEL;TYPE=WORK,VOICE:00436518987123
ADR;TYPE=WORK:;EmailName;Hauptstrasse 15/45;Stadt;Niedersachsen;12345;Argen
 tinien
BDAY;VALUE=date-time:1976-12-06T22:51:03
ORG:Meine Company G.m.b.H;Finanzbuchhaltung
URL:www.test.at
URL:www.otherwebsite.at
END:VCARD
`;
	}),

	vcardText3: Ember.computed(function() {
		return `BEGIN:VCARD
VERSION:3.0
PRODID:-//MailClient.VObject/7.1.31849.0
UID:4ef58be6-25c8-45bd-a231-953972280aae
CATEGORIES:My Contacts
N:Adamina;Andrea;;;
SORT-STRING:Adamina\, Andrea
FN:Andrea Adamina
EMAIL:donkeyxxxx@gmx.ch
TEL;TYPE=CELL:+41797199999
NOTE:<sn>id:1357898684/friendof:1479930987</sn>
PHOTO;TYPE=JPEG;ENCODING=b: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
 DMJEwAQQYjM63rNIYZEKrFTxP/2Q==
END:VCARD`;
	}),


	actions: {
		parse() {
			let parsed = vcard.parse(this.get('vcardText2'), true);
			let stringified = JSON.stringify(parsed, 0,2);
			this.set('outputParsed', stringified);
		},
	}
});