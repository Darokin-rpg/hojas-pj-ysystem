Hooks.on("renderChatMessage", (message, html, data) => {
    const button = html.find('.proezabutton:not(.proeza-res-button):not(.yayobutton):not(.yayo-res-button)');
    if (button.length === 0) return;

    button.on("click", async (event) => {
        event.preventDefault();

        const dataset = event.currentTarget.dataset;
        const actorid = dataset.actorid;
        const habname = dataset.habname;
        const tipo_tirada = parseInt(dataset.tipotirada);
        const bonusnum = parseInt(dataset.bonusnum);
        const successes = parseInt(dataset.successes);

        const actor = game.actors.get(actorid);
        if (!actor) return ui.notifications.error("No se encontró el Actor.");

        const originalRoll = message.rolls[0];
        if (!originalRoll) return ui.notifications.error("No se encontró la tirada original.");
        
        const diceresults = originalRoll.terms[0].results.map(d => d.result);

        let dicenumberresults = "";
        for (let i = 0; i < diceresults.length; i++) {
            dicenumberresults += "<div class='repdie'><label>" + diceresults[i] + "</label><div><input type='checkbox' name='dice" + i + "'></div></div>";
        }

        const content = "<form><h3>¿Qué dados vas a repetir?</h3><div class='repdice'>" + dicenumberresults + "</div></form>";

        new Dialog({
            title: "Tirada con Proeza",
            content: content,
            buttons: {
                ok: {
                    label: "¡Tira los dados!",
                    callback: async (dialogHtml) => {
                        let newdicetoroll = 0;
                        let notrolleddice = [];
                        let notrolleddicetotal = 0;

                        for (let i = 0; i < diceresults.length; i++) {
                            if (dialogHtml.find("[name=dice" + i + "]")[0].checked) {
                                newdicetoroll++;
                            } else {
                                notrolleddice.push(diceresults[i]);
                                notrolleddicetotal += diceresults[i];
                            }
                        }

                        if (newdicetoroll === 0) return ui.notifications.warn("No seleccionaste ningún dado.");

                        const r2 = new Roll(newdicetoroll + "d6+" + bonusnum);
                        await r2.evaluate();

                        // Lanzamos los dados 3D con la textura del Actor
                        if (game.modules.get("dice-so-nice")?.active) {
                            game.dice3d.showForRoll(r2, game.user, true, null, null, null, message.speaker);
                        }

                        const newRolled = r2.terms[0].results.map(r => r.result);
                        r2._total += notrolleddicetotal;
                        r2._formula = originalRoll._formula; 
                        
                        for (let i = 0; i < notrolleddice.length; i++) {
                            r2.terms[0].results.push({ result: notrolleddice[i], active: true, indexThrow: 0 });
                        }

                        const finalDiceResults = [...newRolled, ...notrolleddice];
                        let fails2 = 0;
                        for (let result of finalDiceResults) {
                            if (result === 1) fails2++;
                        }

                        let pifiatext2 = (fails2 === finalDiceResults.length && finalDiceResults.length > 0) ? "<h2>Pifia</h2>" : "";

                        const currentProezas = parseInt(actor.system.props.proezas_valor) || 0;
                        let newProezasValue = currentProezas; 
                        
                        if (tipo_tirada === 1 && successes >= 2) newProezasValue -= 1;
                        else if (successes >= 2) newProezasValue = currentProezas; 
                        else if (tipo_tirada === 1) newProezasValue -= 2;
                        else newProezasValue -= 1;
                        
                        await actor.update({ "system.props.proezas_valor": newProezasValue.toString() });

                        let r2rendered = await r2.render();
                        const messageTable = "<h1>" + habname + "</h1><h2>Proeza Gastada</h2>" + r2rendered + pifiatext2;

                        await ChatMessage.create({
							user: game.user._id,
							speaker: message.speaker,
							content: messageTable,
							rolls: [r2],
							sound: null, // <-- Añade esta línea
							flags: { "dice-so-nice": { skip: true } }
						});

                        const oldContent = message.content.replace(/<div class=['"]proeza-btn-container['"]>[\s\S]*?<\/div>/, "<p><em>(Proeza gastada)</em></p>");
                        await game.messages.get(message.id).update({ content: oldContent });
                    }
                }
            }
        }).render(true);
    });
});
// HOOK EXCLUSIVO PARA TIRADAS DE RESISTENCIA FÍSICA
Hooks.on("renderChatMessage", (message, html, data) => {
    const button = html.find('.proeza-res-button');
    if (button.length === 0) return;

    button.on("click", async (event) => {
        event.preventDefault();

        const dataset = event.currentTarget.dataset;
        const actorid = dataset.actorid;
        const resfisica = parseInt(dataset.resfisica) || 0;
        const bonusnum = parseInt(dataset.bonusnum) || 0;
        const subtitleText = dataset.subtitle ? "<h2>" + dataset.subtitle + "</h2>" : "";

        const actor = game.actors.get(actorid);
        if (!actor) return ui.notifications.error("No se encontró el Actor.");

        const originalRoll = message.rolls[0];
        if (!originalRoll) return ui.notifications.error("No se encontró la tirada original.");
        
        const diceresults = originalRoll.terms[0].results.map(d => d.result);

        let dicenumberresults = "";
        for (let i = 0; i < diceresults.length; i++) {
            dicenumberresults += "<div class='repdie'><label>" + diceresults[i] + "</label><div><input type='checkbox' name='dice" + i + "'></div></div>";
        }

        const content = "<form><h3>¿Qué dados vas a repetir?</h3><div class='repdice'>" + dicenumberresults + "</div></form>";

        new Dialog({
            title: "Resistencia con Proeza",
            content: content,
            buttons: {
                ok: {
                    label: "¡Tira los dados!",
                    callback: async (dialogHtml) => {
                        let newdicetoroll = 0;
                        let notrolleddice = [];
                        let notrolleddicetotal = 0;

                        for (let i = 0; i < diceresults.length; i++) {
                            if (dialogHtml.find("[name=dice" + i + "]")[0].checked) {
                                newdicetoroll++;
                            } else {
                                notrolleddice.push(diceresults[i]);
                                notrolleddicetotal += diceresults[i];
                            }
                        }

                        if (newdicetoroll === 0) return ui.notifications.warn("No seleccionaste ningún dado.");

                        const r2 = new Roll(newdicetoroll + "d6+" + bonusnum);
                        await r2.evaluate();

                        if (game.modules.get("dice-so-nice")?.active) {
                            game.dice3d.showForRoll(r2, game.user, true, null, null, null, message.speaker);
                        }

                        const newRolled = r2.terms[0].results.map(r => r.result);
                        r2._total += notrolleddicetotal;
                        r2._formula = originalRoll._formula; 
                        
                        for (let i = 0; i < notrolleddice.length; i++) {
                            r2.terms[0].results.push({ result: notrolleddice[i], active: true, indexThrow: 0 });
                        }

                        let exitotext2 = "";
                        if (resfisica <= r2._total) {
                            exitotext2 = "<h2>Éxito</h2>";
                        } else {
                            exitotext2 = "<h2>Fracaso</h2>";
                        }

                        const currentProezas = parseInt(actor.system.props.proezas_valor) || 0;
                        await actor.update({ "system.props.proezas_valor": (currentProezas - 1).toString() });

                        let r2rendered = await r2.render();
                        const messageTable = "<h1>Resistencia Física</h1>" + subtitleText + "<h2>Proeza Gastada</h2>" + r2rendered + exitotext2;

                        await ChatMessage.create({
                            user: game.user._id,
                            speaker: message.speaker,
                            content: messageTable,
                            rolls: [r2],
                            sound: null,
                            flags: { "dice-so-nice": { skip: true } }
                        });

                        const oldContent = message.content.replace(/<div class=['"]proeza-btn-container['"]>[\s\S]*?<\/div>/, "<p><em>(Proeza gastada)</em></p>");
                        await game.messages.get(message.id).update({ content: oldContent });
                    }
                }
            }
        }).render(true);
    });
});
// HOOK EXCLUSIVO PARA TIRADAS CON YAYOPOINTS
Hooks.on("renderChatMessage", (message, html, data) => {
    const button = html.find('.yayobutton');
    if (button.length === 0) return;

    button.on("click", async (event) => {
        event.preventDefault();

        const dataset = event.currentTarget.dataset;
        const actorid = dataset.actorid;
        const habname = dataset.habname;
        const tipo_tirada = parseInt(dataset.tipotirada);
        const bonusnum = parseInt(dataset.bonusnum);
        const successes = parseInt(dataset.successes);

        const actor = game.actors.get(actorid);
        if (!actor) return ui.notifications.error("No se encontró el Actor.");

        const originalRoll = message.rolls[0];
        if (!originalRoll) return ui.notifications.error("No se encontró la tirada original.");
        
        const diceresults = originalRoll.terms[0].results.map(d => d.result);

        let dicenumberresults = "";
        for (let i = 0; i < diceresults.length; i++) {
            dicenumberresults += "<div class='repdie'><label>" + diceresults[i] + "</label><div><input type='checkbox' name='dice" + i + "'></div></div>";
        }

        const content = "<form><h3>¿Qué dados vas a repetir?</h3><div class='repdice'>" + dicenumberresults + "</div></form>";

        new Dialog({
            title: "Tirada con Yayopoint",
            content: content,
            buttons: {
                ok: {
                    label: "¡Tira los dados!",
                    callback: async (dialogHtml) => {
                        let newdicetoroll = 0;
                        let notrolleddice = [];
                        let notrolleddicetotal = 0;

                        for (let i = 0; i < diceresults.length; i++) {
                            if (dialogHtml.find("[name=dice" + i + "]")[0].checked) {
                                newdicetoroll++;
                            } else {
                                notrolleddice.push(diceresults[i]);
                                notrolleddicetotal += diceresults[i];
                            }
                        }

                        if (newdicetoroll === 0) return ui.notifications.warn("No seleccionaste ningún dado.");

                        const r2 = new Roll(newdicetoroll + "d6+" + bonusnum);
                        await r2.evaluate();

                        if (game.modules.get("dice-so-nice")?.active) {
                            game.dice3d.showForRoll(r2, game.user, true, null, null, null, message.speaker);
                        }

                        const newRolled = r2.terms[0].results.map(r => r.result);
                        r2._total += notrolleddicetotal;
                        r2._formula = originalRoll._formula; 
                        
                        for (let i = 0; i < notrolleddice.length; i++) {
                            r2.terms[0].results.push({ result: notrolleddice[i], active: true, indexThrow: 0 });
                        }

                        const finalDiceResults = [...newRolled, ...notrolleddice];
                        let fails2 = 0;
                        for (let result of finalDiceResults) {
                            if (result === 1) fails2++;
                        }

                        let pifiatext2 = (fails2 === finalDiceResults.length && finalDiceResults.length > 0) ? "<h2>Pifia</h2>" : "";

                        const currentProezas = parseInt(actor.system.props.proezas_valor) || 0;
                        let newProezasValue = currentProezas; 
                        
                        if (tipo_tirada === 1 && successes >= 2) newProezasValue -= 1;
                        else if (successes >= 2) newProezasValue = currentProezas; 
                        else if (tipo_tirada === 1) newProezasValue -= 2;
                        else newProezasValue -= 1;
                        
                        await actor.update({ "system.props.proezas_valor": newProezasValue.toString() });

                        let r2rendered = await r2.render();
                        const messageTable = "<h1>" + habname + "</h1><h2>Yayopoint Gastado</h2>" + r2rendered + pifiatext2;

                        await ChatMessage.create({
                            user: game.user._id,
                            speaker: message.speaker,
                            content: messageTable,
                            rolls: [r2],
                            sound: null,
                            flags: { "dice-so-nice": { skip: true } }
                        });

                        const oldContent = message.content.replace(/<div class=['"]proeza-btn-container['"]>[\s\S]*?<\/div>/, "<p><em>(Yayopoint gastado)</em></p>");
                        await game.messages.get(message.id).update({ content: oldContent });
                    }
                }
            }
        }).render(true);
    });
});
// HOOK EXCLUSIVO PARA JAMACUCO (RESISTENCIA) CON YAYOPOINTS
Hooks.on("renderChatMessage", (message, html, data) => {
    const button = html.find('.yayo-res-button');
    if (button.length === 0) return;

    button.on("click", async (event) => {
        event.preventDefault();

        const dataset = event.currentTarget.dataset;
        const actorid = dataset.actorid;
        const resfisica = parseInt(dataset.resfisica) || 0;
        const bonusnum = parseInt(dataset.bonusnum) || 0;
        // Leemos el subtítulo si lo hay
        const subtitleText = dataset.subtitle ? "<h2>" + dataset.subtitle + "</h2>" : "";

        const actor = game.actors.get(actorid);
        if (!actor) return ui.notifications.error("No se encontró el Actor.");

        const originalRoll = message.rolls[0];
        if (!originalRoll) return ui.notifications.error("No se encontró la tirada original.");
        
        const diceresults = originalRoll.terms[0].results.map(d => d.result);

        let dicenumberresults = "";
        for (let i = 0; i < diceresults.length; i++) {
            dicenumberresults += "<div class='repdie'><label>" + diceresults[i] + "</label><div><input type='checkbox' name='dice" + i + "'></div></div>";
        }

        const content = "<form><h3>¿Qué dados vas a repetir?</h3><div class='repdice'>" + dicenumberresults + "</div></form>";

        new Dialog({
            title: "Tirada con Yayopoint",
            content: content,
            buttons: {
                ok: {
                    label: "¡Tira los dados!",
                    callback: async (dialogHtml) => {
                        let newdicetoroll = 0;
                        let notrolleddice = [];
                        let notrolleddicetotal = 0;

                        for (let i = 0; i < diceresults.length; i++) {
                            if (dialogHtml.find("[name=dice" + i + "]")[0].checked) {
                                newdicetoroll++;
                            } else {
                                notrolleddice.push(diceresults[i]);
                                notrolleddicetotal += diceresults[i];
                            }
                        }

                        if (newdicetoroll === 0) return ui.notifications.warn("No seleccionaste ningún dado.");

                        const r2 = new Roll(newdicetoroll + "d6+" + bonusnum);
                        await r2.evaluate();

                        if (game.modules.get("dice-so-nice")?.active) {
                            game.dice3d.showForRoll(r2, game.user, true, null, null, null, message.speaker);
                        }

                        const newRolled = r2.terms[0].results.map(r => r.result);
                        r2._total += notrolleddicetotal;
                        r2._formula = originalRoll._formula; 
                        
                        for (let i = 0; i < notrolleddice.length; i++) {
                            r2.terms[0].results.push({ result: notrolleddice[i], active: true, indexThrow: 0 });
                        }

                        let exitotext2 = "";
                        if (resfisica <= r2._total) {
                            exitotext2 = "<h2>Éxito</h2>";
                        } else {
                            exitotext2 = "<h2>Fracaso</h2>";
                        }

                        const currentProezas = parseInt(actor.system.props.proezas_valor) || 0;
                        await actor.update({ "system.props.proezas_valor": (currentProezas - 1).toString() });

                        let r2rendered = await r2.render();
                        // Incluimos el subtitulo en el mensaje final
                        const messageTable = "<h1>¡Jamacuco!</h1>" + subtitleText + "<h2>Yayopoint Gastado</h2>" + r2rendered + exitotext2;

                        await ChatMessage.create({
                            user: game.user._id,
                            speaker: message.speaker,
                            content: messageTable,
                            rolls: [r2],
                            sound: null, 
                            flags: { "dice-so-nice": { skip: true } }
                        });

                        const oldContent = message.content.replace(/<div class=['"]proeza-btn-container['"]>[\s\S]*?<\/div>/, "<p><em>(Yayopoint gastado)</em></p>");
                        await game.messages.get(message.id).update({ content: oldContent });
                    }
                }
            }
        }).render(true);
    });
});