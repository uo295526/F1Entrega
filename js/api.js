class Trivia{

    //Array que almacenara los distintos pilotos, junto a una imagen asociada. Al empezar el juego, se establecera uno
    //al azar, teniendo el jugador elegir de cada article/section de campos (equipo, nacionalidad, etc) el correspondiente al piloto
    elements = [{
        piloto: "Fernando Alonso",
        source: "multimedia/imagenes/imagenesApi/fotoFernandoAlonso.jpg",
        nacionalidad: "Española",
        equipo: "Aston Martin Racing"
    },{
        piloto: "Max Verstappen",
        source: "multimedia/imagenes/imagenesApi/fotoMaxVerstappen.jpg",
        nacionalidad: "Neerlandesa",
        equipo: "Red Bull Racing"
    },{
        piloto: "Charles Leclerc",
        source: "multimedia/imagenes/imagenesApi/fotoCharlesLeclerc.jpg",
        nacionalidad: "Monegasca",
        equipo: "Ferrari"
    },{
        piloto: "Lewis Hamilton",
        source: "multimedia/imagenes/imagenesApi/fotoHamilton.jpg",
        nacionalidad: "Británica",
        equipo: "Mercedes"
    }];

    primerCampoSeleccionado; //campo nombre
    segundoCampoSeleccionado; //campo nacionalidad
    tercerCampoSeleccionado; //campo equipo
    pilotoActual;

    audioContext;

    currentAudioElement;
    
    //gestionar api drag movil
    draggedElement;
    startX;
    startY;


    constructor(){
        this.primerCampoSeleccionado = null;
        this.segundoCampoSeleccionado = null;
        this.tercerCampoSeleccionado = null;
        this.pilotoActual = null;

        this.shuffleElements(); 
        this.createElements();
        //this.addEventListeners();

        //Web Audio API
        //this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        //Para evitar warnings, que se cree tras que el usuario le de a un botom
        document.querySelector("input:first-of-type").addEventListener("click", ()=>{this.audioContext  = new (window.AudioContext || window.webkitAudioContext)();});

        //Al usar la API Drag and Drop
        this.createDragAndDrop();

        //API Page Visibility
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    shuffleElements(){
        //Aplicamos algoritmo Durstenfeld
        for(let i = this.elements.length-1; i > 0; i--){
            const j = Math.floor(Math.random()*(i+1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }


    createElements(){
        //Ya estando los pilotos shuffleados, pillo el primero
        this.pilotoActual = this.elements.at(0);

        //var pilotSection = document.querySelector("main section"); //deberia pillar el primer section del main
        var pilotSection = $("main section").first(); //asi pilla todos los sections, hacer que pille solo el primero

        var imgPiloto = $("<img>");
        imgPiloto.attr({src: this.pilotoActual.source, alt: "Imagen del piloto"});

        pilotSection.append(imgPiloto);

        var pAvisoPiloto = $("<p></p>");
        pAvisoPiloto.text("¡Este ha sido el primer piloto en salir de la línea de meta!");
        var pIntro = $("<p></p>");
        pIntro.text("Es hora de poner a prueba tus conocimientos sobre la F1. 3, 2, 1...¡YA!");
        pilotSection.append(pAvisoPiloto);
        pilotSection.append(pIntro);
        


    }

    confirmarRespuestas(){
        var finalSection = $("section").last();

        var counterRespuestas = 0;
        //Observo cuantas respuestas se han puesto, y de las puestas las que sean correctas:
        
        for (var i = 0; i < 4; i++) {
            var article = $("article").eq(i);
    
            var liHijos = article.children("li");
    
            // Comprobamos si el artículo tiene al menos un <li> o exactamente dos hijos
            if (liHijos.length == 1) { //se ha puesto una respuesta
                counterRespuestas++;

                if(i == 0){
                    this.primerCampoSeleccionado = liHijos.first().text();
                }else if(i == 1){
                    this.segundoCampoSeleccionado = liHijos.first().text();
                }else{
                    this.tercerCampoSeleccionado = liHijos.first().text();
                }
            }
        }

        if(counterRespuestas == 3 && this.comprobarRespuestasEstablecidas()){

            //Suena audio victoria
            //this.reproducirAudio("https://freesound.org/people/xtrgamr/sounds/277441/");
            this.reproducirAudio("./multimedia/audios/sonidosAPI/winMK.mp3");
            //this.reproducirAudio("http://localhost/F1Desktop5/multimedia/audios/sonidosAPI/winMK.mp3");

            

            var pVictoria = $("<p>VICTORIA</p>");
            finalSection.append(pVictoria);

        }else{
            //Suena audio derrota
            this.reproducirAudio("./multimedia/audios/sonidosAPI/loseMK.mp3");
            //this.reproducirAudio("http://localhost/F1Desktop5/multimedia/audios/sonidosAPI/loseMK.mp3");

            var pDerrota = $("<p>DERROTA</p>");
            finalSection.append(pDerrota);
        }

        //Tras acabar el juego, deshabilito las mecanicas
        var botonInputConfirmar = $("input");
        botonInputConfirmar.attr("disabled", true);

        $("li").each(function() {
            $(this).attr("draggable", false);
        });
    }

    comprobarRespuestasEstablecidas(){
        return this.primerCampoSeleccionado === this.elements.at(0).piloto && 
        this.segundoCampoSeleccionado === this.elements.at(0).nacionalidad && this.tercerCampoSeleccionado === this.elements.at(0).equipo;
    }


    //METODO API WEB AUDIO
    reproducirAudio(urlAudio){
        //Api key FreeSound.org
        //var apiKey = "tACxjQncYBvY0kQx4wB6I6fn8esN5uKoherEQ8fP";

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        var audioElement = new Audio(urlAudio);
        
        this.currentAudioElement = audioElement;

        //var audioSource = this.audioContext.createMediaElementSource(audioElement);
        //audioSource.connect(this.audioContext.destination);

        if(this.audioContext.state === "suspended"){
            this.audioContext.resume();
        }

        //audioElement.play
        this.currentAudioElement.play().catch((error) => {
            console.error('Error al intentar reproducir el audio:', error);
        });

    }

    //METODOS DRAG AND DROP
    createDragAndDrop(){
        //declaro que elelementos se van a poder arrastar
        const draggables = document.querySelectorAll("li[draggable='true']");
        //declaro en que zonas se van a poder solar estos elementos
        const dropZones = document.querySelectorAll("article"); // Las listas donde se pueden soltar

        draggables.forEach(item => {
            item.addEventListener("dragstart", this.handleDragStart);
            item.addEventListener("dragend", this.handleDragEnd);

            //para moviles
            item.addEventListener("touchstart", this.handleTouchStart.bind(this));
            item.addEventListener("touchmove", this.handleTouchMove.bind(this));
            item.addEventListener("touchend", this.handleTouchEnd.bind(this));
        });

        dropZones.forEach(zone => {
            zone.addEventListener("dragover", this.handleDragOver);
            zone.addEventListener("drop", this.handleDrop);

            //para moviles
            zone.addEventListener("touchmove", this.handleTouchMoveOver.bind(this));
            zone.addEventListener("touchend", this.handleTouchEndDrop.bind(this));
        });
    }

    handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.innerText);
        event.target.classList.add("dragging");
    }

    handleDragEnd(event) {
        event.target.classList.remove("dragging");
    }

    handleDragOver(event) {
        event.preventDefault(); //Necesario para permitir el drop.
        //By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.
    }

    handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        const droppedItem = document.createElement("li");
        droppedItem.textContent = data;
        droppedItem.setAttribute("draggable", "true");

        //Antes de soltar el elemento, me aseguro de borrar todo lo que hubiese dentro antes
        const dropZone = event.target.closest("article");
        if (dropZone) {
            // Eliminar todos los elementos li existentes pero mantener el encabezado (h5)
            Array.from(dropZone.children).forEach(child => {
                if (child.tagName === "LI") {
                    dropZone.removeChild(child);
                }
            });
    
            // Crear un nuevo elemento li con el contenido arrastrado
            const droppedItem = document.createElement("li");
            droppedItem.textContent = data;
            droppedItem.setAttribute("draggable", "true");
    
            // Añadir el nuevo elemento al article
            dropZone.appendChild(droppedItem);
    
            // Reasignar controladores de eventos al nuevo elemento li
            droppedItem.addEventListener("dragstart", this.handleDragStart);
            droppedItem.addEventListener("dragend", this.handleDragEnd);
        }
    }

    /************************************************************ */
    handleTouchStart(event) {
        const touch = event.touches[0]; // Primer punto de contacto
        this.draggedElement = event.target; // Guardamos el elemento que está siendo arrastrado
        this.startX = touch.clientX; // Coordenada inicial X
        this.startY = touch.clientY; // Coordenada inicial Y
    
        // Agregamos una clase visual para destacar el elemento arrastrado
        this.draggedElement.classList.add("dragging");
    }
    
    handleTouchMove(event) {
        event.preventDefault(); // Evitamos el comportamiento predeterminado del navegador
    
        const touch = event.touches[0];
        const deltaX = touch.clientX - this.startX;
        const deltaY = touch.clientY - this.startY;
    
        // Movemos el elemento visualmente
        //this.draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
    
    handleTouchEnd(event) {
        // Restauramos la posición y eliminamos la clase visual
        //this.draggedElement.style.transform = "";
        this.draggedElement.classList.remove("dragging");
    
        // Al soltar, verificamos si está sobre una zona válida
        const touch = event.changedTouches[0];
        const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);
    
        if (dropZone && dropZone.tagName === "ARTICLE") {
            // Realizamos el drop simulando la lógica del mouse
            const data = this.draggedElement.textContent;
            const droppedItem = document.createElement("li");
            droppedItem.textContent = data;
            droppedItem.setAttribute("draggable", "true");
    
            // Limpiamos la zona de destino
            Array.from(dropZone.children).forEach(child => {
                if (child.tagName === "LI") {
                    dropZone.removeChild(child);
                }
            });
    
            // Añadimos el nuevo elemento
            dropZone.appendChild(droppedItem);
    
            // Reasignamos eventos al nuevo elemento
            droppedItem.addEventListener("touchstart", this.handleTouchStart.bind(this));
            droppedItem.addEventListener("touchmove", this.handleTouchMove.bind(this));
            droppedItem.addEventListener("touchend", this.handleTouchEnd.bind(this));
        }
    
        this.draggedElement = null; // Reseteamos el estado
    }
    
    handleTouchMoveOver(event) {
        // Este método asegura que se permita el "drop" en una zona válida mientras se mueve
        event.preventDefault();
    }
    
    handleTouchEndDrop(event) {
        // Método que puede manejar situaciones adicionales tras un "drop" en zonas táctiles
        event.preventDefault();
    }


    /************************************************************** */

    //API Page Visibility
    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            //Se oculta la pagina, se pausa el audio
            this.pausarAudio(); // Método que pausará cualquier audio en reproducción
        } else if (document.visibilityState === 'visible') {
            //La pagina esta visible, se reproduce el audio
            this.reanudarAudio(); // Método para reanudar el audio o acciones
        }
    }

    pausarAudio() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }

        if (this.currentAudioElement) {
            this.currentAudioElement.pause();
        }
    }
    
    reanudarAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
                                //para que solo continue si no ha acabado
        if (this.currentAudioElement && !this.currentAudioElement.ended) {
            this.currentAudioElement.play().catch((error) => {
                console.error('Error al intentar reanudar el audio:', error);
            });
        }
    }
}