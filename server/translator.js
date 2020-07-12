/*
 * Author: Justin Nichols
 * Class: CSC337
 * Purpose: This server provides a basic translation service.
 */

const express = require('express')
const fs = require('fs')
const readline = require('readline')
const app = express()
const host = '127.0.0.1'
const port = 3000

const lang2Abbr = {
  "English":"e",
  "German": "g",
  "Spanish": "s"
}

e2g = {};
e2s = {};
g2e = {};
s2e = {};

buildOrigTranslations('./Spanish.txt', e2s, s2e);
buildOrigTranslations('./German.txt', e2g, g2e);

/*
 * This function builds the dictionaries that will store translation info.
 * @param trans_fname, a string. The name of a translations file.
 * @param orig2for, a string. The name of a mapping from original language to foreign langauge.
 * @param for2orig, a string. The name of a mapping from foreign language to original language.
 */
async function buildOrigTranslations(trans_fname, orig2for, for2orig) {
  const rl = readline.createInterface({
    input: fs.createReadStream(trans_fname),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (line.startsWith('#')) { continue; }
    let words = line.split('\t');
    if (words.length < 2) { continue; }
    var orig = words[0].toLowerCase();
    var foreign = words[1].toLowerCase();
    let delim = foreign.search('[^a-z ]');
    foreign = delim == -1 ? foreign : foreign.substring(0, delim);
    orig2for[orig] = foreign;
    for2orig[foreign] = orig; 
  }
}

/*
 * This function translates the input-string.
 * @param: origLang, a string. The original language of the input-string.
 * @param: foreignLang, a string. The language that the input-string will be 
 *  translated to.
 * @param: origText, a string. This is the input-string.
 */
function translate(origLang, foreignLang, origText) {
  origText = origText.split(' ');
  var translation = "";
  var foreign;
  origText.forEach(word => {
    word = word.toLowerCase();
    if (origLang == "German" && foreignLang == "Spanish") {
      let eng = g2e[word];
      foreign = e2s[eng]; 
    } else if (origLang == "Spanish" && foreignLang == "German") {
      let eng = s2e[word];
      foreign = e2g[eng];
    } else {
      let orig2for = `${lang2Abbr[origLang]}2${lang2Abbr[foreignLang]}`;
      foreign = eval(orig2for)[word];
    }
    translation += foreign + ' ';
    })
  return translation;
}

app.use(express.static('public_html'))

app.get('/translate/:origLang/:foreignLang/:origText', (req, res) => {
  let translated = translate(req.params.origLang, req.params.foreignLang, 
    req.params.origText);
  res.send(translated);
})

app.listen(port, () => console.log('App listening.'))
