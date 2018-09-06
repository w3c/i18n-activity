// Full list of labels in github to use as headers.
// Nothing will be produced if there's no open issue for a given label.

var labels = { 
	'baselines':[],
	'bidi-text':[],
	'boundaries':[],
	'transforms':[],
	'cursive':[],
	'emphasis':[],
	'fonts':[],
	'glyphs-diacritics':[],
	'hyphenation':[],
	'initial-letter':[],
	'inline-spacing':[],
	'justification':[],
	'line-break':[],
	'lists':[],
	'notes-footnotes':[],
	'numbers':[],
	'pagination':[],
	'paragraph-features':[],
	'punctuation':[],
	'quotations':[],
	'ruby':[],
	'text-decoration':[],
	'vertical-text':[],
	}



var scriptLabels= new Set(['alreq', 'clreq', 'elreq', 'hlreq', 'ilreq', 'jlreq', 'klreq', 'llreq', 'mlreq', 'sealreq', 'tlreq'])


var labelName = {
	'alreq': 'Arabic/Persian',
	'clreq': 'Chinese',
	'elreq': 'Ethiopic',
	'hlreq': 'Hebrew',
	'ilreq': 'Indic',
	'jlreq': 'Japanese',
	'klreq': 'Korean',
	'llreq': 'Latin',
	'mlreq': 'Mongolian',
	'sealreq': 'Southeast Asia',
	'tlreq': 'Tibetan',
	}