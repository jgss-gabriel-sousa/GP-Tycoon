export function display(url, selector) {
    fetch("../views/" + url)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;
        })
        .catch(error => {
            console.error("Erro ao carregar o conteúdo: ", error);
        });
}