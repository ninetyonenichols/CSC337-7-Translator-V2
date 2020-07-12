/*
 * Author: Justin Nichols
 * Class: CSC337
 * Purpose: Provides translated text whenever user-input is received.
 */

const lang2Abbr = {
  "English":"e",
  "German":"g",
  "Spanish":"s"
}

/*
 * Provides translated text whenever user-input is received
 */
function translate() {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    alert('Error: XMLHttpRequest module not supported.');
    return false;
  }

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        document.getElementById("foreign-text").value = httpRequest.responseText;
      } else {
        alert(`Error: status ${httpRequest.status}`);
      }
    }
  };

  // creating the url
  let origText = document.getElementById("orig-text").value;
  let origSel = document.getElementById("orig-lang");
  let origLang = origSel.options[origSel.selectedIndex].value;
  let origAbbr = lang2Abbr[origLang];
  let foreignSel = document.getElementById("foreign-lang");
  let foreignLang = foreignSel.options[foreignSel.selectedIndex].value;
  let foreignAbbr = lang2Abbr[foreignLang];
  let transDict = `${origAbbr}2${foreignAbbr}`;
  let url=`translate/${transDict}/${origText}`;

  httpRequest.open('GET', url);
  httpRequest.send();
}
