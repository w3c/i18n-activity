var owner = 'w3c'

var sections = {}
var debug = false

var issues = []
var maxpages = 6

var totals=0
var counter=maxpages

async function getAllData (repo, doc) {
	let arr = []
	//for (let p=1; p < maxpages+1; p++) arr.push(fetch('https://api.github.com/repos/w3c/'+repo+'/issues?per_page=500&page='+p))
	for (let p=1; p < maxpages+1; p++) arr.push(fetch('https://api.github.com/repos/w3c/'+repo+'/issues?labels=gap&per_page=100&page='+p))

	return await Promise.all(arr)
	.then(
		function (responses) {
			return Promise.all(responses.map(
				function(res) {
					if (! res.ok) throw Error("GitHub API error " + res.status + " on " + res.url)
					return res.json()
					}
				))
			}
		)
	.then(function(data) {
		issues = issues.concat(data[0])
		totals = issues.length
        if (debug) console.log("Issue length", issues.length)
        
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
						if (debug) console.log("sLabelFound", sLabelFound)
						}
					}
				}
			}
        if (debug) console.log("SECTIONS", sections)
		buildDoc(repo, doc)
		})
	}

function buildDoc (repo, doc) {
// incorporate the information in the database into the html document


	if (sections.vertical_text) buildSection(sections.vertical_text,'vertical_text', doc, repo)
	if (sections.bidirectional_text) buildSection(sections.bidirectional_text,'bidi_text', doc, repo)

	if (sections.characters_and_encoding) buildSection(sections.characters_and_encoding,'charset', doc, repo)
	if (sections.fonts) buildSection(sections.fonts,'fonts', doc, repo)
	if (sections.font_styles_weight_etc) buildSection(sections.font_styles_weight_etc,'font_style', doc, repo)
	if (sections.glyph_shaping_positioning) buildSection(sections.glyph_shaping_positioning,'glyphs', doc, repo)
	if (sections.cursive) buildSection(sections.cursive,'cursive', doc, repo)
	if (sections.transforming_characters) buildSection(sections.transforming_characters,'transforms', doc, repo)
	if (sections.baselines_line_height_etc) buildSection(sections.baselines_line_height_etc,'baselines', doc, repo)
	if (sections.grapheme_word_segmentation) buildSection(sections.grapheme_word_segmentation,'segmentation', doc, repo)
	if (sections.inline_features_punctuation) buildSection(sections.inline_features_punctuation,'punctuation_etc', doc, repo)
	if (sections.text_decoration) buildSection(sections.text_decoration,'text_decoration', doc, repo)
	if (sections.quotations) buildSection(sections.quotations,'quotations', doc, repo)
	if (sections.inline_notes_annotations) buildSection(sections.inline_notes_annotations,'inline_notes', doc, repo)
	if (sections.data_formats_numbers) buildSection(sections.data_formats_numbers,'data_formats', doc, repo)

	if (sections.line_breaking) buildSection(sections.line_breaking,'line_breaking', doc, repo)
	if (sections.hyphenation) buildSection(sections.hyphenation,'hyphenation', doc, repo)
	if (sections.text_align_justification) buildSection(sections.text_align_justification,'justification', doc, repo)
	if (sections.letter_spacing) buildSection(sections.letter_spacing,'spacing', doc, repo)
	if (sections.lists_counters_etc) buildSection(sections.lists_counters_etc,'lists', doc, repo)
	if (sections.styling_initials) buildSection(sections.styling_initials,'initials', doc, repo)

	if (sections.page_layout_progression) buildSection(sections.page_layout_progression,'page_layout', doc, repo)
	if (sections.footnotes_endnotes_etc) buildSection(sections.footnotes_endnotes_etc,'footnotes_etc', doc, repo)
	if (sections.page_headers_footers_etc) buildSection(sections.page_headers_footers_etc,'headers_footers', doc, repo)
	if (sections.forms_user_interaction) buildSection(sections.forms_user_interaction,'interaction', doc, repo)
	}


