const frm = document.querySelector("form"); //captura elementos da página
const dvPalco = document.querySelector("#divPalco");

const POLTRONAS = 240; // CONSTANTE COM O NÚMERO DE POLTRONAS DO TEATRO
const reservadas = []; //vetor com as poltronas reservadas pelo cliente

window.addEventListener("load",()=>{
    //operador ternário: se hojver dados salvos em localsotrage, fas um split(";") e
    //atribui esses dados ao array, caso contrário, o array é inicializado vazio
    const ocupadas = localStorage.getItem("teatroOcupadas")?localStorage.getItem("teatroOcupadas").split(";"):[];

    //repetição para montar o nº total de poltronas (definida na constante)
    for(let i=1; i<=POLTRONAS; i++){
        const figure = document.createElement("figure"); //cria tag figure
        const imgStatus = document.createElement("img"); //cria tag img

        //se a posição consta em ocupadas, exibe a imagem ocupada, senão, disponível
        imgStatus.src = ocupadas.includes(i.toString()) //verifica se em 1,2,3,4... do vetor ocupadas possui algum número
        ? "img/ocupada.jpg"
        : "img/disponivel.jpg";
        imgStatus.className="poltrona"; //classe com dimensão da img
        const figureCap = document.createElement("figcaption"); //cria figcaption

        //quantidade de zeros antes do nú8mero da poltrona
        const zeros = i<10? "00": i<100?"0":"";

        const num = document.createTextNode(`[${zeros}${i}]`); //cria texto
        figureCap.appendChild(num); //define os pais de cada tag criada
        figure.appendChild(imgStatus);
        figure.appendChild(figureCap);

        //se i módulo 24==12 (é o corredor: define margem direita 60px)
        if(i%24==12) figure.style.marginRight = "60px";

        dvPalco.appendChild(figure); //indica que figure é filha de divPalco

        //se i módgulo 24==0: o comando após && será exebutado (inserere quebra de linha)
        (i%24==0) && dvPalco.appendChild(document.createElement("br"));
    }

});

frm.addEventListener("submit", (e)=>{
    e.preventDefault(); //evita envio do form

    const poltrona = Number(frm.inPoltrona.value); //obtem conteúdo de inPoltrona

    //valida o preenchimento do campo de entrada... não pode ser maior que a const
    if(poltrona>POLTRONAS){
        alert("Informe um número de poltrona válido");
        frm.inPoltrona.fous();
        return;

    }
    const ocupadas = localStorage.getItem("teatroOcupadas")? localStorage.getItem("teatroOcupadas").split(";"):[];

    //se poltrona escolhida já está ocupada (existe em localstorage)
    if(ocupadas.includes(poltrona.toString())){
        alert(`Poltrona ${poltrona} já exstá ocupada...`);
        frm.inPoltrona.value="";
        frm.inPoltrona.focus();
        return;
    }

    //captura imagem da poltrona, filha de divPalco. É -1 pois comeca em 0

    const imgPoltrona=dvPalco.querySelectorAll("img")[poltrona-1];

    imgPoltrona.src = "img/reservada.jpg"; //modifica atributo da imagem
    
    reservadas.push(poltrona); //adiciona poltrona ao vetor reservadas

    frm.inPoltrona.valu="";//limpa campo
    frm.inPoltrona.focus();//jogo o foco em inpoltrona

});

frm.btConfirmar.addEventListener("click",()=>{
    if(reservadas.length==0){
        alert("Não há poltronas reservadas");
        frm.inPoltrona();
        return;
    }

    const ocupadas = localStorage.getItem("teatroOcupadas")? localStorage.getItem("teatroOcupadas").split(";"): [];

    //for decrescente, pois as reservas vão sendo removidas a cada aleração da imagem
    for(let i =reservadas.length-1; i>=0; i--){
        ocupadas.push(reservadas[i]);
        //captura imagem da poltrona, filha de divPalco. É -1 pois começa em 0

        const imgPoltrona = dvPalco.querySelectorAll("img")[reservadas[i]-1];
        imgPoltrona.src="img/ocupada.jpg"; //modifica atributo da imagem
        reservadas.pop(); //remove do vetor a reserva já alterada
    }

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));
});
