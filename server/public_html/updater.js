/*
 * Author: Justin Nichols
 * Class: CSC337
 * Purpose: Provides translated text whenever user-input is received.
 */

/*
 * Provides translated text whenever user-input is received
 */
function translate() {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    alert('Error!');
    return false;
  }

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        document.getElementById("foreign-text").value = httpRequest.responseText;
      } else {
        alert('Error!');
      }
    }
  };

  // creating the url
  let origText = document.getElementById("orig-text").value;
  let origSel = document.getElementById("orig-lang");
  let origLang = origSel.options[origSel.selectedIndex].value;
  let foreignSel = document.getElementById("foreign-lang");
  let foreignLang = foreignSel.options[foreignSel.selectedIndex].value;
  let url=`translate/${origLang}/${foreignLang}/${origText}`;

  httpRequest.open('GET', url);
  httpRequest.send();
}
