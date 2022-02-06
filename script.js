// var olMap = null;
// var olGps = null;
// var olFeatureCenter = null;
// const iSrid = 4326;
// function doMap() {
//     // Aqui part 1 mostrar imagem
//     var map = document.getElementById('idMapViewPort');
//     map.removeAttribute('hidden');

// }

// function centerMap() {
// }

// function changeLayer() {
// }


// function openGps() {
// }

// // function aoAbrir() {
// // 	const apiKey = "77474b92ad49cef81948263cf3ca9477"


// // 	const ip = '187.72.14.228'
// // 	const api = `https://ip.city/api.php?ip=187.72.14.228&key=77474b92ad49cef81948263cf3ca9477`

// // }

function pesquisarCordenadas() {

    let texto = document.getElementById('TextArea').value
    let objeto = JSON.parse(texto);
    console.log(objeto.IP)

    const apiKey = "77474b92ad49cef81948263cf3ca9477"

    const ip = objeto.IP
    const api = `https://ip.city/api.php?ip=${ip}&key=${apiKey}`



    console.log(document.getElementById('frame').setAttribute("src", api))
}

function cordenadas() {
    let dados = document.getElementById('dadosIp').value
    let objeto = JSON.parse(dados)
    console.log(objeto.long)
    console.log(objeto.lat)

    document.getElementById("idLon").value = objeto.long
    document.getElementById("idLat").value = objeto.lat
}

function gerarPaises() {
    const url = `https://servicodados.ibge.gov.br/api/v1/paises`

    async function fetchDataAsync(url) {
        const response = await fetch(url);
        return await response.json();
    }

    fetchDataAsync(url)
        .then(dados => {
            const nomes = dados.map(dados => dados.nome).map(dados => dados.abreviado)


            // document.getElementById('selectPaises').inser
            // document.getElementById('op2').innerHTML = nomes[0].abreviado
            // document.getElementById('op2').value = nomes[0].abreviado

            console.log(nomes)
            nomes.sort()
            console.log(nomes)


            nomes.forEach(item => {
                addOption(item)
            })

            function addOption(valor) {
                var option = new Option(valor, valor);
                // option.id = "323423"
                var select = document.getElementById("selectPaises");
                select.add(option);

            }

        })

    console.log(document.getElementById("selectPaises"))
}

function cordenadasPais() {

    fetch("./paises.json")
        .then(response => {
            return response.json()
        })
        .then(jsondata => {
            console.log(jsondata)
            let paises = jsondata.Results
            //Checkpoint: colocar os dados na option select e ao selecionar, colocar a lat e long nos campos
            //Passar a sigla do país como id da option
            for (let atributo in paises) {
                //console.log(`${atributo} = ${paises[atributo].Name}`)


                let option = new Option(paises[atributo].Name, atributo);
                option.id = paises[atributo].Name
                let select = document.getElementById("selectPaises");
                select.add(option);

            }
            // console.log(paises)
            console.log(document.getElementById("selectPaises"))

            // console.log(paises)

        })
}

const getOption = ObjectSelect => {
    var value = ObjectSelect.value;
    if(value !== "semValor"){
        fetch("./paises.json")
            .then(response => {
                return response.json()
            }).then(jsondata =>{
                
                var dados = jsondata.Results
                
                console.log(dados[value])
                console.log(dados[value].GeoPt)
                let lat = dados[value].GeoPt[0]
                let long = dados[value].GeoPt[1]
                console.log(lat, long)
                
                document.getElementById("idLon").value = long
                document.getElementById("idLat").value = lat
            }) 
    }        
}



