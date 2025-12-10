// static/js/cheems.js
document.addEventListener("DOMContentLoaded", () => {

    // Guardar ganador
    document.getElementById("btn-save").addEventListener("click", saveWinner);

    // Variables de juego
    let randomNumber = 0;
    const images = document.querySelectorAll(".cheems-card img");
    const clickedCards = new Set();
    let gameOver = false;
    let attempts = 0;

    const attemptsSpan = document.getElementById("attempts");
    const restartBtn = document.getElementById("btn-restart");

    // Inicializa o reinicia el juego
    function initGame() {
       
        randomNumber = Math.floor(Math.random() * 14) + 1;

        // Reiniciar estado
        clickedCards.clear();
        gameOver = false;

        // Voltear todas las cartas a la imagen de pregunta
        images.forEach((img) => {
            img.src = window.IMG_QUESTION;
        });

        console.debug("Cheems:", randomNumber);
    }

    // Handler para reiniciar (sin recargar la página)
    restartBtn.addEventListener("click", () => {
        attempts += 1;
        if (attemptsSpan) attemptsSpan.textContent = attempts;
        initGame();
    });

    // Inicialización primera vez
    initGame();

    // Manejo de clicks sobre cartas
    images.forEach((img, index) => {

        const id = index + 1;
        img.dataset.id = id;

        img.addEventListener("click", () => {

            // Si ya terminó la partida, no permitir más clicks hasta reiniciar
            if (gameOver) return;

            // Si ya se había clickeado esa carta, ignorar
            if (!clickedCards.has(id)) {
                clickedCards.add(id);
            } else {
                return; // ya descubierto
            }

            if (id == randomNumber) {
                // Perdió: mostrar imagen mala y destapar las demás
                img.src = window.IMG_BAD;

                images.forEach((otherImg, otherIndex) => {
                    const otherId = otherIndex + 1;
                    if (otherId != randomNumber) {
                        otherImg.src = window.IMG_OK;
                    }
                });

                gameOver = true;
                alert("Perdiste");
            } else {
                // Carta correcta
                img.src = window.IMG_OK;

                // Si se descubrieron 14 cartas (todas menos la mala) -> ganó
                if (clickedCards.size === (images.length - 1)) {
                    gameOver = true;
                    const modalElement = document.getElementById("modal-winner");
                    if (modalElement) {
                        const modal = new bootstrap.Modal(modalElement);
                        modal.show();
                    } else {
                        alert("Ganaste");
                    }
                }
            }
        });

    });

    // Función para guardar ganador (igual que antes)
    function saveWinner(){
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phrase = document.getElementById("phrase").value.trim();

        if (!name || !email || !phrase){
            alert("Por favor completa todos los campos");
            return;
        }

        fetch("/winner", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                name: name,
                email: email,
                phrase: phrase
            })
        })
        .then(response => {
            if (response.ok){
                return response.json();
            }else{
                return Promise.reject();
            }
        })
        .then(result => {
            if(result.success){
                alert("El registro fue guardado correctamente");
            }else{
                alert("No se pudo guardar, intente mas tarde");
            }

        })
        .catch(error => {
            console.error("Error: ", error)
            alert("Error de conexión con el servidor.");
        })
   }

});
