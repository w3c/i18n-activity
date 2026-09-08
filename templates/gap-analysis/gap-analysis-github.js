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


	if (sections.writing_mode) buildSection(sections.writing_mode,'writing_mode', doc, repo)
	if (sections.bidi_text) buildSection(sections.bidi_text,'bidi_text', doc, repo)

	if (sections.fonts) buildSection(sections.fonts,'fonts', doc, repo)
	if (sections.glyphs) buildSection(sections.glyphs,'glyphs', doc, repo)
	if (sections.cursive) buildSection(sections.cursive,'cursive', doc, repo)
	if (sections.letterforms) buildSection(sections.letterforms,'letterforms', doc, repo)
	if (sections.transforms) buildSection(sections.transforms,'transforms', doc, repo)
	if (sections.data_formats) buildSection(sections.data_formats,'data_formats', doc, repo)

    if (sections.encoding) buildSection(sections.encoding,'encoding', doc, repo)
	if (sections.segmentation) buildSection(sections.segmentation,'segmentation', doc, repo)

	if (sections.punctuation_etc) buildSection(sections.punctuation_etc,'punctuation_etc', doc, repo)
	if (sections.quotations) buildSection(sections.quotations,'quotations', doc, repo)
	if (sections.emphasis) buildSection(sections.emphasis,'emphasis', doc, repo)
	if (sections.abbrev) buildSection(sections.abbrev,'abbrev', doc, repo)
	if (sections.inline_notes) buildSection(sections.inline_notes,'inline_notes', doc, repo)
	if (sections.text_decoration) buildSection(sections.text_decoration,'text_decoration', doc, repo)

	if (sections.line_breaking) buildSection(sections.line_breaking,'line_breaking', doc, repo)
	if (sections.justification) buildSection(sections.justification,'justification', doc, repo)
	if (sections.spacing) buildSection(sections.spacing,'spacing', doc, repo)
	if (sections.baselines) buildSection(sections.baselines,'baselines', doc, repo)
	if (sections.lists) buildSection(sections.lists,'lists', doc, repo)
	if (sections.initials) buildSection(sections.initials,'initials', doc, repo)

	if (sections.page_layout) buildSection(sections.page_layout,'page_layout', doc, repo)
	if (sections.grids_tables) buildSection(sections.grids_tables,'grids_tables', doc, repo)
	if (sections.footnotes_etc) buildSection(sections.footnotes_etc,'footnotes_etc', doc, repo)
	if (sections.headers_footers) buildSection(sections.headers_footers,'headers_footers', doc, repo)
	if (sections.interaction) buildSection(sections.interaction,'interaction', doc, repo)
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
            
            //console.log('issueLabelSet', issueLabelSet)
            
            priorityValue = 0 // used to catch information by language below
            
            // figure out priority for this issue
            var priority = ''
            if (issueLabelSet.has('p:basic')) { priority = 'basic'; priorityValue = 1 }
            else if (issueLabelSet.has('p:advanced')) { priority = 'advanced'; priorityValue = 2 }
            else if (issueLabelSet.has('p:broken')) { priority = 'broken'; priorityValue = 0 }
            else if (issueLabelSet.has('p:ok')) { priority = 'ok'; priorityValue = 3 }
            
           out += `<a target="_blank" href="https://github.com/w3c/${ repo }/issues/${ theData[i].number }" class="issueLink ${ priority+'Issue'}">GitHub issue #${ theData[i].number }</a></p>`
           

           // make a list of languages and scores
           var languageScores = []
           labellist = [... issueLabelSet]

            for (q=0;q<labellist.length;q++) {
                if (labellist[q].startsWith('l:')) {
                    languageScores.push([labellist[q]])
                    }
                }
       
           
           
           out += `<p class="languageData">Languages: <span class="relevantLanguages">${ languageScores.join(' ').replace(/l:/g,'') }</span> <span class="issueScore">${ priorityValue }</span></p>`


			out += '<p>'

			var body = theData[i].body

			// make GH img markup point to local image
			function convertFromImg(str, p1, p2, s) {
                var imgContainer = document.createElement( 'img' )
                imgContainer.innerHTML = str+'>'
                var src = imgContainer.firstChild.src
                var width = imgContainer.firstChild.width
                var alt = imgContainer.firstChild.alt
                var ext = imgContainer.firstChild.dataset.ext ? imgContainer.firstChild.dataset.ext : ''
                var path = src.split('/')
                var filename = path[path.length-1]
                
                var out = `<img src="images/${ path[path.length-1]+ext }" width="${ width }" alt="${ alt }"`
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
			//out += body.replace(/\r\n\r\n/g,'</p><p>')
			out += body.replace(/\n\n/g,'</p><p>')
			out += '</p>\n'
			out += '</section>\n'
			}
		}

    if (document.getElementById('insert-'+sectionId)) document.getElementById('insert-'+sectionId).innerHTML = out
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

	summary.writing_mode = document.getElementById('writing_mode').className
	summary.bidi_text = document.getElementById('bidi_text').className

	summary.encoding = document.getElementById('encoding').className
	summary.fonts = document.getElementById('fonts').className
	summary.letterforms = document.getElementById('letterforms').className
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



