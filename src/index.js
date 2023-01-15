import "./css/styles.css";
import {fetchPhotos} from "./js/fetchPhotos.js";
import Notiflix from 'notiflix';


const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");

form.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt) {
    evt.preventDefault();

    const frmElements = evt.currentTarget.elements;
    const searchQuery = frmElements.searchQuery.value.trim();

    if (searchQuery == "") {
        return;
    }
    else if(searchQuery !== '') {
    
        fetchPhotos(searchQuery)
            .then(data => {
                if (data.total > 0)
                    showPhotos(data);
                else 
                    Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.", { timeout: 5000 });

            })
            .catch(err => console.log(err));
    }
}




function showPhotos(data) {
  const total = data.total;
  const totalHits = data.totalHits;
  const hits = data.hits;

  const markup = hits.map(({
      webformatURL: imgSmall,
      largeImageURL: imgLarge,
      tags: imgTags,
      likes: imgLikes,
      views: imgViews,
      comments: imgComments,
      downloads: imgDownloads
  }) => `
      <div class="photo-card">
        <img src="${imgSmall}" alt="${imgTags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>: ${imgLikes}
          </p>
          <p class="info-item">
            <b>Views</b>: ${imgViews}
          </p>
          <p class="info-item">
            <b>Comments</b>: ${imgComments}
          </p>
          <p class="info-item">
            <b>Downloads</b>: ${imgDownloads}
          </p>
        </div>
      </div>
`);

  gallery.innerHTML = markup.join('');
}