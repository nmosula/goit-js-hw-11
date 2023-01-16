import "./css/styles.css";
// import {fetchPhotos} from "./js/fetchPhotos.js";
import Notiflix from 'notiflix';
import axios from "axios";


const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const btnLoadMore = document.querySelector(".load-more");

const inpQuery = document.querySelector("input[name='searchQuery']");
let searchQuery = inpQuery.value.trim();

let page = 1;
const PER_PAGE = 5;

btnLoadMore.hidden = true;

form.addEventListener('submit', onSubmitForm);
btnLoadMore.addEventListener('click', onLoadMore);

function onSubmitForm(evt) {
  evt.preventDefault();

  page = 1;
  btnLoadMore.hidden = true;
  gallery.innerHTML = "";

  const frmElements = evt.currentTarget.elements;
  const searchQuery = frmElements.searchQuery.value.trim();

  if (searchQuery.length === 0) Notiflix.Notify.failure("Please input search images.", { timeout: 5000 });
  else getPhotos(searchQuery);
}

async function getPhotos(searchQuery, page = 1) {
    const BASE_URL = "https://pixabay.com/api/";
    const AXIOS_KEY = "32870286-1027cf9b16afcfb20a632269d";
     
    await axios.get(`${BASE_URL}?key=${AXIOS_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`)
      .then(resp => {
        if (resp.data.total === 0) {
          Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.", { timeout: 5000 });
        }
        else {
          if (resp.data.totalHits > 0 && page == 1) {
            Notiflix.Notify.info(`Hooray! We found ${resp.data.totalHits} images.`);
          }

          if (resp.data.totalHits > page * PER_PAGE) {
            btnLoadMore.hidden = false;
          }
          else {
            Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
            btnLoadMore.hidden = true;
          }

          showPhotos(resp.data);
        }
      });
}

function showPhotos(data) {
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
`).join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function onLoadMore() {
  searchQuery = inpQuery.value.trim();
  page += 1;
  getPhotos(searchQuery, page);
}