/*CÓDIGO MAPA */
/* --- Closure Compiler --
			number,
			https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System
			https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler
			https://github.com/google/closure-compiler/wiki/Annotating-Types
		*/
		var olMap = null;
		var olGps = null;
		var olFeatureCenter = null;
		const iSrid = 4326;
		const gpsInfo = { feature: null, lat: 0, lon: 0, acu: 0, last: null, error: { msg: '', code: 0 }, ready: function() { return (this.error.code == -1); } };
		const nome = 'nome';
		/** Disable/enable an element
		 * @param {string} sId element's id
		 * @param {bool} bEnable
		 */
		function btnEnable(sId, bEnable) {
			document.getElementById(sId).disabled = !bEnable;
		}
		// Todo: documentar
		function doMap() {  // https://openlayers.org/en/latest/examples/bing-maps.html
			let olLayers = [];

			let olTileBing = new ol.layer.Tile({
				visible: false,
				// https://docs.microsoft.com/en-us/bingmaps/rest-services/imagery/get-imagery-metadata
				source: new ol.source.BingMaps({ key: 'AnViqUxbtAAUnQKi3gSy0WE6FYza0rVfIGUVtD2gpe7fE_rgFPNM2MkoKqxkfJ2c', imagerySet: 'AerialWithLabelsOnDemand', }),
				preload: Infinity,
			});
			olLayers.push(olTileBing);

			// Tiles: Open Street Map
			let olTileOsm = new ol.layer.Tile({
				visible: false,
				source: new ol.source.OSM(),
			});
			olLayers.push(olTileOsm);


			// Tiles: Open Topo Map
			let olTileOtm = new ol.layer.Tile({
				type: 'base',
				visible: true,
				source: new ol.source.XYZ({
					url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
				})
			});
			olLayers.push(olTileOtm);

			olMap = new ol.Map({
				layers: olLayers,
				target: 'idMapViewPort',
				view: new ol.View({
					center: [0, 0], //aCenter,  // open Layer default 'EPSG:3857';
					zoom: 1,//15,
				})
			});
			console.log('mapa prontooooo');

			/* Criar feature e Layer do GPS */
			gpsInfo.feature = new ol.Feature();
			gpsInfo.feature.setStyle(new ol.style.Style({
				image: new ol.style.Circle({
					radius: 6,
					fill: new ol.style.Fill({ color: 'DodgerBlue', }),
					stroke: new ol.style.Stroke({ color: '#fff', width: 2, }),  // Shortcut 3-digits = #ffFFff
				}),
			}));
			const olGpsLayer = new ol.layer.Vector({
				map: olMap,
				source: new ol.source.Vector({ features: [gpsInfo.feature], }),
			});
		}
		/** Disable/enable an element
		 * @param {Array} aCenter Map Coordinates in 'EPSG:3857'; https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#setCenter
		 */
		function centerMap(aCenter) {
			if (!aCenter) {
				let nLat = document.getElementById('idLat').value;
				let nLon = document.getElementById('idLon').value;
				aCenter = ol.proj.fromLonLat([nLon, nLat]);
			}
			if (!olMap) {
				window.alert('O mapa não está pronto.')
			} else {
				olMap.getView().setCenter(aCenter);
				console.log('Mapa centralizado: ' + aCenter);
			}
			// TODO: olFeatureCenter.setGeometry(new ol.geom.Point(aCenter));
		}
		// TODO:
		function changeLayer() {
			// cSpell: word visivel
			let olListaLayers = [];
			let iVisivel = -1;
			function processa(olLayer) {
				let bVisivel = olLayer.getVisible();
				if ((bVisivel) && (iVisivel < 0)) { iVisivel = olListaLayers.length; }
				olListaLayers.push(olLayer);
				console.log(olLayer.get(nome) + ' visível: ' + olLayer.getVisible());
			}

			olMap.getLayers().forEach(processa);

			try {
				// mudar visible a próxima
				let a = EsteDaErro;
				console.log('Visivel mudado para xxx');
			} catch (e) {  // Se ocorrer um erro não previsto, voltar com o layer que já era visivel.
				console.error( /*TODO*/ e.message);
				if (iVisivel >= 0) {
					olListaLayers[iVisivel].getVisible(iVisivel);
				}
			}
			// cSpell: word visivel

		}
		// TODO:
		function gpsCenter() {
			if (!gpsInfo.ready) {
				alert('GPS não está pronto.');  // TODO
			} else if (!gpsInfo.feature) {
				alert('Mapa não está pronto.');  // TODO
			} else {
				let aCoord = [gpsInfo.lon, gpsInfo.lat];
				let c = ol.proj.fromLonLat(aCoord);
				let p = new ol.geom.Point(c);
				gpsInfo.feature.setGeometry(p);
				console.log('aqui que estamos!');
			}
		}
		/** GPS Success Callback function
		 * @param {Object} gpsPos https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates
		 */
		function gpsPosition(gpsPos) {
			btnEnable('idOpenGps', true);
			gpsInfo.error.msg.code = 0;
			gpsInfo.lat = gpsPos.coords.latitude;
			gpsInfo.lon = gpsPos.coords.longitude;
			gpsInfo.acu = gpsPos.coords.accuracy;
			gpsInfo.last = new Date();
			window.console.log('Dados GPS salvos ;-)');
			//window.console.log(gpsPos);
			gpsCenter();
		}

		/** GPS Error Callback function
		 * @param {Object} gpsError https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError
		 */
		function gpsError(gpsError) {
			btnEnable('idOpenGps', false);  /// gpsError.code == gpsError.PERMISSION_DENIED);
			// Todo: switch(gpsError.code)
			gpsInfo.error.msg = gpsError.message;
			gpsInfo.error.msg.code = gpsError.code
			console.error(`Não foi possível recuperar sua localização devido '${gpsError.message}' [${gpsError.code}].`);
			//window.console.error(gpsError);

		}
		/** UI to active GPS and center to its current location
		 * @param {string} sId element's id
		 * @param {bool} bEnable
		 * @return {bool} true if activated | centered
		 */
		function gpsOpen() {
			// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
			if (!navigator.geolocation) {
				btnEnable('idOpenGps', false);
				alert('GPS não está disponível neste navegador.')
				return false;
			} /* Todo: else if (já ligado ){
				centralizar no ponto
			} else {  // ativar geolocation (pode usar watchPosition, se for mobile)
				*/


			navigator.geolocation.getCurrentPosition(gpsPosition, gpsError);
			btnEnable('idOpenGps', false);
			return true;

		}




