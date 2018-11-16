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
	'alreq': 'alreq (Arabic/Persian)',
	'clreq': 'clreq (Chinese)',
	'elreq': 'elreq (Ethiopic)',
	'hlreq': 'hlreq (Hebrew)',
	'ilreq': 'ilreq (Indic)',
	'jlreq': 'jlreq (Japanese)',
	'klreq': 'klreq (Korean)',
	'llreq': 'llreq (Latin)',
	'mlreq': 'mlreq (Mongolian)',
	'sealreq': 'sealreq (Southeast Asia)',
	'tlreq': 'tlreq (Tibetan)',
	}