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

buildTranslations('./Spanish.txt', e2s, s2e);
buildTranslations('./German.txt', e2g, g2e);

/*
 * This function builds the dictionaries that will store translation info.
 * @param trans_fname, a string. The name of a translations file.
 * @param orig2for, a string. The name of a mapping from original language to foreign langauge.
 * @param for2orig, a string. The name of a mapping from foreign language to original language.
 */
async function buildTranslations(trans_fname, orig2for, for2orig) {
  const rl = readline.createInterface({
    input: fs.createReadStream(trans_fname),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (line.startsWith('#')) { continue; }
    let words = line.split('\t');
    if (words.length < 2) { continue; }
    var orig = words[0].toLowerCase();
    var foreign = words[1].trim().toLowerCase();
    let delim = foreign.search('[^a-z ]');
    foreign = delim == -1 ? foreign : foreign.substring(0, delim);
    foreign = foreign.trim();
    orig2for[orig] = foreign;
    for2orig[foreign] = orig;
  }
}

/*
 * This function translates the input-string.
 * @param: transDict, a string. The name of the translation-dictionary.
 * @param: origText, a string. This is the input-string.
 */
function translate(transDict, origText) {
  if (transDict[0] == transDict[2]) { return origText }
  origText = origText.split(' ');
  var translation = "";
  var foreign;
  var eng;

  origText.forEach(word => {
    if (word == "" || word == "\s") { 
      translation += " ";  
      return;
    }
    word = word.toLowerCase();
    eng;
    switch (transDict) {
      case "g2s":
        eng = g2e[word];
        foreign = e2s[eng]; 
        break;
      case "s2g":
        eng = s2e[word];
        foreign = e2g[eng];
        break;
      default:
        foreign = eval(transDict)[word];
    }
    foreign = (foreign) ? foreign : "?";
    translation += foreign + ' ';
  })
  return translation;
}

// routes
app.use(express.static('public_html'))

app.get('/translate/:transDict/', (req, res) => {
  res.send("");
}) 

app.get('/translate/:transDict/:origText', (req, res) => {
  res.send(translate(req.params.transDict, req.params.origText));
})

app.all('*', (req, res) => res.send("Invalid url."));

app.listen(port, () => console.log('App listening.'))