function getDataLine (topic, lang) {
    // condenses scores for individual languages to be used by printSummary
    // topic is a pointer to a section in the document
    
    if (typeof topic === 'undefined') return ''
    
    var langDatas = topic.querySelectorAll('.relevantLanguages')
    if (typeof langDatas === 'undefined' || langDatas.length === 0) {
        if (topic.classList.contains('na') || topic.classList.contains('ok')) return '-'
        else return ''
        }
    var langScores = topic.querySelectorAll('.issueScore')
    
    //console.log('topic',topic.textContent)
    //console.log('langDatas',langDatas)
    //console.log('langScores',langScores)
    
    latest = 10
    for (i=0;i<langDatas.length;i++) {
        if (langDatas[i].textContent.includes(lang)) {
            if (parseInt(langScores[i].textContent) < latest) {
                latest = parseInt(langScores[i].textContent)
                }
            }
        }

    if (latest === 10) latest = '-'
    //console.log('latest',latest)
    return latest
    }







function printSummary (tentative) {
// creates the summary at the bottom of the page that is copy/pasted into the language matrix data
// tentative is false for work in progress in a group, true for pages done by individuals

	var out = ''
	for (let i=0;i<respecConfig.langs.length;i++) {
		out += '{lang: "'+respecConfig.langs[i]+'"'
		out += ', url:"'+respecConfig.gapDocPath+'"'
		out += ', tentative:' + tentative
		out += `, writing_mode:"${ getDataLine(document.getElementById('writing_mode'), respecConfig.langTags[i]) }"`
		out += `, bidi_text:"${ getDataLine(document.getElementById('bidi_text'), respecConfig.langTags[i]) }"`

		out += `, fonts:"${ getDataLine(document.getElementById('fonts'), respecConfig.langTags[i]) }"`
		out += `, glyphs:"${ getDataLine(document.getElementById('glyphs'), respecConfig.langTags[i]) }"`
		out += `, cursive:"${ getDataLine(document.getElementById('cursive'), respecConfig.langTags[i]) }"`
		out += `, letterforms:"${ getDataLine(document.getElementById('letterforms'), respecConfig.langTags[i]) }"`
		out += `, transforms:"${ getDataLine(document.getElementById('transforms'), respecConfig.langTags[i]) }"`

		out += `, encoding:"${ getDataLine(document.getElementById('encoding'), respecConfig.langTags[i]) }"`
		out += `, segmentation:"${ getDataLine(document.getElementById('segmentation'), respecConfig.langTags[i]) }"`

		out += `, punctuation_etc:"${ getDataLine(document.getElementById('punctuation_etc'), respecConfig.langTags[i]) }"`
		out += `, quotations:"${ getDataLine(document.getElementById('quotations'), respecConfig.langTags[i]) }"`
		out += `, emphasis:"${ getDataLine(document.getElementById('emphasis'), respecConfig.langTags[i]) }"`
		out += `, abbrev:"${ getDataLine(document.getElementById('abbrev'), respecConfig.langTags[i]) }"`
		out += `, inline_notes:"${ getDataLine(document.getElementById('inline_notes'), respecConfig.langTags[i]) }"`
		out += `, text_decoration:"${ getDataLine(document.getElementById('text_decoration'), respecConfig.langTags[i]) }"`
		out += `, data_formats:"${ getDataLine(document.getElementById('data_formats'), respecConfig.langTags[i]) }"`

		out += `, line_breaking:"${ getDataLine(document.getElementById('line_breaking'), respecConfig.langTags[i]) }"`
		out += `, justification:"${ getDataLine(document.getElementById('justification'), respecConfig.langTags[i]) }"`
		out += `, spacing:"${ getDataLine(document.getElementById('spacing'), respecConfig.langTags[i]) }"`
		out += `, baselines:"${ getDataLine(document.getElementById('baselines'), respecConfig.langTags[i]) }"`
		out += `, lists:"${ getDataLine(document.getElementById('lists'), respecConfig.langTags[i]) }"`
		out += `, initials:"${ getDataLine(document.getElementById('initials'), respecConfig.langTags[i]) }"`

		out += `, page_layout:"${ getDataLine(document.getElementById('page_layout'), respecConfig.langTags[i]) }"`
		out += `, grids_tables:"${ getDataLine(document.getElementById('grids_tables'), respecConfig.langTags[i]) }"`
		out += `, footnotes_etc:"${ getDataLine(document.getElementById('footnotes_etc'), respecConfig.langTags[i]) }"`
		out += `, headers_footers:"${ getDataLine(document.getElementById('headers_footers'), respecConfig.langTags[i]) }"`
		out += `, interaction:"${ getDataLine(document.getElementById('interaction'), respecConfig.langTags[i]) }"`
		out += '},\n'

		if (debug) console.log('SUMMARY', summary)

		out = out.replace(/tbd/g,'')
		out = out.replace(/broken/g,'0')
		out = out.replace(/ok/g,'3')
		out = out.replace(/advanced/g,'2')
		out = out.replace(/basic/g,'1')
		out = out.replace(/"na/g,'"-')
	}
	document.getElementById('summaryPlaceholder').textContent = out
	document.getElementById('summaryPlaceholder').style.display = 'block'
	}
