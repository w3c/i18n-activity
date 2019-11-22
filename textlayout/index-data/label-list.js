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



var scriptLabels= new Set(['afrlreq', 'alreq', 'clreq', 'elreq', 'eurlreq', 'hlreq', 'ilreq', 'jlreq', 'klreq', 'llreq', 'mlreq', 'sealreq', 'tlreq'])


var labelName = {
	'afrlreq': 'afrlreq (Africa)',
	'alreq': 'alreq (Arabic/Persian)',
	'clreq': 'clreq (Chinese)',
	'elreq': 'elreq (Ethiopic)',
	'eurlreq': 'eurlreq (Europe)',
	'hlreq': 'hlreq (Hebrew)',
	'ilreq': 'ilreq (Indic)',
	'jlreq': 'jlreq (Japanese)',
	'klreq': 'klreq (Korean)',
	'llreq': 'llreq (Latin)',
	'mlreq': 'mlreq (Mongolian)',
	'sealreq': 'sealreq (Southeast Asia)',
	'tlreq': 'tlreq (Tibetan)',
	}


var sectionNames = { 
	'baselines':'Baselines & inline alignment',
	'bidi-text':'Bidirectional text direction',
	'boundaries':'Text segmentation & selection',
	'transforms':'Transforming characters',
	'cursive':'Cursive text',
	'emphasis':'Emphasis (change me)',
	'encoding':'Character encodings',
	'fonts':'Fonts',
	'font-style':'Font styles, weight, etc.',
	'footnotes-etc':'Notes, footnotes, etc',
	'glyphs':'Glyph shaping & positioning',
	'grids-tables':'Grids & tables',
	'headers-footers':'Page headers, footers, etc',
	'hyphenation':'Hyphenation',
	'initials':'Styling initials',
	'inline-notes':'Inline notes & annotations',
	'interaction':'Forms & user interaction',
	'justification':'Text alignment & justification',
	'line-breaking':'Line breaking',
	'lists':'Lists, counters, etc',
	'more-inline':'Other inline features',
	'more-para':'Other paragraph features',
	'numbers':'Numbers & digits',
	'page-layout':'General page layout and progression',
	'punctuation':'Punctuation',
	'quotations':'Quotations',
	'spacing':'Word & letter spacing ',
	'text-decoration':'Text decoration',
	'transforms':'Transforming characters',
	'vertical-text':'Vertical text',
	}

