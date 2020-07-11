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
 * This function translates a string.
 * @param: orig, a string. The string to be translated.
 * @param: orig2for, a dict. The mapping between original words and translated words.
 */
function translate(orig, orig2for) {
  orig = orig.split(' ');
  var translation = "";
  var foreign;
  orig.forEach(item => {
    item = item.toLowerCase();
    if (orig2for == 'g2s') {
      let eng = g2e[item];
      foreign = e2s[eng]; 
    } else if (orig2for == 's2g') {
      let eng = s2e[item];
      foreign = e2g[eng];
    } else {
      foreign = eval(orig2for)[item];
    }
    translation += foreign + ' ';
    })
  return translation;
}

app.use(express.static('public_html'))

app.get('/translate/:origText', (req, res) => {
  let translated = translate(req.params.origText, e2s);
  res.send(translated);
})

app.listen(port, () => console.log('App listening.'))
