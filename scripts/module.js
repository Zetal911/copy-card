Hooks.once('ready', async function() {
	Hooks.on('renderCardsConfig', (doc, html, obj) => {
		if(obj.data.type === "deck") {
			addDuplicateButton(doc, html, obj);
		}
	});
	Hooks.on('renderMonarchDeck', (doc, html, obj) => {
		addDuplicateButton(doc, html, obj);
	});
	
	function addDuplicateButton(doc, html, obj) {
		let controls = html.find(".card-controls");
		const duplicateCard = $('<a class="card-control card-duplicate" title="Duplicate Card" data-action="duplicate"><i class="fas fa-copy"></i></a>');
		controls.prepend(duplicateCard);
		html.find(".card-duplicate").click(onDuplicate.bind(doc));
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
});
