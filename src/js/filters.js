import axios from 'axios';
import {CustomSelect} from './custom-select';

const searchFormEl = document.querySelector('.search__recipes');
const searchInputEl = document.querySelector('.search__recipes-input');
const closeIconEl = document.querySelector('.search__close-icon');
const searchIconEl = document.querySelector('.search__icon-svg');

const resetFiltersEl = document.querySelector('.filters-reset');
const selectsEl = document.querySelectorAll('.filter-select__toggle');
const allCategoriesList = document.querySelector('.recipes');

function clearFiltersInput (){
    closeIconEl.classList.add('is-hidden');
    searchIconEl.style.fill = "currentColor";
    if (searchInputEl.value !== '') {
        closeIconEl.classList.remove('is-hidden');
        searchIconEl.style.fill = "var(--color-accent-primary)";
    }
}

searchInputEl.addEventListener('input', clearFiltersInput);
closeIconEl.addEventListener('click', () => {
    searchInputEl.value = '';
    clearFiltersInput();
});

resetFiltersEl.addEventListener('click', () => {
    document.querySelectorAll('.filter-select__option_selected').forEach(el => {
    el.classList.remove('filter-select__option_selected')
    })
    searchInputEl.value = '';
    clearFiltersInput();
    selectsEl.forEach(select => {
       select.textContent = select.dataset.start;
       select.dataset.index = '-1';
       select.style.color = 'inherit';
   });
})

/* Fetch and rendering dropdown */
function fetchDataForFilters(filterName) {
  const API_URL = 'https://tasty-treats-backend.p.goit.global/api';
  return axios
  .get(`${API_URL}/${filterName}`)
  .then(response => {
    if (response.status === 200) {
      const data = response.data;
      data.sort((x, y) => x.name.localeCompare(y.name));
      return data;
    }
  })
  .catch(error => {
    console.error('ERROR', error);
  });
}

function renderFilterList (filterName, values) {
  document.querySelector(`#options-${filterName}`).innerHTML = values.join('');
  new CustomSelect(`#select-${filterName}`);
  document.querySelector(`#toggle-${filterName}`).disabled = false;
}

function renderTime () {
  let arr = []; 
  for (let i = 5; i <= 120; i+= 5) {
    arr.push(i);
  }
  const values = arr.map((key, index) => {
    return `<li class="filter-select__option" data-select="option" data-value="${key}" data-index="${index}">${key} min</li>`;
  });
  renderFilterList('time', values);
};
renderTime();

fetchDataForFilters('ingredients')
.then(data => {
  const values = Object.keys(data).map((key, index) => {
    return `<li class="filter-select__option" data-select="option" data-value="${data[key]._id}" data-index="${index}">${data[key].name}</li>`;
  });
  renderFilterList('ingredients', values);
})
.catch(error => {
  console.error('ERROR', error);
});

fetchDataForFilters('areas')
.then(data => {
  const values = Object.keys(data).map((key, index) => {
    return `<li class="filter-select__option" data-select="option" data-value="${data[key].name}" data-index="${index}">${data[key].name}</li>`;
  });
  renderFilterList('area', values);
})
.catch(error => {
  console.error('ERROR', error);
});
