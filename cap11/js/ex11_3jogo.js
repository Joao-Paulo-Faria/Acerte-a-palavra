const frm = document.querySelector("form"); //cria referência aos elementos HTML
const respPalavra = document.querySelector("#outPalavra");
const respErros = document.querySelector("#outErros");
const respDica = document.querySelector("#outDica");
const respChances = document.querySelector("#outChances");
const respMenssagemFinal = document.querySelector("#outMensagemFinal");
const imgStatus = document.querySelector("img");

let palavraSorteada; //declara variável globais
let dicaSorteada;

window.addEventListener("load", ()=>{
    //se não há palavras cadastradas
    if(!localStorage.getItem("jogoPalavra")){
        alert("Cadastre palavras para jogar"); //exibe alerta
        frm.inLetra.disabled = true; //desabilita inLetra e botões
        frm.btJogar.disabled = true;
        frm.btVerDica.disabled = true;
    }
    //obtém conteúdo do localStorage e separa em elementos de vetor
    const palavras = localStorage.getItem("jogoPalavra").split(";");
    const dicas = localStorage.getItem("jogoDica").split(";");

    const tam = palavras.length; //número de palavras cadastradas

    //gera um número entre 0 e tam-1 (pois arredonda para baixo)
    const numAleatorio = Math.floor(Math.random()*tam);

    //obtem palavra (em letras maiúsculas) e dica na posição do nº aleatório gerado
    palavraSorteada = palavras[numAleatorio].toUpperCase();
    dicaSorteada = dicas[numAleatorio];
    let novaPalavra =""; //para montar palavra exibida (com letra inicial e "-")
    

    // for para exibir a letra inicial e as demais ocorrencias desta letra na palavra
    for(const letra of palavraSorteada){
        //se igual a letra inicial, acresencta esta letra na exibição
        if(letra==palavraSorteada.charAt(0)){
            novaPalavra += palavraSorteada.charAt(0);
        }else{
            novaPalavra += " _ "; //senão, acresenta "_"
        }
    }
    respPalavra.innerText=novaPalavra; //exibe a novaPalavra

});

const trocarStatus = (num)=>{
    if(num>0) imgStatus.src=`img/status${num}.jpg`;
};

const verificarFim =()=>{
    const chances = Number(respChances.innerText); //obtém número de chances

    if(chances==0){
        respMenssagemFinal.className = "display-3 text-danger";
        respMenssagemFinal.innerText = `Ah... é ${palavraSorteada}. Você Perdeu!`;
        concluirJogo();
    } else if(respPalavra.innerText==palavraSorteada){
        respMenssagemFinal.className ="display-3 text-primary";
        respMenssagemFinal.innerText = "Parabéns!! Você Ganhou.";
        trocarStatus(4); //exibe a figura do "rostinho feliz"
        concluirJogo();
    }
}

//modifica o texto da dica e desabilita os botões de jogar
const concluirJogo = ()=>{
    respDica.innerText = "*  Clique no botão 'Iniciar Jogo' para jogar novamente";
    frm.inLetra.disabled = true;
    frm.btJogar.disabled = true;
    frm.btVerDica.disabled = true;
}

frm.btVerDica.addEventListener("click",()=>{
    //verifica se o jogador já clicou anteriormente no botão
    if(respErros.innerText.includes("*")){
        alert("Você já solicitou a dica...");
        frm.inLetra.focus();
        return;
    }
    respDica.innerText = "*" + dicaSorteada; //exibe a dica
    respErros.innerText += "*"; //acresenta "*" nos erros

    const chances = Number(respChances.innerText) - 1; //diminui 1 em chances
    respChances.innerText = chances; //mostra o nº de chances

    trocarStatus(chances); //troca a imagem

    verificarFim(); //verifica se atingiu limite de chances

    frm.inLetra.focus() //joga o foco em inLentra
});

frm.addEventListener("submit", e =>{
    e.preventDefault(); //evita envio do form

    const letra = frm.inLetra.value.toUpperCase(); //obtem o conteúdo do campo inLetra

    let erros = respErros.innerText; //obtem o conteúdo dos elementos da página
    let palavra = respPalavra.innerText;

    //verifica se a letra apostada já consta em erros ou na palavra
    if(erros.includes(letra) || palavra.includes(letra)){
        alert("Você já apostou esta letra");
        frm.inLetra.focus();
        return;
    }

    // se letra consta em palavraSorteada
    if(palavraSorteada.includes(letra)){
        let novaPalavra = ""; //para compor novaPalavra
        //for para montar palavra a ser exibida
        for(let i =0; i<palavraSorteada.length; i++){
            //se igual a letra apostada, acresenta essa letra na exibição
            if(palavraSorteada.charAt(i)==letra){
                novaPalavra += letra;

            }else{
                novaPalavra +=palavra.charAt(i); //senão, acrescenta letra ou "_" existente
            }
        }
        respPalavra.innerText =novaPalavra; //exibe a nova palavra


    }else{
        respErros.innerText +=letra; //acrescenta letra aos erros
        const chances =Number(respChances.innerText)-1; //diminui numero de chances
        respChances.innerText = chances; //exibe novo numero de chances

        trocarStatus(chances); //troca imagem
    }

   verificarFim(); //verifica se já ganhou ou perdeu

    frm.inLetra.value="";
    frm.inLetra.focus();
});

