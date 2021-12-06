var modal = document.getElementById('id01');

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function modalClick(display) {
  modal.style.display = display;
}

