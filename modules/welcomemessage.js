Hooks.once("init", function() {
    console.log("Initializing Ysystem")

    game.settings.register("hojas-pj-ysystem", "firstTimeStart", {
       name: "Forzar mensaje de Bienvenida",
        hint: "Si marcas esta casilla te aparecerá el mensaje de bienvenida en el chat la próxima vez que entres.",
        scope: "client",
        config: true,
        default: false,
        type: Boolean
    })
})



Hooks.once("ready", function() {
	let buttonId=Date.now();
	let buttonIdYsystem=Date.now()+2;
	let buttonIdImserso=Date.now()+3;
	let buttonIdCuervos=Date.now()+4;
	let mensbienv='<h1>Bienvenido al módulo de fichas de Ysystem</h1>';
	let mensimpfirst='<p style= "font-family:Candara_Bold;font-size: 15px;">Importa los compendios para empezar a usar el módulo</p><button id='+buttonIdYsystem+' style= "font-family:Candara_Bold;font-size: 20px;">Importa los Compendios para Ysystem</button><button id='+buttonIdImserso+' style= "font-family:Candara_Bold;font-size: 20px;">Importa los Compendios de IMSERSO to the Limit</button><button id='+buttonIdCuervos+' style= "font-family:Candara_Bold;font-size: 20px;">Importa los Compendios de Cuervos de Asgard</button>';
	let mensimpact='<p style= "font-family:Candara_Bold;font-size: 15px;">Se ha actualizado el módulo desde la última vez que lo usaste. Importa los compendios para tener la última versión de las Templates de actores y objetos.</p><<button id='+buttonIdYsystem+' style= "font-family:Candara_Bold;font-size: 20px;">Importa los Compendios para Ysystem</button><button id='+buttonIdImserso+' style= "font-family:Candara_Bold;font-size: 20px;">Importa los Compendios de IMSERSO to the Limit</button><button id='+buttonIdCuervos+' style= "font-family:Candara_Bold;font-size: 20px;">Importa los Compendios de Cuervos de Asgard</button>'
	let mensrecordtut='<p style= "font-family:Candara_Bold;font-size: 15px;">Si quieres saber más de como usar el módulo:</p><button id='+buttonId+' style= "font-family:Candara_Bold;font-size: 20px;">Ve al Tutorial</button>';
	
	let forzarbienvenida=game.settings.get("hojas-pj-ysystem", "firstTimeStart");
	let forzarmensaje;
	console.log(forzarmensaje);
	if (forzarbienvenida==true) {
		forzarmensaje=true;
	}
	let versactual=game.modules.get("hojas-pj-ysystem").version;
	let userisGM=game.user.isGM;
	if (userisGM) {
		if(!game.user.getFlag("hojas-pj-ysystem", "welcomeMessage") || forzarmensaje==true) {
			let msg=mensbienv+mensimpfirst+mensrecordtut;
			ChatMessage.create({
        		speaker: {alias:"Ysystem"},
        		content: msg,
				whisper : ChatMessage.getWhisperRecipients(game.user.name)
			}).then(() => {
				setTimeout(() => {
				function openInNewTab(url) {
					const win = window.open(url, '_blank');
					win.focus();
				}
				const button = document.getElementById(buttonId);
				if (button) {
					button.addEventListener("click",function () {
						openInNewTab('https://github.com/darokin-rpg/hojas-pj-ysystem')
					});
				}
				const buttonYsystem = document.getElementById(buttonIdYsystem);
				if (buttonYsystem) {
					buttonYsystem.addEventListener("click",function () {
						let collectionYsystem= game.packs.get("hojas-pj-ysystem.actores-ysystem");
						let folderidentYsystem=''
						if (game.folders.getName("Actores Ysystem")) {
							folderidentYsystem=game.folders.getName("Actores Ysystem").id;
						}
						let docs =  collectionYsystem.importAll({folderId: folderidentYsystem, folderName: "Actores Ysystem", keepId: true});
						game.user.setFlag("hojas-pj-ysystem", "welcomeMessage", true);
						game.user.setFlag("hojas-pj-ysystem", "lastVersion", game.modules.get("hojas-pj-ysystem").version);
					});
				};
				const buttonImserso = document.getElementById(buttonIdImserso);
				if (buttonImserso) {
					buttonImserso.addEventListener("click",function () {
						let collectionImserso= game.packs.get("hojas-pj-ysystem.actores-imserso");
						let folderidentImserso=''
						if (game.folders.getName("Actores Imserso")) {
							folderidentImserso=game.folders.getName("Actores Imserso").id;
						}
						let docs =  collectionImserso.importAll({folderId: folderidentImserso, folderName: "Actores Imserso", keepId: true});
						game.user.setFlag("hojas-pj-ysystem", "welcomeMessage", true);
						game.user.setFlag("hojas-pj-ysystem", "lastVersion", game.modules.get("hojas-pj-ysystem").version);
					});
				};
				const buttonCuervos = document.getElementById(buttonIdCuervos);
				if (buttonCuervos) {
					buttonCuervos.addEventListener("click",function () {
						let collectionCuervos= game.packs.get("hojas-pj-ysystem.actores-cuervos-asgard");
						let folderidentCuervos=''
						if (game.folders.getName("Actores Cuervos de Asgard")) {
							folderidentCuervos=game.folders.getName("Actores Cuervos de Asgard").id;
						}
						let docs =  collectionCuervos.importAll({folderId: folderidentCuervos, folderName: "Actores Cuervos de Asgard", keepId: true});
						game.user.setFlag("hojas-pj-ysystem", "welcomeMessage", true);
						game.user.setFlag("hojas-pj-ysystem", "lastVersion", game.modules.get("hojas-pj-ysystem").version);
					});
				};
				}, 100);
			});
			game.settings.set("hojas-pj-ysystem", "firstTimeStart", false);
		} else if (versactual!=game.user.getFlag("hojas-pj-ysystem", "lastVersion")) {
			let msg=mensbienv+mensimpact+mensrecordtut;
			ChatMessage.create({
					speaker: {alias:"Ysystem"},
					content: msg,
			   whisper : ChatMessage.getWhisperRecipients(game.user.name)
			}).then(() => {
				setTimeout(() => {
				function openInNewTab(url) {
					const win = window.open(url, '_blank');
					win.focus();
				}
				const button = document.getElementById(buttonId);
				if (button) {
					button.addEventListener("click",function () {
						openInNewTab('https://github.com/darokin-rpg/hojas-pj-ysystem')
					});
				}
				const buttonYsystem = document.getElementById(buttonIdYsystem);
				if (buttonYsystem) {
					buttonYsystem.addEventListener("click",function () {
						let collectionYsystem= game.packs.get("hojas-pj-ysystem.actores-ysystem");
						let folderidentYsystem=''
						if (game.folders.getName("Actores Ysystem")) {
							folderidentYsystem=game.folders.getName("Actores Ysystem").id;
						}
						let docs =  collectionYsystem.importAll({folderId: folderidentYsystem, folderName: "Actores Ysystem", keepId: true});
						game.user.setFlag("hojas-pj-ysystem", "welcomeMessage", true);
						game.user.setFlag("hojas-pj-ysystem", "lastVersion", game.modules.get("hojas-pj-ysystem").version);
					});
				};
				const buttonImserso = document.getElementById(buttonIdImserso);
				if (buttonImserso) {
					buttonImserso.addEventListener("click",function () {
						let collectionImserso= game.packs.get("hojas-pj-ysystem.actores-imserso");
						let folderidentImserso=''
						if (game.folders.getName("Actores Imserso")) {
							folderidentImserso=game.folders.getName("Actores Imserso").id;
						}
						let docs =  collectionImserso.importAll({folderId: folderidentImserso, folderName: "Actores Imserso", keepId: true});
						game.user.setFlag("hojas-pj-ysystem", "welcomeMessage", true);
						game.user.setFlag("hojas-pj-ysystem", "lastVersion", game.modules.get("hojas-pj-ysystem").version);
					});
				};
				const buttonCuervos = document.getElementById(buttonIdCuervos);
				if (buttonCuervos) {
					buttonCuervos.addEventListener("click",function () {
						let collectionCuervos= game.packs.get("hojas-pj-ysystem.actores-cuervos-asgard");
						let folderidentCuervos=''
						if (game.folders.getName("Actores Cuervos de Asgard")) {
							folderidentCuervos=game.folders.getName("Actores Cuervos de Asgard").id;
						}
						let docs =  collectionCuervos.importAll({folderId: folderidentCuervos, folderName: "Actores Cuervos de Asgard", keepId: true});
						game.user.setFlag("hojas-pj-ysystem", "welcomeMessage", true);
						game.user.setFlag("hojas-pj-ysystem", "lastVersion", game.modules.get("hojas-pj-ysystem").version);
					});
				};
				}, 100);
			});
		}
	} else if (!game.user.getFlag("hojas-pj-ysystem", "welcomeMessage") || forzarmensaje==true) {
		let msg = mensbienv+mensrecordtut;
		ChatMessage.create({
        		speaker: {alias:"Ysystem"},
        		content: msg,
				whisper : ChatMessage.getWhisperRecipients(game.user.name)
		}).then(() => {
			setTimeout(() => {
			function openInNewTab(url) {
				const win = window.open(url, '_blank');
				win.focus();
			}
			const button = document.getElementById(buttonId);
			if (button) {
				button.addEventListener("click",function () {
					openInNewTab('https://github.com/darokin-rpg/hojas-pj-ysystem');
				});
			}
			}, 100);
		});
		game.user.setFlag("hojas-pj-ysystem", "welcomeMessage", true);
		game.settings.set("hojas-pj-ysystem", "firstTimeStart", false);
	}
})