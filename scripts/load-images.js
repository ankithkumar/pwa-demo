window.addEventListener('load', addImagesToDom);

const imageArr = [
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZXN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1511497584788-876760111969?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8Zm9yZXN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Zm9yZXN0fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
];

function addImagesToDom() {
    let container = document.querySelector('.image-container');
    imageArr.forEach((imgLink, index) => {
        let image = document.createElement('img');
        image.classList.add('demo-img');
        image.classList.add('demo-img-' + index);
        image.src = imgLink;
        container.appendChild(image);
    })
}