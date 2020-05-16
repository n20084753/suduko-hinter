const fillMarksMenuItem = {
    "id": "fillMarks",
    "title": "Fill Pencil Marks",
    "contexts": ["page"]
};

const clearMarksMenuItem = {
    "id": "clearMarks",
    "title": "Clear Pencil Marks",
    "contexts": ["page"]
}

chrome.contextMenus.create(fillMarksMenuItem);
chrome.contextMenus.create(clearMarksMenuItem);

chrome.contextMenus.onClicked.addListener((clickedData, tab) => {
    if (clickedData.menuItemId === "fillMarks") {
        chrome.tabs.sendMessage(tab.id, "refreshPencilMarks");
    }
    if (clickedData.menuItemId === "clearMarks") {
        chrome.tabs.sendMessage(tab.id, "clearPencilMarks");
    }
})

