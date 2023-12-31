const pseudo = document.getElementById("form_pseudo");
const submission = document.getElementById("form_jeu");
const submission_pm = document.getElementById("form_pm");
const intro = document.getElementById("intro");
const attente = document.getElementById("salle_attente");
const game = document.getElementById("game");
const outro_relier = document.getElementById("outro_relier");
const outro_finale = document.getElementById("outro_finale");
const private_message = document.getElementById("private_message");
const classement = document.getElementById("leaderboard");
const img_retour = document.getElementById("img_retour");
const img_send = document.getElementById("img_send");
const reponse_finale = document.getElementById("reponse_finale");
const joueur_1 = document.getElementById("joueur_1");
const joueur_2 = document.getElementById("joueur_2");
const joueur_3 = document.getElementById("joueur_3");
const joueur_4 = document.getElementById("joueur_4");
const joueur_5 = document.getElementById("joueur_5");
//TIMER
const timer = document.getElementById("timer");
let socket = undefined;
let name = "anonyme";
let pseudoJoueur = "Couscous";
let pseudoJoueurRecu = "Tajine";
let envoi_boolean = false;
let reponseLeo = [];
let reponseAdrien = [];
let reponseRobert = [];
let reponseJeanPaul = [];
let reponseMaurice = [];
let playersNameRecu = [];
let playersPointsRecu = [];
let pseudoQuiNousDM = "";

document.getElementById("lancer_jeu").addEventListener("click", function (e) {
  socket.emit("CommencerJeu", "start");
});

joueur_1.addEventListener("click", function (e) {
  socket.emit("voirReponsesJoueur", "joueur1", name);
});

joueur_2.addEventListener("click", function (e) {
  socket.emit("voirReponsesJoueur", "joueur2", name);
});

joueur_3.addEventListener("click", function (e) {
  socket.emit("voirReponsesJoueur", "joueur3", name);
});

joueur_4.addEventListener("click", function (e) {
  socket.emit("voirReponsesJoueur", "joueur4", name);
});

joueur_5.addEventListener("click", function (e) {
  socket.emit("voirReponsesJoueur", "joueur5", name);
});

img_retour.addEventListener("click", function (e) {
  //on supprime les dm du mec e.target.innerText
  private_message.classList.add("hidden");
  //on affiche le chat general
  game.classList.remove("hidden");
});

document.getElementById("img_retour2").addEventListener("click", function (e) {
  //on supprime lhistorique
  document.getElementById("historique_joueur").classList.add("hidden");
  document.getElementById("outro_relier").classList.remove("hidden");
});

reponse_finale.addEventListener("click", function (e) {
  //on supprime les dm du mec e.target.innerText
  reponse_finale.classList.add("hidden");
  let reponses = [];
  reponses[0] = document.getElementById("pseudo-select").value;
  reponses[1] = document.getElementById("pseudo-select2").value;
  reponses[2] = document.getElementById("pseudo-select3").value;
  reponses[3] = document.getElementById("pseudo-select4").value;
  reponses[4] = document.getElementById("pseudo-select5").value;
  if (envoi_boolean == false) {
    socket.emit("reponse_relier", name, reponses);
    envoi_boolean = true;
  }
});

img_send.addEventListener("click", function (e) {
  e.preventDefault();

  const reponse = document.getElementById("reponse").value;

  if (reponse) {
    socket.emit("user_message", pseudoJoueur, reponse);
    socket.emit("send_response", name, reponse);
    document.getElementById("reponse").value = "";
  }
});

pseudo.addEventListener("submit", function (evt) {
  evt.preventDefault();
  name = evt.target["name"].value;

  //si le pseudo n'est pas vide
  if (name) {
    //On se connecte à la socket
    socket = window.io();

    //on indique le pseudo du joueur qui vient de se connecter
    socket.emit("user_join", name);
  }
  StartGame();
});

submission.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const reponse = evt.target["reponse"].value;

  if (reponse) {
    socket.emit("user_message", pseudoJoueur, reponse);
    socket.emit("send_response", name, reponse);
    evt.target["reponse"].value = "";
  }
});