function buildSection (theData, sectionId, doc, repo) {
	if (debug) console.log('sectionID',sectionId, 'doc',doc, 'repo',repo)
	var labelSet = new Set([])
	var out = ''
	for (let i=0;i<theData.length;i++) {
		// screen out issues that don't relate to the current gap-analysis document
		rightDoc = false
		for (l=0;l<theData[i].labels.length;l++) if (theData[i].labels[l].name === doc) rightDoc = true

		if (rightDoc) {
			// find priority labels
            var issueLabelSet = new Set([])
			for (l=0;l<theData[i].labels.length;l++) {
                issueLabelSet.add(theData[i].labels[l].name)
                labelSet.add(theData[i].labels[l].name)
                }

			out += '<section id="issue'+theData[i].number+'_'+sectionId+'">\n'
			out += '<h4>#'+theData[i].number+' '+theData[i].title+'</h4>\n'
			out += `<p class="ghLink">`
            
             	// figure out priority for this issue
                var priority = ''
                if (issueLabelSet.has('p:basic')) priority = 'basic'
                else if (issueLabelSet.has('p:advanced')) priority = 'advanced'
                else if (issueLabelSet.has('p:broken')) priority = 'broken'
                else if (issueLabelSet.has('p:ok')) priority = 'ok'
            
           out += `<a target="_blank" href="https://github.com/w3c/${ repo }/issues/${ theData[i].number }" class="issueLink ${ priority+'Issue'}">GitHub issue #${ theData[i].number }</a></p>`
            


			out += '<p>'

			var body = theData[i].body

			// make GH img markup point to local image
			function convertFromImg(str, p1, p2, s) {
                var imgContainer = document.createElement( 'img' )
                imgContainer.innerHTML = str+'>'
                var src = imgContainer.firstChild.src
                var width = imgContainer.firstChild.width
                var alt = imgContainer.firstChild.alt
                var path = src.split('/')
                var filename = path[path.length-1]
                
                var out = `<img src="images/${ path[path.length-1] }" width="${ width }" alt="${ alt }"`
				return out
				}
			var test = /<img ([^>]+)/g
			body = body.replace(test, convertFromImg)

			// make GH images into img element
			function convertToImg(str, p1, p2, s) {
                path = p2.split('/')
                p2 = 'images/'+path[path.length-1]
                console.log('p2',p2)
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

			// create convert bold segments links
			function convertbold(str, p1, s) {
				p1 = p1.replace(/\*\*/g,'')
				p1 = p1.replace(/\*\*/g,'')
				return '<strong>'+p1+'</strong>'
				}
			test = /\*\*([^\*]+)\*\*/g
			body = body.replace(test, convertbold)

			// replace ### headings with markup
			function convertheading(str, p1, s) {
                //console.log("str",str)
                //console.log("p1",p1)
				p1 = p1.replace(/\#\#\#/,'')
				return '<h5>'+p1+'</h5>'
				}
			test = /###([^\n]+?)\n/g
			body = body.replace(test, convertheading)

			// create convert italic segments links
			//function convertitalic(str, p1, s) {
			//	p1 = p1.replace(/_/g,'')
			//	p1 = p1.replace(/_/g,'')
			//	return '<em>'+p1+'</em>'
			//	}
			//test = /_([^\_]+)_/g
			//body = body.replace(test, convertitalic)

			// convert unordered lists to markup
			function convertlists(str, initial, startMarkup, endMarkup) {
				var lines = body.split('\n')
				inList = false
				for (let l=0;l<lines.length;l++) {
					if (lines[l].startsWith(initial) && inList) lines[l] = '<li>'+lines[l].substring(1)+'</li>'
					else if (lines[l].startsWith(initial)) {
						inList = true
						lines[l] = startMarkup+'<li>'+lines[l].substring(1)+'</li>'
						}
					else if (! lines[l].startsWith(initial) && inList) {
						inList = false
						lines[l] = endMarkup+lines[l]
						}
					else {
						inList = false
						}
					}
				return lines.join('\n')
				}

			body = convertlists(body, '-', '<ul>', '</ul>')
			body = body.replace(/\n\d+\./g, '\n§')
			body = convertlists(body, '§', '<ol>', '</ol>')

			// convert quoted text to blockquote
			function convertquotes(str, initial) {
				var lines = body.split('\n')
				inList = false
				for (let l=0;l<lines.length;l++) {
					if (lines[l].startsWith(initial) && inList) lines[l] = lines[l].substring(1)+'<br>'
					else if (lines[l].startsWith(initial)) {
						inList = true
						lines[l] = '<blockquote>'+lines[l].substring(1)+'<br>'
						}
					else if (! lines[l].startsWith(initial) && inList) {
						inList = false
						lines[l] = '</blockquote>'+lines[l]
						}
					else inList = false
					}
				return lines.join('\n')
				}

			body = convertquotes(body, '>')

			// remove blank p markup
			test = /<p><\/p>/g
			body = body.replace(test,'')

			// split into paragraphs
			out += body.replace(/\r\n\r\n/g,'</p><p>')
			out += '</p>\n'
			out += '</section>\n'
			}
		}

    if (document.getElementById('insert-'+sectionId))           document.getElementById('insert-'+sectionId).innerHTML = out
    else (console.log(`⏵⏵⏵ ERROR in buildSection: can't find section with id insert-${ sectionId }`))

	// figure out priority for section
	var priority = document.getElementById(sectionId).className
	if (labelSet.has('p:basic')) priority = 'basic'
	else if (labelSet.has('p:advanced')) priority = 'advanced'
	else if (labelSet.has('p:broken')) priority = 'broken'
	else if (labelSet.has('p:ok')) priority = 'ok'
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

	if (debug) console.log(summary)
	}




function printSummary (tentative) {
// creates the summary at the bottom of the page that is copy/pasted into the language matrix data
// tentative is false for work in progress in a group, true for pages done by individuals

	var out = ''
	for (let i=0;i<respecConfig.langs.length;i++) {
		out += '{lang: "'+respecConfig.langs[i]+'"'
		out += ', url:"'+respecConfig.gapDocPath+'"'
		out += ', tentative:' + tentative
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

		if (debug) console.log(summary)

		out = out.replace(/tbd/g,'')
		out = out.replace(/broken/g,'0')
		out = out.replace(/ok/g,'3')
		out = out.replace(/advanced/g,'2')
		out = out.replace(/basic/g,'1')
		out = out.replace(/"na/g,'"-')
	}
	document.getElementById('summaryPlaceholder').textContent = out
	}
