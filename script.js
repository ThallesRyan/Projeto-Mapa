var olMap = null;
var olGps = null;
var olFeatureCenter = null;
const iSrid = 4326;
function doMap() {
    // Aqui part 1 mostrar imagem
    var map = document.getElementById('idMapViewPort');
    map.removeAttribute('hidden');

}

function centerMap() {
}

function changeLayer() {
}


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




