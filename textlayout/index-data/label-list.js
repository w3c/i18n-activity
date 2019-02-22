// Full list of labels in github to use as headers.
// Nothing will be produced if there's no open issue for a given label.

var labels = { 
	'baselines':[],
	'bidi_text':[],
	'boundaries':[],
	'transforms':[],
	'cursive':[],
	'emphasis':[],
	'fonts':[],
	'font_style':[],
	'footnotes_etc':[],
	'glyphs':[],
	'grids_tables':[],
	'headers_footers':[],
	'hyphenation':[],
	'initials':[],
	'inline_notes':[],
	'interaction':[],
	'justification':[],
	'line_breaking':[],
	'lists':[],
	'numbers':[],
	'page_layout':[],
	'punctuation':[],
	'quotations':[],
	'spacing':[],
	'text_decoration':[],
	'transforms':[],
	'vertical_text':[],
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