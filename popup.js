const POSITION_ROWS = 3;
const POSITION_COLS = 3;

function updateDeleteButtonVisibility(wordListLength) {
	const deleteButton = document.getElementById('deleteButton');

	if (wordListLength) deleteButton.style.display = 'block';
	else deleteButton.style.display = 'none';
}

function addWordToList(word) {
	const wordList = document.getElementById('wordList');

	const li = document.createElement('li');
	li.setAttribute('data-word', word);
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.value = word;
	li.appendChild(checkbox);
	li.appendChild(document.createTextNode(word));
	wordList.appendChild(li);
	
	updateDeleteButtonVisibility(true);
}

function addBox(rowElement, rowNumber, colNumber) {
	const positionBox = document.createElement('div');
	positionBox.classList.add('positionBox');
	positionBox.setAttribute('data-grid', colNumber + POSITION_ROWS * (rowNumber - 1));

	rowElement.appendChild(positionBox);
}

function addRow(rowElement, rowNumber) {
	for (let colNumber = 1; colNumber <= POSITION_COLS; colNumber++) addBox(rowElement, rowNumber, colNumber);
}

function addPositioningGrid(gridSelector) {
	for (let rowNumber = 1; rowNumber <= POSITION_ROWS; rowNumber++) {
		const rowElement = document.createElement('div');
		rowElement.classList.add('positionRow')

		addRow(rowElement, rowNumber);

		gridSelector.appendChild(rowElement);
	}
}

document.addEventListener('DOMContentLoaded', function () {
    const wordForm = document.getElementById('wordForm');
    const wordInput = document.getElementById('wordInput');
    const deleteSelectedButton = document.getElementById('deleteButton');
	const gridSelector = document.getElementById('gridSelector');

	addPositioningGrid(gridSelector)

    chrome.storage.sync.get(['words', 'gridPosition'], function(result) {
		const words = result.words || [];
		updateDeleteButtonVisibility(words.length)

		const gridPosition = result.gridPosition || 5;
		words.forEach(word => addWordToList(word));

		const selectedButton = document.querySelector(`.positionBox[data-grid="${gridPosition}"]`);
		if (selectedButton) selectedButton.classList.add('selectedPosition');
    });
  
    wordForm.addEventListener('submit', function(e) {
		e.preventDefault();

		const word = wordInput.value.trim();
		if (word) {
			chrome.storage.sync.get(['words'], function(result) {
				const words = result.words || [];
				if (!words.includes(word)) {
					words.push(word);
					chrome.storage.sync.set({ words: words }, function() {
						addWordToList(word);
						wordInput.value = '';
					});
				}
			});
		}
    });
  
    deleteSelectedButton.addEventListener('click', function() {
		const selectedWords = [];
		const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
		checkboxes.forEach(checkbox => {
			selectedWords.push(checkbox.value);
		});

		chrome.storage.sync.get(['words'], function(result) {
			const words = result.words || [];
			const newWords = words.filter(word => !selectedWords.includes(word));

			chrome.storage.sync.set({ words: newWords }, function() {
				selectedWords.forEach(word => {
					const li = document.querySelector(`li[data-word="${word}"]`);
					if (li) li.remove();
				});
			});

			updateDeleteButtonVisibility(newWords.length);
		});

    });

	gridSelector.addEventListener('click', function (e) {
		if (e.target.classList.contains('positionBox')) {
			const gridPosition = parseInt(e.target.getAttribute('data-grid'));

			chrome.storage.sync.set({ gridPosition: gridPosition }, function () {
				document.querySelectorAll('.positionBox').forEach(button => {
					button.classList.remove('selectedPosition');
				});

				e.target.classList.add('selectedPosition');
			});
		}
	});

});
  