// prompts will be inserted into the title attributes of various headers after page upload


contentPrompts = {
'writing_mode':'In what direction does text flow along a line and across a page? (If the basic direction is right-to-left see [[[#bidi_text]]].)  If the script uses vertically oriented text, what are the requirements? What about if you mix vertical text with scripts that are normally only horizontal? Do you need a switch to use different characters in vertical vs. horizontal text? Does the browser support short runs of horizontal text in vertical lines (tate-chu-yoko in Japanese) as expected? Is the orientation of characters and the directional ordering of characters supported as needed?',

'bidi_text':'If the general inline direction is right-to-left, are there any issues when handling that? Where the inline direction of text is mixed, is this bidirectional text adequately supported? What about numbers and expressions? Do the Unicode bidi controls and HTML markup provide the support needed? Is isolation of directional runs problematic?',

"encoding":'Most languages are now supported by Unicode, but there are still occasional issues. In particular, there may be issues related to ordering of characters, or competing encodings (as in Myanmar), or standardisation of variation selectors or the encoding model (as in Mongolian). Are there any character repertoire issues preventing use of this script on the Web? Do variation selectors need attention? Are there any other encoding-related issues?',

"fonts":'How are fonts grouped into recognisable writing styles? How is each writing style used? Do the standard fallback fonts used in browsers (eg. serif, sans-serif, cursive, etc.) match expectations? Or are additional generic font styles needed? Are special font or OpenType features needed for this script that are not available?  What other general, font-related issues arise? The font styles described here refer to alternative types of writing style, such as naskh vs nastaliq; for oblique, italic, and weights see instead [[[#letterforms]]].',

"letterforms":'This covers ways of modifying the glyphs for a range of text, such as for italicisation, bolding, oblique, etc. Are italicisation, bolding, oblique, etc relevant? Do italic fonts lean in the right direction? Is synthesised italicisation or oblique problematic? Are there other problems relating to bolding or italicisation - perhaps relating to generalised assumptions of applicability? For alternative writing/font styles, see [[[#fonts]]].',

"glyphs":'If context-sensitive rendering support is needed to shape combinations of letters or position certain glyphs relative to others, is this adequately provided for? Does the script in question require additional user control features to support alterations to the position or shape of glyphs, for example adjusting the distance between the base text and diacritics, or changing the glyphs used in a systematic way? Do you need to be able to compose/decompose conjuncts or ligatures, or show characters that are otherwise hidden, etc? If text is cursive, see the separate section [[[#cursive]]].',

"cursive":'If this script is cursive (ie. letters are generally joined up, like in Arabic, N’Ko, Syriac, etc), are there problems or needed features related to the handling of cursive text? Do cursive links break if parts of a word are marked up or styled? Do Unicode joiner and non-joiner characters behave as expected?',

"transforms":'Does your script need special text transforms that are not supported? For example, do you need to to convert between half-width and full-width presentation forms? Does your script convert letters to uppercase, capitalised and lowercase alternatives according to your typographic needs? How about other transforms?',

"segmentation":'This is about how text is divided into graphemes, words, sentences, etc., and behaviour associated with that. Are there special requirements for the following operations: forwards/backwards deletion, cursor movement & selection, character counts, searching & matching, text insertion, line-breaking, justification, case conversions, sorting? Are words separated by spaces, or other characters? Are there special requirements when double-clicking or triple-clicking on the text? Are words hyphenated?  (Some of the answers to these questions may be picked up in other sections, such as [[[#line_breaking]]], or [[[#initials]]].)',

"punctuation_etc":'What characters are used to indicate the boundaries of phrases, sentences, and sections? What about other punctuation, such as dashes, connectors, separators, etc? Are there specific problems related to punctuation or the interaction of the text with punctuation (for example, punctuation that is separated from preceding text but must not be wrapped alone to the next line)? Are there problems related to bracketing information or demarcating things such as proper nouns, etc? Some of these topics have their own sections; see also [[[#quotations]]], and [[[#abbrev]]].',

"text_decoration": 'This section is a catch-all for inline features that don\'t fit under the previous sections.  It can also be used to describe in one place a set of general requirements related to inline features when those features appear in more than one of the sections above. It covers characters or methods (eg. text decoration) that are used to convey information about a range of text. Are all needed forms of highlighting or marking of text available, such as wavy underlining, numeric overbars, etc.  If lines are drawn alongside, over or through the text, do they need to be a special distance from the text itself? Is it important to skip characters when underlining, etc? How do things change for vertically set text? Are there other punctuation marks that were not covered in preceding sections? Are lines correctly drawn relative to vertical text?',

"quotations": 'This is a subtopic of phrase & section boundaries that is worth handling separately. What characters are used to indicate quotations? Do quotations within quotations use different characters? What characters are used to indicate dialogue? Are the same mechanisms used to cite words, or for scare quotes, etc? What about citing book or article names? Are there any issues when dealing with quotations marks, especially when nested? Should block quotes be indented or handled specially? Do quotation marks take text direction into account appropriately?',

"emphasis": 'How are emphasis and highlighting achieved? If lines or marks are drawn alongside, over or through the text, do they need to be a special distance from the text itself? Is it important to skip characters when underlining, etc? How do things change for vertically set text?',

"abbrev": 'What characters or other methods are used to indicate abbreviation, ellipsis & repetition? Are there problems?',

"inline_notes": 'What mechanisms, if any, are used to create *inline* notes and annotations?  Are the appropriate methods for inline annotations supported for this script? The ruby spec currently specifies an initial subset of requirements for fine-tuning the typography of phonetic and semantic annotations of East Asian text, including furigana, pinyin and zhuyin fuhao systems.  Is it adequate for what it sets out to do?  What other controls will be needed in the future? What about other types of inline annotation, such as warichu? This section deals with <em>inline</em> annotation approaches. For annotation methods where a marker in the text points out to another part of the document see [[[#footnotes_etc]]].',

"data_formats": 'Relevant here are formats related to number, currency, dates, personal names, addresses, and so forth. If the script has its own set of number digits, are there any issues in how they are used? Does the script or language use special format patterns that are problematic (eg. 12,34,000 in India)? What about date/time formats and selection - and are non-Gregorian calendars needed?  Do percent signs and other symbols associated with number work correctly, and do numbers need special decorations, (like in Ethiopic or Syriac)? How about the management of personal names, addresses, etc. in web pages: are there issues?',

"line_breaking": 'Does the browser capture the rules about the way text in your script wraps when it hits the end of a line? Does line-breaking wrap whole \'words\' at a time, or characters, or something else (such as syllables in Tibetan and Javanese)?  What characters should not appear at the end or start of a line, and what should be done to prevent that? Is hyphenation used for your script, or something else? If hyphenation is used, does it work as expected? (Note, this is about line-end hyphenation when text is wrapped, rather than use of the hyphen and related characters as punctuation marks.)',

"hyphenation": 'Is hyphenation used for your script, or something else? If hyphenation is used, does it work as expected? (Note, this is about line-end hyphenation when text is wrapped, rather than use of the hyphen and related characters as punctuation marks.)',

"justification": 'When text in a paragraph needs to have flush lines down both sides, does it follow the rules for your script? Does the script need assistance to conform to a grid pattern? Does your script allow punctuation to hang outside the text box at the start or end of a line? Where adjustments are need to make a line flush, how is that done? Do you shrink/stretch space between words and/or letters? Are word baselines stretched, as in Arabic? What about paragraph indents, or the need for logical alignment keywords, such as start/end, rather than left/right? Does the script indent the first line of a paragraph?',

"spacing": 'This section is concerned with spacing that is adjusted around and between characters on a line in ways other than attempts to fit text to a given width (ie. justification). Some scripts create emphasis or other effects by spacing out the words, letters or syllables in a word. Are there requirements for this script/language that are unsupported? If spacing needs to be applied between letters and numbers, is that possible? What about space associated with punctuation, such as the gap before a colon in French? (For justification related spacing, see [[[#justification]]].)',

"baselines":'Does the browser support requirements for baseline alignment between mixed scripts and in general? Are there issues related to line height or inter-line spacing, etc.? Are the requirements for baseline or line height in vertical text covered?',

"lists": 'Are there list or other counter styles in use? If so, what is the format used and can that be achieved? Are the correct separators available for use after list counters? Are there other aspects related to counters and lists that need to be addressed? Are list counters handled correctly in vertical text?',

"initials": 'Does the browser or ereader correctly handle special styling of the initial letter of a line or paragraph, such as for drop caps or similar? How about  the size relationship between the large letter and the lines alongside? where does the large letter anchor relative to the lines alongside? is it normal to include initial quote marks in the large letter? is the large letter really a syllable? etc. Are all of these things working as expected?',



"page_layout": 'How are the main text area and ancillary areas positioned and defined? Are there any special requirements here, such as dimensions in characters for the Japanese kihon hanmen? The book cover for scripts that are read right-to-left scripts is on the right of the spine, rather than the left. Is that provided for? When content can flow vertically and to the left or right, how do you specify the location of objects, text, etc. relative to the flow? For example, keywords \'left\' and \'right\' are likely to need to be reversed for pages written in English and page written in Arabic. Do tables and grid layouts work as expected? How do columns work in vertical text? Can you mix block of vertical and horizontal text correctly? Does text scroll in the expected direction? Other topics that belong here include any local requirements for things such as printer marks, tables of contents and indexes. See also [[[#grids_tables]]].',

"grids_tables": 'As a subtopic of page layout, does the script have special requirements for character grids or for tables?',

"footnotes_etc": 'Does your script have special requirements for footnotes, endnotes or other necessary annotations of this kind in the way needed for your culture? (See [[[#inline_notes]]] for purely inline annotations, such as ruby or warichu. This section is more about annotation systems that separate the reference marks and the content of the notes.)',

"headers_footers": 'Are there special conventions for page numbering, or the way that running headers and the like are handled?',

"interaction": 'Are vertical form controls well supported? In right-to-left scripts, is it possible to set the base direction for a form field? Is the scroll bar on the correct side? etc. Are there other aspects related to user interaction that need to be addressed?',






}


function addPrompts () {
	// adds text for prompts
	
	var nodes = document.querySelectorAll('.promptStub')
	for (let i=0;i<nodes.length;i++) nodes[i].innerHTML = contentPrompts[nodes[i].id.replace(/^prompt-/,'')]
	}





































function setContentPrompts () {
	if (contentPrompts) {
		for (prompt in contentPrompts) {
			 if (document.getElementById(prompt)) document.getElementById(prompt).title = contentPrompts[prompt]
			 }
		}
	}
