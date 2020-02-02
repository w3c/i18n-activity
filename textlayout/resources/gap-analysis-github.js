var owner = 'w3c';

var sections = {}
var debug = true

var issues = []
var maxpages = 5

var totals=0
var counter=maxpages
			
function getAllData (repo, doc) {
	for (var p=1;p<maxpages+1;p++) fetchIssues(p, repo)
	var timer = setInterval(function() {
		if (counter === 0) {
			clearInterval(timer)
			if (debug) console.log('finished','Issue length:',issues.length, sections)

			// group issues by label, adding to the labels array
			for (var i=0; i<issues.length; i++) {
				if (issues[i].labels) {
					for (var l=0;l<issues[i].labels.length;l++) { // for each label in that issue
						if (issues[i].labels[l].name.startsWith('i:')) {
							sLabelFound = issues[i].labels[l].name.replace(/^i:/,'')
							if (sections[sLabelFound]) sections[sLabelFound].push(issues[i])
							else {
								sections[sLabelFound] = []
								sections[sLabelFound].push(issues[i])
								}
							if (debug) console.log(sLabelFound)
							}
						}
					}
				}
			buildDoc(repo, doc)
			}
		else if (debug) console.log(counter)
		}, 50)
	}

	
// Grab and present the issue list from GitHub
function fetchIssues(page, repo) {
	var request = new XMLHttpRequest();
	request.open('get','https://api.github.com/repos/w3c/'+repo+'/issues?per_page=100&page='+page)
	request.onload = function () {
			var temp = JSON.parse(request.responseText)
			for (var i=0;i<temp.length;i++) {
				issues.push(temp[i])
				}
		totals += issues.length;
		if (debug) console.log(issues.length,totals,page, counter)
		counter--
		}
	request.send();
	}
				


function buildDoc (repo, doc) {
	// incorporate the information in the database into the html document


	if (sections.vertical_text) buildSection(sections.vertical_text,'vertical_text', doc)
	if (sections.bidirectional_text) buildSection(sections.bidirectional_text,'bidi_text', doc)
	
	if (sections.characters_and_encoding) buildSection(sections.characters_and_encoding,'charset', doc)
	if (sections.fonts) buildSection(sections.fonts,'fonts', doc)
	if (sections.font_styles_weight_etc) buildSection(sections.font_styles_weight_etc,'font_style', doc)
	if (sections.glyph_shaping_positioning) buildSection(sections.glyph_shaping_positioning,'glyphs', doc)
	if (sections.cursive_text) buildSection(sections.cursive_text,'cursive', doc)
	if (sections.transforming_characters) buildSection(sections.transforming_characters,'transforms', doc)
	if (sections.baselines_line_height_etc) buildSection(sections.baselines_line_height_etc,'baselines', doc)
	if (sections.grapheme_word_segmentation) buildSection(sections.grapheme_word_segmentation,'segmentation', doc)
	if (sections.inline_features_punctuation) buildSection(sections.inline_features_punctuation,'punctuation', doc)
	if (sections.text_decoration) buildSection(sections.text_decoration,'text_decoration', doc)
	if (sections.quotations) buildSection(sections.quotations,'quotations', doc)
	if (sections.inline_notes_annotations) buildSection(sections.inline_notes_annotations,'inline_notes', doc)
	if (sections.data_formats_numbers) buildSection(sections.data_formats_numbers,'data_formats', doc)

	if (sections.line_breaking) buildSection(sections.line_breaking,'line_breaking', doc)
	if (sections.hyphenation) buildSection(sections.hyphenation,'hyphenation', doc)
	if (sections.text_align_justification) buildSection(sections.text_align_justification,'justification', doc)
	if (sections.letter_spacing) buildSection(sections.letter_spacing,'spacing', doc)
	if (sections.lists_counters_etc) buildSection(sections.lists_counters_etc,'lists', doc)
	if (sections.styling_initials) buildSection(sections.styling_initials,'initials', doc)
}


