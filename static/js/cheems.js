//document object model
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btn-save").addEventListener("click", saveWinner);
    document.getElementById("btn-restart").addEventListener("click", () => {
    location.reload();
  });



   const randomNumber = Math.floor(Math.random() * 14 ) + 1;

   //TODO: eliminar antes de lanzar el juego
   console.debug("Numero random: " + randomNumber)

   const images = document.querySelectorAll(".cheems-card img"); //regresa una coleccion con los elementos que cumplan la condicion, este caso imagenes con clase cheems-card


    const clickedCards = new Set();

   images.forEach((img, index) => {

        const id = index + 1;
        img.dataset.id = id;

        img.addEventListener("click", () => {

            if(!clickedCards.has(id)){
            clickedCards.add(id);
        }

            if (id == randomNumber){
                img.src = window.IMG_BAD;

                images.forEach((img, index) => {
                    let id = index + 1;

                    if (id != randomNumber){
                        img.src = window.IMG_OK
                    }

                })  
                alert("Perdiste")
                

            } else{
                img.src = window.IMG_OK;
                //alert("Ganaste")

                if(clickedCards.size === 14){
                    //alert("Ganaste");
                    const modal = new bootstrap.Modal(document.getElementById("modal-winner"));
                    modal.show();
                }
            }
        })
        
   })

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
            headers: {"Content-Type" : "application/json"}, //Se indica que lo que se envia es un tipo json
            body: JSON.stringify({
                name: name, //primer name es el parametro que se espera en app.py, el segundo su valor
                email: email,
                phrase: phrase
            })
        })
        //Recibe la promsea de la llamada para saber si se cumplio
        .then(response => {
            if (response.ok){
                return response.json();
            }else{
                return Promise.reject();
            }
        })
        .then(result => {
            if(result.success){//Se pone success porque asi esta en el jsonify del app.py
                alert("El registro fue guardado correctamente");
            }else{
                alert("No se pudo guardar, intente mas tarde");
            }

        })
        .catch(error => {
            console.error("Error: ", error)
        })
   }

}); 