Hooks.once('ready', async function() {
	Hooks.on('renderCardsConfig', (doc, html, obj) => {
		if(obj.data.type === "deck") {
			addDuplicateButton(doc, html, obj);
			addDeckFlip(doc, html, obj);
		}
	});
	Hooks.on('renderMonarchDeck', (doc, html, obj) => {
		addDuplicateButton(doc, html, obj);
		addDeckFlip(doc, html, obj);
	});
	
	function addDuplicateButton(doc, html, obj) {
		let controls = html.find(".card .card-controls");
		const duplicateCard = $('<a class="card-control card-duplicate" title="Duplicate Card" data-action="duplicate"><i class="fas fa-copy"></i></a>');
		controls.prepend(duplicateCard);
		html.find(".card-duplicate").click(onDuplicate.bind(doc));
	}
	
	function addDeckFlip(doc, html, obj) {
		const flipDeck = $('<div class="card-faces"> <a class="card-control deck-flip-next" title="Next Face" data-action="nextFace"><i class="fas fa-caret-up"></i></a> <a class="card-control deck-flip-prev" title="Previous Face" data-action="prevFace"><i class="fas fa-caret-down"></i></a> </div>');
		let deckControl = html.find(".cards-header");
		deckControl.prepend(flipDeck);
		html.find(".deck-flip-next").click(onDeckFlipNext.bind(doc));
		html.find(".deck-flip-prev").click(onDeckFlipPrev.bind(doc));
	}
	
	function onDuplicate(event) {
		const button = event.currentTarget;
		const li = button.closest(".card");
		const card = li ? this.object.cards.get(li.dataset.cardId) : null;
		switch ( button.dataset.action ) {
		  case "duplicate":
			let dupe = [];
			const createData = foundry.utils.mergeObject(card.toObject(), {drawn: false});
			dupe.push(createData);
			return this.object.createEmbeddedDocuments("Card", dupe, {keepId: false});
		}
	}
	
	function onDeckFlipNext(event) {
		let update = [];
		this.object.cards.forEach((card) => {
			if(card.hasNextFace) {
				update.push({_id: card.id, face: card.data.face === null ? 0 : card.data.face+1});
			}
		});
		sendDeckFlipUpdate(this.object, update);
	}
	
	function onDeckFlipPrev(event) {
		let update = [];
		this.object.cards.forEach((card) => {
			if(card.hasPreviousFace) {
				update.push({_id: card.id, face: card.data.face === 0 ? null : card.data.face-1});
			}
		});
		sendDeckFlipUpdate(this.object, update);
	}
	
	function sendDeckFlipUpdate(deck, update) {
		if(update.length > 0) {
			const result = deck.updateEmbeddedDocuments("Card", update);
			deck._postChatNotification(deck, "Deck Flipped: {link}", {link: deck.link});
			return result;
		}
	}
});
