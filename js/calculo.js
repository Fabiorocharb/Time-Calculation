let resultado = document.getElementById("resultado");
let enviar = document.getElementById("enviar");

function calc() {
  let dia = Number(document.getElementById("dia").value);
  let sono = Number(document.getElementById("sono").value);
  let trabalho = Number(document.getElementById("trabalho").value);
  let almoco = Number(document.getElementById("almoco").value);

  let disponivel = dia - (sono + trabalho + almoco);
  resultado.innerHTML = disponivel;
}

enviar.addEventListener("click", function (e) {
  e.preventDefault();
  calc();
});
