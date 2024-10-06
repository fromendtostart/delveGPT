function countWord(word) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return (document.body.innerText.match(regex) || []).length;
}
  
chrome.storage.sync.get(['words', 'gridPosition'], function(result) {
    const words = result.words || ['delve'];
    const gridPosition = result.gridPosition;
    let totalCount = 0;

    words.forEach(word => totalCount += countWord(word));

    if (totalCount > 0) {
        const popup = document.createElement('div');
        popup.id = 'wordCounterPopup';
        popup.style.position = 'fixed';
        popup.style.width = 'max-content';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.padding = '20px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1000';
        popup.innerText = `${totalCount} words shouldn't be here!`;

        const position = getPopupPosition(gridPosition);
        popup.style.top = position.top;
        popup.style.left = position.left;
        popup.style.transform = position.transform;

        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 3000);
    }
});

function getPopupPosition(gridPosition) {
    const position = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    };

    switch (gridPosition) {
        case 1: // Top-left
            position.top = '5%';
            position.left = '5%';
            position.transform = 'translate(0, 0)';
            break;
        case 2: // Top-center
            position.top = '5%';
            position.left = '50%';
            position.transform = 'translate(-50%, 0)';
            break;
        case 3: // Top-right
            position.top = '5%';
            position.left = '95%';
            position.transform = 'translate(-100%, 0)';
            break;
        case 4: // Middle-left
            position.top = '50%';
            position.left = '5%';
            position.transform = 'translate(0, -50%)';
            break;
        case 5: // Middle-center
            position.top = '50%';
            position.left = '50%';
            position.transform = 'translate(-50%, -50%)';
            break;
        case 6: // Middle-right
            position.top = '50%';
            position.left = '95%';
            position.transform = 'translate(-100%, -50%)';
            break;
        case 7: // Bottom-left
            position.top = '95%';
            position.left = '5%';
            position.transform = 'translate(0, -100%)';
            break;
        case 8: // Bottom-center
            position.top = '95%';
            position.left = '50%';
            position.transform = 'translate(-50%, -100%)';
            break;
        case 9: // Bottom-right
            position.top = '95%';
            position.left = '95%';
            position.transform = 'translate(-100%, -100%)';
            break;
        default:
            break;
    }
    return position;
}
  