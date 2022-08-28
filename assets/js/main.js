const API = 'https://api.thecatapi.com/v1';
const btn = document.querySelector('button')
const btn2 = document.querySelector('.button_upload')
const MyApiKey = '094eb7bb-739c-4cd1-a21d-8212f74d8ac7';


//========== Axios ===============
const apiAxios = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
});

apiAxios.defaults.headers.common['x-api-key'] = MyApiKey;
//================================


async function loadRandomCats(urlApi) {
    const response = await fetch(urlApi);
    const data = await response.json();

    if (response.status !== 200) {
        alert(`Error: ${response.status} ${data.message}`);
    } else {
        const img1 =  document.getElementById('img1');
        const img2 =  document.getElementById('img2');
        const img3 =  document.getElementById('img3');

        const btn1 =  document.getElementById('btn1');
        const btn2 =  document.getElementById('btn2');
        const btn3 =  document.getElementById('btn3');

        img1.src = data[0].url
        img2.src = data[1].url
        img3.src = data[2].url

        btn1.onclick = () => saveFavoritesCats(data[0].id);
        btn2.onclick = () => saveFavoritesCats(data[1].id);
        btn3.onclick = () => saveFavoritesCats(data[2].id);
    }
} 

async function loadFavoritesCats(urlApi) {
    const response = await fetch(urlApi, {
        method: 'GET',
        headers: {
            'x-api-key': MyApiKey,
        }
    });
    const data = await response.json();

    if (response.status !== 200) {
        alert(`Error: ${response.status} ${data.message}`);
    } else { 
        const html_container = document.getElementsByClassName('container_favorites_images')
        html_container[0].innerHTML= " ";   

        data.forEach(cat => {
                                           
                const html_article = document.createElement('article');
                const html_picture =  document.createElement('picture');
                const html_image = document.createElement('img');
                const html_button = document.createElement('button');
                const html_iconImage = document.createElement('img');

                html_iconImage.src = "./assets/img/remove.png";
                html_button.classList.add('icon_remove');
                html_button.appendChild(html_iconImage);
                html_button.onclick = () => deleteFavoriteCat(cat.id)
                html_image.classList.add('image_cat_favorite');
                html_image.src = cat.image.url;
                html_picture.appendChild(html_image);
                html_picture.appendChild(html_button);
                html_article.classList.add('container_favorites');
                html_article.appendChild(html_picture);
                html_container[0].appendChild(html_article);
            }
        );
    }
}

async function saveFavoritesCats_noAxios(id) {
    const urlApi = `${API}/favourites?api_key=${MyApiKey}`;
    
    const response = await fetch(urlApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image_id: id
        })
    });
    const data = await response.json();

    if (response.status !== 200) {
        console.error(`Error: ${response.status}  ${data.message}`);
    } else {
        alert('Image save in favorites');
        loadFavoritesCats(`${API}/favourites?api_key=${MyApiKey}`);
    }
}

//========= Funcction use Axios ===================
async function saveFavoritesCats(id) {
    const {data, status} = await apiAxios.post('/favourites',{
        image_id: id,
    });

    if (status != 200) {
        console.error(`Error: ${response.status}  ${data.message}`);
    } else {
        alert('Image save in favorites');
        loadFavoritesCats(`${API}/favourites?api_key=${MyApiKey}`);
    }
}
//=================================================

async function deleteFavoriteCat(id) {
    const urlApi = `${API}/favourites/${id}?api_key=${MyApiKey}`;

    const response = await fetch(urlApi, {
        method: 'DELETE',
    })
    const data = await response.json();

    if (response.status !== 200) {
        console.error('Error: ' + response.status +' '+ data.message);
    } else {
        alert('Delete favorites');
        loadFavoritesCats(`${API}/favourites?api_key=${MyApiKey}`)
    }

}

async function uploadCatPhoto(urlApi) {
    const form = document.getElementById('form_uploading');
    const formData = new FormData(form);

    const response = await fetch(urlApi,{
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'x-api-key': MyApiKey,
        },
        body: formData,
    });
    const data = await response.json();

    console.log(formData.get('file'));

    if (response.status !== 201) {
        console.error(`Error: ${response.status} ${data.message}`);
    } else {
        alert('Photo Uploaded');
        saveFavoritesCats(data.id);
        loadFavoritesCats(`${API}/favourites?api_key=${MyApiKey}`)
    }
} 

loadRandomCats(`${API}/images/search?limit=3`);
loadFavoritesCats(`${API}/favourites`);

btn?.addEventListener("click", () => {
    loadRandomCats(`${API}/images/search?limit=3`);
});

btn2?.addEventListener("click", () => {
    uploadCatPhoto(`${API}/images/upload`);
});