function buildSection (theData, sectionId, doc) {
	var labelSet = new Set([])
	var out = ''
	for (let i=0;i<theData.length;i++) {

		// screen out issues that don't relate to the current gap-analysis document
		rightDoc = false
		for (l=0;l<theData[i].labels.length;l++) {
			if (theData[i].labels[l].name === doc) rightDoc = true
			}
		console.log('rightDoc:',rightDoc)
		
		if (rightDoc) {

			// find priority labels
			for (l=0;l<theData[i].labels.length;l++) {
				labelSet.add(theData[i].labels[l].name)
				}
			console.log('labelSet:',labelSet)
		
			out += '<section id="issue'+theData[i].number+'">\n'
			out += '<h4><a target="_blank" href="https://github.com/w3c/eurlreq/issues/'+theData[i].number+'">#'+theData[i].number+'</a> '+theData[i].title+'</h4>\n'
			out += '<p>'

			var body = theData[i].body

			// make GH images into img element
			function convertToImg(str, p1, p2, s) {
				return '<img src="'+p2+'" alt="'+p1+'"/>'
				}
			var test = /!\[([^\]]+)\]\(([^\)]+)\)/g
			body = body.replace(test, convertToImg)

			// create html links
			function convert(str, p1, p2, s) {
				return '<a href="'+p2+'">'+p1+'</a>'
				}
			var test = /\[([^\]]+)\]\(([^\)]+)\)/g
			body = body.replace(test, convert)

			// create convert code segments links
			function convertcode(str, p1, s) {
				p1 = p1.replace(/</g,'&lt;')
				p1 = p1.replace(/>/g,'&gt;')
				return '<code translate="no">'+p1+'</code>'
				}
			test = /`([^`]+)`/g
			body = body.replace(test, convertcode)

			// split into paragraphs
			out += body.replace(/\r\n\r\n/g,'</p><p>')
			out += '</p>\n'
			out += '</section>\n'
			}
		}
	document.getElementById('insert-'+sectionId).innerHTML = out

	// figure out priority for section
	var priority = ''
	if (labelSet.has('p:basic')) priority = 'basic'
	else if (labelSet.has('p:advanced')) priority = 'advanced'
	if (priority !== '') document.getElementById(sectionId).className = priority
	window.summary[sectionId] = priority
	}


window.summary = {}

function setUpSummary () {

summary.vertical_text = document.getElementById('vertical_text').className
summary.bidi_text = document.getElementById('bidi_text').className

summary.charset = document.getElementById('charset').className
summary.fonts = document.getElementById('fonts').className
summary.font_style = document.getElementById('font_style').className
summary.glyphs = document.getElementById('glyphs').className
summary.cursive = document.getElementById('cursive').className
summary.transforms = document.getElementById('transforms').className
summary.baselines = document.getElementById('baselines').className
summary.segmentation = document.getElementById('segmentation').className
summary.punctuation_etc = document.getElementById('punctuation_etc').className
summary.text_decoration = document.getElementById('text_decoration').className
summary.quotations = document.getElementById('quotations').className
summary.inline_notes = document.getElementById('inline_notes').className
summary.data_formats = document.getElementById('data_formats').className

summary.line_breaking = document.getElementById('line_breaking').className
summary.hyphenation = document.getElementById('hyphenation').className
summary.justification = document.getElementById('justification').className
summary.spacing = document.getElementById('spacing').className
summary.lists = document.getElementById('lists').className
summary.initials = document.getElementById('initials').className

summary.page_layout = document.getElementById('page_layout').className
summary.footnotes_etc = document.getElementById('footnotes_etc').className
summary.headers_footers = document.getElementById('headers_footers').className
summary.interaction = document.getElementById('interaction').className

}




function printSummary () {
	
var out = ''
for (let i=0;i<respecConfig.langs.length;i++) {
    out += '{lang: "'+respecConfig.langs[i]+'"'
    out += ', url:"'+respecConfig.gapDocPath+'"'
    out += ', tentative:' + true
    out += ', vertical_text:"'+window.summary.vertical_text+'"'
    out += ', bidi_text:"'+window.summary.bidi_text+'"'

    out += ', charset:"'+window.summary.charset+'"'   
    out += ', fonts:"'+window.summary.fonts+'"'
    out += ', font_style:"'+window.summary.font_style+'"'
    out += ', glyphs:"'+window.summary.glyphs+'"'
    out += ', cursive:"'+window.summary.cursive+'"'
    out += ', transforms:"'+window.summary.transforms+'"'
    out += ', baselines:"'+window.summary.baselines+'"'
    out += ', segmentation:"'+window.summary.segmentation+'"'
    out += ', punctuation_etc:"'+window.summary.punctuation_etc+'"'
    out += ', text_decoration:"'+window.summary.text_decoration+'"'
    out += ', quotations:"'+window.summary.quotations+'"'
    out += ', inline_notes:"'+window.summary.inline_notes+'"'
    out += ', data_formats:"'+window.summary.data_formats+'"'

    out += ', line_breaking:"'+window.summary.line_breaking+'"'
    out += ', hyphenation:"'+window.summary.hyphenation+'"'
    out += ', justification:"'+window.summary.justification+'"'
    out += ', spacing:"'+window.summary.spacing+'"'
    out += ', lists:"'+window.summary.lists+'"'
    out += ', initials:"'+window.summary.initials+'"'

    out += ', page_layout:"'+window.summary.page_layout+'"'
    out += ', footnotes_etc:"'+window.summary.footnotes_etc+'"'
    out += ', headers_footers:"'+window.summary.headers_footers+'"'
    out += ', interaction:"'+window.summary.interaction+'"'
    out += '},\n'

    out = out.replace(/tbd/g,'')
    out = out.replace(/broken/g,'0')
    out = out.replace(/ok/g,'3')
    out = out.replace(/advanced/g,'2')
    out = out.replace(/basic/g,'1')
    out = out.replace(/"na/g,'"-')
    }
document.getElementById('summaryPlaceholder').textContent = out
}





