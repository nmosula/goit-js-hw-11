import Notiflix from "notiflix";

export async function fetchPhotos(searchQuery) {

    const BASE_URL = 'https://pixabay.com/api/';
    return await fetch(`${BASE_URL}?key=32870286-1027cf9b16afcfb20a632269d&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(resp => {
            if (!resp.ok) {
                if (resp.status === 404) {
                    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.", { timeout: 5000 });
                }
                throw new Error(resp.statusText);
            }

            return resp.json();
        })
}