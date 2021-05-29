

const peticionHTTP = new XMLHttpRequest();
window.addEventListener('load', function(){
    ejecutarGet();
    ById("btnAlta").addEventListener('click',TraerDatos);
    ById("btnCrear").addEventListener('click',Alta);
    ById("btnCancelar").addEventListener('click',OcultarForm);

 
});

 

function ejecutarGet(){
        
    peticionHTTP.onreadystatechange= function(){
        ById("preview-area").hidden=false;
        if(peticionHTTP.readyState== 4 && peticionHTTP.status== 200){
            let arrayJson = JSON.parse(peticionHTTP.responseText);
            CrearTabla(arrayJson);
            ById("preview-area").hidden=true;
         }
     }
     peticionHTTP.open("GET","http://localhost:3000/autos",true);
     peticionHTTP.send();
  
    }

    function CrearTabla(array){
        
        let tabla = document.createElement("table");
        tabla.id = "tablaPersona";
        let div = document.getElementById("divTabla");
        div.appendChild(tabla);
        CrearThead(array);
        CrearTbody(array);
        tabla.setAttribute("border","1");
        tabla.className = "tabla";

        
    }

    function CrearTbody(array){
        let tbody = document.createElement("tbody");
        tbody.id = "tbodyAutos";
        array.forEach(objeto => {
            let tr= document.createElement("tr");
            var keys = Object.keys(objeto);
            tr.id = "tr" + objeto.id;
            keys.forEach(element => {
                if(element != "id"){
                    let td= document.createElement("td");
                    if(element == "year"){
                        td.appendChild(CrearSelect(objeto[element]));
                    }else{
                        td.innerHTML = objeto[element];
                    }
                    
                    tr.appendChild(td);
                }
               
            });
            
            tbody.appendChild(tr);
        });
        let tabla = document.getElementById("tablaPersona");
        tabla.appendChild(tbody);
    }

    function CrearSelect(anio){
        var select= Create("select");
        select.addEventListener('change',PostModificar);
        select.name = "year";
        for (let index = 0; index < 21; index++) {
            var option = Create("option");
            option.value = index;
            option.innerHTML = index+2000;
            if(option.innerHTML == anio){
                option.selected = true;
            }
            select.appendChild(option);
        }
        return select;
    }

    function CrearThead(array){

        let thead = document.createElement("thead");
        thead.id="theadPersona";
        var keys = Object.keys(array[0]);
        keys.forEach(element => {
            if(element != "id"){
            let th = document.createElement("th");
            th.id="thPersona"
            th.innerHTML = element;
            thead.appendChild(th);
            }
        });
        let tabla = document.getElementById("tablaPersona");
        tabla.appendChild(thead);

    }

function OcultarForm(){
    ById("divForm").hidden=true; 
}


function Alta(){
    
    var funciono= true;
    let marca = ById("impMarca").value;
    funciono = validarCampos(ById("impMarca"));
    let modelo = ById("impModelo").value;
    funciono = validarCampos(ById("impModelo"));
    let anio;
    var array = ById("anio").children;
    if (funciono){
        for (let index = 0; index < array.length; index++) {
            let option = array[index]; 
            if(option.selected){
                anio = option.innerHTML;
                break;
            }
        }
       
        let auto = {"make":marca,"model":modelo,"year":anio};
        PostNuevoAuto(auto);
        ActualizarTabla();
        
    }
    
}

function PostNuevoAuto(auto){
    
    peticionHTTP.onreadystatechange= function(){
        ById("preview-area").hidden=false;
        if(peticionHTTP.readyState== 4 && peticionHTTP.status== 200
        ){
           if(JSON.parse(peticionHTTP.responseText).type != "error"){
            AgregarAuto(JSON.parse(peticionHTTP.responseText));
           }
           console.log(JSON.parse(peticionHTTP.responseText));
           ById("divForm").hidden=true; 
           ById("preview-area").hidden=true;  
         }
     }
     
     peticionHTTP.open("POST","http://localhost:3000/nuevoAuto",true);
     peticionHTTP.setRequestHeader("content-type", "application/json");
     peticionHTTP.send(JSON.stringify(auto));
     
}

function AgregarAuto(auto){
    var tBody = ById("tbodyAutos");
    var tr = Create("tr");
    tr.id="tr"+auto.id;
    var tdMarca = Create("td");
    var tdModelo = Create("td");
    var tdSelectAnio = Create("td");
    tdMarca.innerHTML = auto.make;
    tdModelo.innerHTML = auto.model;
    tdSelectAnio.appendChild(CrearSelect(auto.year));
    tr.appendChild(tdMarca);
    tr.appendChild(tdModelo);
    tr.appendChild(tdSelectAnio);
    tBody.appendChild(tr);

}

function TraerDatos(){

   ById("divForm").hidden=false;

}


function ActualizarTabla(){
    ById("impMarca").value="";
        ById("impModelo").value="";
        
}


function PostModificar(ev){
    var tr = ev.target.parentNode.parentNode;
    var select = ev.target;
    var id= tr.id.substring(2);
    var anio;
    for (let index = 0; index < select.children.length; index++) {
        let option = select.children[index]; 
        if(option.selected){
            anio = option.innerHTML;
            break;
        }
    }
   
    peticionHTTP.onreadystatechange= function(){
        if(peticionHTTP.readyState== 4 && peticionHTTP.status== 200 )
        {    
            console.log(JSON.parse(peticionHTTP.responseText));
         
        }
     }
     var auto = {"id":id,"year":anio};
     peticionHTTP.open("POST","http://localhost:3000/editarYear",true);
     peticionHTTP.setRequestHeader("content-type", "application/json");
     peticionHTTP.send(JSON.stringify(auto));

}





function ById(obj){
    return document.getElementById(obj);
}

function Create(obj){
    return document.createElement(obj);
}

function Obtenerid(){
    let tbody = document.getElementById("tbodyPersona");
    let len = tbody.childNodes.length;
    if(len > 0)
    {
        let tr = tbody.childNodes[len-1];
        let oldId = tr.id.substring(2);
        let id = parseInt(oldId);
        return id+1;    
    }
    return 0;
}
    

function validarCampos(obj){
    
    if (obj.value.length < 3) {
        obj.className="conError";
        alert("Completar con un minimo de 3 caracteres.");
        obj.focus();
        

        return false;
    }else{
        obj.className="sinError";
        return true;
    }
    
     
}     


