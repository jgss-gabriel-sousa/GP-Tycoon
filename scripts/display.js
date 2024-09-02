export function display(url, selector) {
    setTimeout(e => {
        fetch("../views/templates/" + url)
            .then(response => response.text())
            .then(data => {
                document.querySelector(selector).innerHTML = data;
            })
            .catch(error => {
                console.error("Erro ao carregar o conteúdo: ", error);

                setTimeout(e => {
                    loadHTMLContent(url, selector);
                }, rand(0, 100))
            });
    }, rand(0, 100));
}