submission_pm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const reponse = evt.target["reponse_pv"].value;

  if (reponse) {
    socket.emit("messagePrivate", pseudoJoueur, pseudoJoueurRecu, reponse);
    evt.target["reponse_pv"].value = "";
  }
});

document.getElementById("mpChat").addEventListener(
  "mouseenter",
  function (event) {
    document.getElementById("mpChat").style.cursor = "pointer";
    // on met l'accent sur la cible de mouseenter
    event.target.style.color = "purple";

    // on réinitialise la couleur après quelques instants
    setTimeout(function () {
      event.target.style.color = "";
    }, 500);
  },
  false
);

// Ce gestionnaire sera exécuté à chaque fois que le curseur
// se déplacera sur un autre élément de la liste
document.getElementById("mpChat").addEventListener(
  "mouseover",
  function (event) {
    // on met l'accent sur la cible de mouseover
    event.target.style.color = "orange";

    // on réinitialise la couleur après quelques instants
    setTimeout(function () {
      event.target.style.color = "";
    }, 500);
  },
  false
);

document.getElementById("mpChat").addEventListener("click", function (e) {
  const collection = document
    .getElementById("mpChat")
    .getElementsByTagName("li");
  for (let i = 0; i < collection.length; i++) {
    collection[i].style.color = "white";
  }
  if (
    e.target &&
    e.target.matches("li") &&
    e.target.innerText != "Vous(" + pseudoJoueur + ")"
  ) {
    //on supprime le chat general
    game.classList.add("hidden");
    //on affiche les dm du mec e.target.innerText
    pseudoJoueurRecu = e.target.innerText;
    private_message.classList.remove("hidden");
  }
});

//timer en secondes
const departMinutes = 2;
let temps = departMinutes * 60;
//departMinutes * 60

