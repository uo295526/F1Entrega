class Memoria{
    //creamos doce elementos JSON (realmente seis distintos, cada uno repetido)
    //establecemos elements
    //array, en el que cada posicion sera un objeto JSON {} element
    elements = [{
            element: "RedBull",
            source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
        },{
            element: "RedBull",
            source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
        },{
            element: "McLaren",
            source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
        },{
            element: "McLaren",
            source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
        },{
            element: "Alpine",
            source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
        },{
            element: "Alpine",
            source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
        },{
            element: "AstonMartin",
            source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
        },{
            element: "AstonMartin",
            source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
        },{
            element: "Ferrari",
            source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
        },{
            element: "Ferrari",
            source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
        },{
            element: "Mercedes",
            source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
        },{
            element: "Mercedes",
            source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
    }];

    hasFlippedCard;
    lockBoard;
    firstCard;
    secondCard;

    constructor(){
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.shuffleElements(); //OBLIGATORIOS LOS this.
        this.createElements(); //OBLIGATORIOS LOS this.
        this.addEventListeners(); //OBLIGATORIOS LOS this.
    }

    shuffleElements(){
        //this.elements.sort();  //de momento no, probar con el algoritmo recomendado 
        //Aplicamos algoritmo Durstenfeld
        for(let i = this.elements.length-1; i > 0; i--){
            const j = Math.floor(Math.random()*(i+1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    //Cuando se levantan dos distintas
    unflipCards(){ //Bloquea tablero, voltea las cartas ya bocarriba, resetea tablero
        this.lockBoard = true;
        
        //VOLTEAR LAS CARTAS ESCOGIDAS (jugando con el atributo data-state)
        //TIMEOUT para nadir delay, ponemos las funciones a actuar tras el delay en la funcion lambda
        setTimeout(()=>{
            this.firstCard.removeAttribute("data-state"); //lo eliminamos por reestableceremos la carta
            this.secondCard.removeAttribute("data-state");
                    //otra opcion
            //this.firstCard.setAttribute("data-state", "init");
            //this.secondCard.setAttribute("data-state", "init");

            this.resetBoard();
        }, 2500);
        
    }

    resetBoard(){
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;  //SI YA SE HA FLIPEADO UNA DE LAS DOS CARTAS A FLIPEAR EN CADA TURNO
        this.lockBoard = false;
    }

    /*ASEGURARSE DE LA COMPROBACION*/
    checkForMatch(){
        //Operador ternario. Condicion, Cumplida, No cumplida
            //OPERADOR === Exclusivo de javascript, comprueba tanto el valor como el tipo
        (this.firstCard.getAttribute("data-element") === this.secondCard.getAttribute("data-element")) ? this.disableCards() : this.unflipCards();
    }

    //SE HA COGIDO UN PAR CORRECTO, SE DEJAN REVELADAS (PERMA)
    disableCards(){ 
        //this.firstCard.datastate = revealed;
        //this.secondCard.datastate = revealed;
        this.firstCard.setAttribute("data-state", "revealed");  //CREO UN ATRIBUTO data-state AL ELEMENT CON VALOR revealed
        this.secondCard.setAttribute("data-state", "revealed"); //CREO UN ATRIBUTO data-state AL ELEMENT CON VALOR revealed
        this.resetBoard();
    }


    createElements(){
        //MEDIA-QUERY: PREVIO A CREAR LOS ELEMENTOS, DEBEMOS ESTABLECER EN QUE PARTE DEL DOCUMENTO LO ANADIREMOS
        var cardsSection = document.querySelector("section:nth-of-type(2)");
        //tal que asi o con un cartas.ForEach
        
        
        for(let i = 0; i < this.elements.length; i++){
            //EN VEZ DE IR CONCATENANDO EL TEXTO A LO BRUTA, SEGUIR ESTA FORMA MAS ESQUEMATIZADA:
                            //Crea los elementos html, les establece sus valores, y a posteriori los une
            //document.write("<article>" + "</article>");
            var article = document.createElement("article"); //creamos el article (que representa cada carta)
            article.setAttribute("data-element", this.elements.at(i).element);
            var encabezado = document.createElement("h3"); //creamos el h3
            encabezado.textContent = "Tarjeta de Memoria";
            var img = document.createElement("img"); //creamos la etiqueta img
            img.alt = this.elements.at(i).element; //establecemos el alt de la etiqueta img, el valor el element del element actual
            img.src = this.elements.at(i).source; //establecemos el src de la etiqueta img, el valor el source del element actual
            //Ya tenemos los elementos hechos, los juntamos en el article (APPENDCHILD)
            article.appendChild(encabezado);
            article.appendChild(img);
            //IMP: para acabar, una vez todo montado, lo naadimos a la parte del documento que queremos
            cardsSection.appendChild(article);
        }
    }

    //PULSACIONES SOBRE LAS CARTAS
    addEventListeners(){
        //recorrer las cartas anadidas a la pagina
                //IMP: querySlector devuelve EL PRIMER elemento que encuentre, querySelectorAll devuelve todos
        var articlesCartas = document.querySelectorAll("section:nth-of-type(2) article"); //todos los articles (cartas) del section
        /*
        for(let i = 0; i < this.articlesCartas.length-1; i++){
            articlesCartas.item(i).addEventListener("clic", this.flipCard.bind(articlesCartas.item(i), this)
        );
        }       ACOSTUMBRARSE A USAR FOREACH, mas eficiente y me olvido del get/at/...
        */
        articlesCartas.forEach(card => 
            {card.addEventListener("click", this.flipCard.bind(card, this))
                });
    }

    flipCard(game){ //game representa el juego, no hace falta poner su tipo
        //comprobaciones de "uso indebido"
                //para mirar la carta selecciona, es THIS, pues es lo que activo el evento
        if(this.getAttribute("data-state") == "revealed" || game.lockBoard || this.firstCard === this){   //this.firstCard creo que es game.
            return;
        }

        //no ha habido errores, flipeamos la carta
        this.setAttribute("data-state", "flip"); //modifico data-state a "flip" (siempre con estos sets)

        //comprobamos si ya se ha sacado una antes y si se ha hecho comparamos
        if(!game.hasFlippedCard){ 
            game.hasFlippedCard = true; //es la primera en levantarse, activamos esta flag
            game.firstCard = this;
        }else{
            game.secondCard = this;
            game.checkForMatch(); //comprobamos las dos escogidas por el usuario.       AQUI ES GAME., NO this.
        }
    }
}