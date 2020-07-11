
function translate() {
  let origText = document.getElementById("orig-text").value;
  let url='translate/' + origText;

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

  httpRequest.open('GET', url);
  httpRequest.send();
}