//lancement timer
function start() {
  var self = this;
  this.interval = setInterval(() => {
    let minutes = parseInt(temps / 60, 10);
    let secondes = parseInt(temps % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    secondes = secondes < 10 ? "0" + secondes : secondes;
    counterStyle();
    CheckTemps();
    timer.value = `${minutes}:${secondes}`;
    temps = temps <= 0 ? 0 : temps - 1;
  }, 1000);
}

//si le temps tombe a zero on donne la reponse et on passe a une image suivante
function CheckTemps() {
  if (temps == 0) {
    if (envoi_boolean == false) {
      let reponses = [];
      reponses[0] = document.getElementById("pseudo-select").value;
      reponses[1] = document.getElementById("pseudo-select2").value;
      reponses[2] = document.getElementById("pseudo-select3").value;
      reponses[3] = document.getElementById("pseudo-select4").value;
      reponses[4] = document.getElementById("pseudo-select5").value;
      socket.emit("reponse_relier", name, reponses);
    }
    socket.emit("reponse_afficher_final", "Quelle etait la reponse ?");
    clearInterval(this.interval);
    delete this.interval;
  }
}

function refresh() {
  temps = 10;
  clearInterval(this.interval);
  delete this.interval;
  if (!this.interval) this.start();
}

function Play() {
  if (!this.interval) this.start();
}

//changement de couleur du timer
function counterStyle() {
  if (temps < 90) {
    timer.classList.remove("text-green-400");
    timer.classList.add("text-orange-400");
  } else if (temps > 90) {
    timer.classList.remove("text-orange-400");
    timer.classList.add("text-green-400");
  }
}

function playSound(audioName) {
  let audio = new Audio(audioName);
  audio.volume = 0.5;
  audio.play();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function AfficherRep(prenom, pseudo, imageRecu) {
  let j = 0;
  let k = prenom.length;
  do {
    for (let i = 0; i < 5; i++) {
      document.getElementById("img_final").style.width = "72px";
      document.getElementById("img_final").src = imageRecu[j];
      document.getElementById("vrai_pseudo").innerHTML =
        pseudo[j] + " était ...";
      document.getElementById("vrai_prenom").innerHTML = prenom[j];
      if (i == 3) {
        document.getElementById("vrai_prenom").classList.remove("hidden");
      }
      await sleep(i * 1000);
    }
    document.getElementById("vrai_prenom").classList.add("hidden");
    j += 1;
  } while (j < k);
  outro_finale.classList.add("hidden");
  socket.emit("VoirPoints", "voir les points");
}

function StartGame() {
  //on supprime le champs de texte pseudo
  intro.classList.add("hidden");
  //on affiche les questions
  attente.classList.remove("hidden");

  socket.on("send_question", (questionnaire) => {
    const node1 = document.createElement("li");
    const node2 = document.createElement("li");
    const textnode1 = document.createTextNode(questionnaire.question);
    const textnode2 = document.createTextNode(questionnaire.numero);

    node1.appendChild(textnode1);
    node1.style.fontSize = "x-large";
    node1.style["margin"] = "auto";
    node1.style.marginTop = "10px";
    node1.setAttribute("id", "titre2");
    node1.innerHTML = questionnaire.question;

    //////////////////////
    node2.appendChild(textnode2);
    node2.style.fontSize = "small";
    node2.style.width = "max-content";
    node2.style["margin"] = "auto";
    document.getElementById("mychat").appendChild(node1);
    document.getElementById("mychat").appendChild(node2);
    $("#all_game").scrollTop($("#all_game")[0].scrollHeight);
  });

  socket.on("AfficherPoints", (leaderboard) => {
    document.getElementById("points_joueur").classList.remove("hidden");
    classement.innerHTML = `
    ${leaderboard
      .map(
        (player) =>
          `<li class="flex justify-between items-center"> <img class="w-20 h-20" src="${player.image}"/><strong>${player.name}</strong> ${player.points}</li>`
      )
      .join("")}
    `;
  });

  socket.on("pseudo_joueur", function (data) {
    pseudoJoueur = data;
  });

  socket.on("delete_chat", function (data) {
    document.getElementById("mychat").innerHTML = "";
  });

  socket.on("StartGame", function (data) {
    attente.classList.add("hidden");
    game.classList.remove("hidden");
  });

  socket.on("update_Attente", function (pseudoJoueursAttente) {
    let playersNameRecu = [];
    let playersImageRecu =
      "https://cdn.glitch.global/d9fac2fb-dd5e-4283-800f-e504a6e4a40c/incconnu.png?v=1666717467513";
    for (let i = 0; i < pseudoJoueursAttente.length; i++) {
      playersNameRecu[i] = pseudoJoueursAttente[i];
    }
    document.getElementById("salle_joueur").innerHTML = "";
    playersNameRecu.sort();
    for (let i = 0; i < playersNameRecu.length; i++) {
      const node1 = document.createElement("li");
      const textnode1 = document.createTextNode(playersNameRecu[i]);
      var _img = document.createElement("img");
      _img.src = playersImageRecu;
      _img.style.width = "72px";
      node1.appendChild(textnode1);
      node1.style.fontSize = "x-large";
      node1.style.width = "max-content";
      node1.style["margin"] = "auto";
      node1.style.marginTop = "5px";
      document.getElementById("salle_joueur").appendChild(_img);
      document.getElementById("salle_joueur").appendChild(node1);
    }
  });

  socket.on(
    "AfficherReponsesJoueur",
    function (QuestionJoueur, reponseJoueur, nameRecu) {
      if (name == nameRecu) {
        document.getElementById("HistoriqueChat").innerHTML = "";
        for (let i = 0; i < QuestionJoueur.length; i++) {
          const node1 = document.createElement("li");
          const textnode1 = document.createTextNode(
            i + 1 + " - " + QuestionJoueur[i]
          );
          const node2 = document.createElement("li");
          const textnode2 = document.createTextNode(reponseJoueur[i]);
          node1.appendChild(textnode1);
          node2.appendChild(textnode2);
          node1.style.fontSize = "large";
          node1.style.width = "max-content";
          node1.style["margin"] = "auto";
          node1.style.marginTop = "5px";
          node1.style.color = "	#1260CC";
          node2.style.color = "	white";
          node2.style.fontSize = "large";
          node2.style.width = "max-content";
          node2.style["margin"] = "auto";
          node2.style.marginTop = "5px";
          document.getElementById("HistoriqueChat").appendChild(node1);
          document.getElementById("HistoriqueChat").appendChild(node2);
        }
        document.getElementById("historique_joueur").classList.remove("hidden");
        document.getElementById("outro_relier").classList.add("hidden");
      }
    }
  );

  socket.on(
    "reponse_afficher_final_All",
    function (prenom, pseudo, imagesJoueur) {
      let prenomRecu = [];
      let pseudoRecu = [];
      let imageRecu = [];
      for (let i = 0; i < prenom.length; i++) {
        prenomRecu[i] = prenom[i];
        pseudoRecu[i] = pseudo[i];
        imageRecu[i] = imagesJoueur[i];
      }
      outro_relier.classList.add("hidden");
      document.getElementById("historique_joueur").classList.add("hidden");
      outro_finale.classList.remove("hidden");
      AfficherRep(prenomRecu, pseudoRecu, imageRecu);
    }
  );

  socket.on("debutRelier", function (noms, pseudo) {
    start();
    const sel1 = document.getElementById("pseudo-select");
    const sel2 = document.getElementById("pseudo-select2");
    const sel3 = document.getElementById("pseudo-select3");
    const sel4 = document.getElementById("pseudo-select4");
    const sel5 = document.getElementById("pseudo-select5");
    const opt1a = document.createElement("option");
    const opt1b = document.createElement("option");
    const opt1c = document.createElement("option");
    const opt1d = document.createElement("option");
    const opt1e = document.createElement("option");
    opt1a.value = noms[0];
    opt1a.text = noms[0];
    opt1b.value = noms[0];
    opt1b.text = noms[0];
    opt1c.value = noms[0];
    opt1c.text = noms[0];
    opt1d.value = noms[0];
    opt1d.text = noms[0];
    opt1e.value = noms[0];
    opt1e.text = noms[0];
    const opt2a = document.createElement("option");
    const opt2b = document.createElement("option");
    const opt2c = document.createElement("option");
    const opt2d = document.createElement("option");
    const opt2e = document.createElement("option");
    opt2a.value = noms[1];
    opt2a.text = noms[1];
    opt2b.value = noms[1];
    opt2b.text = noms[1];
    opt2c.value = noms[1];
    opt2c.text = noms[1];
    opt2d.value = noms[1];
    opt2d.text = noms[1];
    opt2e.value = noms[1];
    opt2e.text = noms[1];
    const opt3a = document.createElement("option");
    const opt3b = document.createElement("option");
    const opt3c = document.createElement("option");
    const opt3d = document.createElement("option");
    const opt3e = document.createElement("option");
    opt3a.value = noms[2];
    opt3a.text = noms[2];
    opt3b.value = noms[2];
    opt3b.text = noms[2];
    opt3c.value = noms[2];
    opt3c.text = noms[2];
    opt3d.value = noms[2];
    opt3d.text = noms[2];
    opt3e.value = noms[2];
    opt3e.text = noms[2];
    const opt4a = document.createElement("option");
    const opt4b = document.createElement("option");
    const opt4c = document.createElement("option");
    const opt4d = document.createElement("option");
    const opt4e = document.createElement("option");
    opt4a.value = noms[3];
    opt4a.text = noms[3];
    opt4b.value = noms[3];
    opt4b.text = noms[3];
    opt4c.value = noms[3];
    opt4c.text = noms[3];
    opt4d.value = noms[3];
    opt4d.text = noms[3];
    opt4e.value = noms[3];
    opt4e.text = noms[3];
    const opt5a = document.createElement("option");
    const opt5b = document.createElement("option");
    const opt5c = document.createElement("option");
    const opt5d = document.createElement("option");
    const opt5e = document.createElement("option");
    opt5a.value = noms[4];
    opt5a.text = noms[4];
    opt5b.value = noms[4];
    opt5b.text = noms[4];
    opt5c.value = noms[4];
    opt5c.text = noms[4];
    opt5d.value = noms[4];
    opt5d.text = noms[4];
    opt5e.value = noms[4];
    opt5e.text = noms[4];
    
      if(pseudo[0] != null){
      sel1.add(opt1a, null);
      sel2.add(opt1b, null);
      sel3.add(opt1c, null);
      sel4.add(opt1d, null);
      sel5.add(opt1e, null);
    }
    if(pseudo[1] != null){
      sel1.add(opt2a, null);
      sel2.add(opt2b, null);
      sel3.add(opt2c, null);
      sel4.add(opt2d, null);
      sel5.add(opt2e, null);
      }
    if(pseudo[2] != null){
      sel1.add(opt3a, null);
      sel2.add(opt3b, null);
      sel3.add(opt3c, null);
      sel4.add(opt3d, null);
      sel5.add(opt3e, null);
      }
    if(pseudo[3] != null){
      sel1.add(opt4a, null);
      sel2.add(opt4b, null);
      sel3.add(opt4c, null);
      sel4.add(opt4d, null);
      sel5.add(opt4e, null);
      }
    if(pseudo[4] != null){
      sel1.add(opt5a, null);
      sel2.add(opt5b, null);
      sel3.add(opt5c, null);
      sel4.add(opt5d, null);
      sel5.add(opt5e, null);
      }
    joueur_1.setAttribute("value", pseudo[0]);
    joueur_1.style.background = "	#ffb6c1";
    joueur_1.style.borderRadius = "25px";
    joueur_1.style.width = "max-content";
    joueur_1.style.paddingLeft = "5px";
    joueur_1.style.paddingRight = "5px";
    joueur_2.setAttribute("value", pseudo[1]);
    joueur_2.style.background = "	#ffb6c1";
    joueur_2.style.borderRadius = "25px";
    joueur_2.style.width = "max-content";
    joueur_2.style.paddingLeft = "5px";
    joueur_2.style.paddingRight = "5px";
    joueur_3.setAttribute("value", pseudo[2]);
    joueur_3.style.background = "	#ffb6c1";
    joueur_3.style.borderRadius = "25px";
    joueur_3.style.width = "max-content";
    joueur_3.style.paddingLeft = "5px";
    joueur_3.style.paddingRight = "5px";
    joueur_4.setAttribute("value", pseudo[3]);
    joueur_4.style.background = "	#ffb6c1";
    joueur_4.style.borderRadius = "25px";
    joueur_4.style.width = "max-content";
    joueur_4.style.paddingLeft = "5px";
    joueur_4.style.paddingRight = "5px";
    joueur_5.setAttribute("value", pseudo[4]);
    joueur_5.style.background = "	#ffb6c1";
    joueur_5.style.width = "max-content";
    joueur_5.style.borderRadius = "25px";
    joueur_5.style.paddingLeft = "5px";
    joueur_5.style.paddingRight = "5px";
    //on supprime le jeu
    game.classList.add("hidden");
    //on affiche le jeu de fin (relier)
    outro_relier.classList.remove("hidden");
  });

  socket.on("updateNotif", function (pseudoJoueurEnvoi, pseudoJoueurRecu) {
    if (pseudoJoueur == pseudoJoueurRecu) {
      console.log("changement de couleur de : " + pseudoJoueurEnvoi);
      const collection = document
        .getElementById("mpChat")
        .getElementsByTagName("li");
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].innerHTML == pseudoJoueurEnvoi) {
          collection[i].style.color = "green";
        }
      }
    }
  });

  socket.on("MessagePriveEnvoi", function (PseudoRecu, PseudoEnvoi, Message) {
    if (pseudoJoueur == PseudoEnvoi || pseudoJoueur == PseudoRecu) {
      const node1 = document.createElement("li");
      const node2 = document.createElement("li");
      const node3 = document.createElement("li");
      const textnode3 = document.createTextNode("Nouveau Message");
      const textnode1 = document.createTextNode(PseudoEnvoi);
      const textnode2 = document.createTextNode(Message);
      node1.appendChild(textnode1);
      node1.style.marginTop = "15px";
      node1.style.color = "	#ffb6c1";
      node2.appendChild(textnode2);
      node2.style.color = "black";
      node2.style.background = "	#ffb6c1";
      node2.style.borderRadius = "25px";
      node2.style.width = "max-content";
      node2.style.paddingLeft = "5px";
      node2.style.paddingRight = "5px";
      node2.style["font-size"] = "20px";
      node3.setAttribute("id", "titre");
      node3.style.paddingTop = "5px";
      node3.innerHTML = "Nouveau Message";
      if (PseudoEnvoi == pseudoJoueur) {
        node2.style.background = "	#1260CC";
        node2.style.color = "white";
        node2.style.marginTop = "10px";
        node2.style["float"] = "right";
        //si c'est pas nous
      } else if (PseudoEnvoi != pseudoJoueur) {
        if (pseudoQuiNousDM != PseudoEnvoi) {
          document.getElementById("privateChat").appendChild(node3);
        }
        document.getElementById("privateChat").appendChild(node1);
        playSound(
          "https://cdn.glitch.global/d9fac2fb-dd5e-4283-800f-e504a6e4a40c/messageRecu.mp3?v=1666703414083"
        );
      }
      document.getElementById("privateChat").appendChild(node2);
      $("#pm_game").scrollTop($("#pm_game")[0].scrollHeight);
      pseudoQuiNousDM = PseudoRecu;
    }
  });

  socket.on("update_players", function (Datapseudo, Dataimage) {
    document.getElementById("mpChat").innerHTML = "";
    Datapseudo.sort();
    Dataimage.sort();
    for (let i = 0; i < Datapseudo.length; i++) {
      if (Datapseudo[i] == pseudoJoueur) {
        Datapseudo[i] = "Vous(" + Datapseudo[i] + ")";
      }
      const node1 = document.createElement("li");
      const textnode1 = document.createTextNode(Datapseudo[i]);
      var _img = document.createElement("img");
      _img.src = Dataimage[i];
      _img.style.width = "72px";
      node1.appendChild(textnode1);
      node1.style.fontSize = "x-large";
      node1.style.width = "max-content";
      node1.style["margin"] = "auto";
      node1.style.marginTop = "5px";
      document.getElementById("mpChat").appendChild(_img);
      document.getElementById("mpChat").appendChild(node1);
    }
  });

  socket.on("updateNewMessage", function (NamePlayer, Message) {
    const node1 = document.createElement("li");
    const node2 = document.createElement("li");
    const textnode1 = document.createTextNode(NamePlayer);
    const textnode2 = document.createTextNode(Message);
    node1.appendChild(textnode1);
    node1.style.marginTop = "10px";
    node1.style.color = "	#ffb6c1";
    node2.appendChild(textnode2);
    node2.style.color = "black";
    node2.style.background = "	#ffb6c1";
    node2.style.borderRadius = "25px";
    node2.style.width = "max-content";
    node2.style.paddingLeft = "5px";
    node2.style.paddingRight = "5px";
    node2.style["font-size"] = "20px";
    if (NamePlayer == pseudoJoueur) {
      node2.style.background = "	#1260CC";
      node2.style.color = "white";
      node2.style.marginTop = "10px";
      node2.style["float"] = "right";
    } else if (NamePlayer != pseudoJoueur) {
      document.getElementById("mychat").appendChild(node1);
      playSound(
        "https://cdn.glitch.global/d9fac2fb-dd5e-4283-800f-e504a6e4a40c/messageEnvoi.mp3?v=1666703413833"
      );
    }
    document.getElementById("mychat").appendChild(node2);
    $("#all_game").scrollTop($("#all_game")[0].scrollHeight);
  });
}
