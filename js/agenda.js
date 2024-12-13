class Agenda{
    APIUrl;

    //boton = document.querySelector("button");
    boton = $("button");

    constructor(){
        this.APIUrl = "https://api.jolpi.ca/ergast/f1/2024/races.json";

        this.prepararBotones();
    }

    
    prepararBotones(){
        //this.boton.addEventListener("click", this.getCarreras.bind(this));
        this.boton.on("click", this.getCarreras.bind(this));
    }

    getCarreras() {
        // Realiza una llamada AJAX para obtener el calendario de la temporada actual
        $.ajax({
            dataType: "json",
            url: this.APIUrl,
            method: "GET",
            success: function(data){
                // Accede a la lista de carreras dentro de la respuesta de la API
                const carreras = data.MRData.RaceTable.Races;

                //const section = document.createElement("section"); //section en el que incluir los article(los pronosticos)
                const section = $("<section></section>");

                //const headerCarreras = document.createElement("h3");
                //headerCarreras.textContent = "Carreras de la temporada"; 
                //document.querySelector("body").appendChild(headerCarreras);
                const headerCarreras = $("<h3></h3>");
                headerCarreras.text("Carreras de la temporada"); 
                //$("body").append(headerCarreras);
                $("main").append(headerCarreras);


                // Recorre cada carrera y construye el contenido HTML
                carreras.forEach((carrera) => {
                    const nombreCarrera = carrera.raceName;
                    const nombreCircuito = carrera.Circuit.circuitName;
                    const coordenadas = `Lat: ${carrera.Circuit.Location.lat}, Long: ${carrera.Circuit.Location.long}`;
                    const fechaCarrera = `${carrera.date}`;
                    const horaCarrera = `${carrera.time}`;

                    // Crea un nuevo elemento HTML para cada carrera y agrega la información
                    //var article = document.createElement("article");
                    var article = $("<article></article>");
                    //var headerArticle = document.createElement("h4");
                    var headerArticle = $("<h4></h4>");
                    //var listaElementos = document.createElement("ul");
                    var listaElementos = $("<ul></ul>");

                    /*
                    var pCircuito = document.createElement("p");
                    var pCoordenadas = document.createElement("p");
                    var pFecha = document.createElement("p");
                    var pHora = document.createElement("p");
                    */
                    //var pCircuito = document.createElement("li");
                    var pCircuito = $("<li></li>");
                    //var pCoordenadas = document.createElement("li");
                    var pCoordenadas = $("<li></li>");
                    //var pFecha = document.createElement("li");
                    var pFecha = $("<li></li>");
                    //var pHora = document.createElement("li");
                    var pHora = $("<li></li>");

                    headerArticle.text(nombreCarrera);
                    article.append(headerArticle);

                    pCircuito.text("Circuito: " + nombreCircuito);
                    article.append(pCircuito);

                    pCoordenadas.text("Coordenadas: " + coordenadas);
                    article.append(pCoordenadas);

                    pFecha.text("Fecha: " + fechaCarrera);
                    article.append(pFecha);

                    pHora.text("Hora: " + horaCarrera);
                    article.append(pHora);


                    section.append(article);
                });
                //document.querySelector("body").appendChild(section);
                //$("body").append(section);
                $("main").append(section);
            },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
            }
        });
    }
}