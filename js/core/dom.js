// Ortak DOM erişim yardımcıları.

function elemanSec(selector) {
    return document.querySelector(selector);
}

function elemanlariSec(selector) {
    return document.querySelectorAll(selector);
}

export {
    elemanSec,
    elemanlariSec
};