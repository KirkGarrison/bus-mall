'use strict';

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let productUrl = [
  'bag.jpg',
  'banana.jpg',
  'bathroom.jpg',
  'boots.jpg',
  'breakfast.jpg',
  'bubblegum.jpg',
  'chair.jpg',
  'cthulhu.jpg',
  'dog-duck.jpg',
  'dragon.jpg',
  'pen.jpg',
  'pet-sweep.jpg',
  'scissors.jpg',
  'shark.jpg',
  'sweep.png',
  'tauntaun.jpg',
  'unicorn.jpg',
  'water-can.jpg',
  'wine-glass.jpg'
];
let products = [];
let leftSideImage = document.querySelector('#left-side-img');
let centerImage = document.querySelector('#center-img');
let rightSideImage = document.querySelector('#right-side-img');
let imagesSection = document.querySelector('#all-products');
let leftImageRandom, centerImageRandom, rightImageRandom;
let totalClicks = 0;
let rounds = document.getElementById('rounds');
let numberRounds =0;
let imagesPerRound = [];


function Product(url) {
  this.imageUrl = `img/${url}`;
  this.imageName = url.split('.')[0];
  products.push(this);
  this.numberClicks = 0;
  this.numberViews = 0;
}

function randomImage() {
  leftImageRandom = products[randomNumber(0, products.length - 1)];
  centerImageRandom = products[randomNumber(0, products.length - 1)];
  rightImageRandom = products[randomNumber(0, products.length - 1)];
  while (leftImageRandom === centerImageRandom || leftImageRandom === rightImageRandom || centerImageRandom === rightImageRandom || imagesPerRound.includes(leftImageRandom) || imagesPerRound.includes(centerImageRandom) || imagesPerRound.includes(rightImageRandom)) {
    leftImageRandom = products[randomNumber(0, products.length - 1)];
    centerImageRandom = products[randomNumber(0, products.length - 1)];
    rightImageRandom = products[randomNumber(0, products.length - 1)];
  }
  imagesPerRound = [];
  imagesPerRound.push(leftImageRandom);
  imagesPerRound.push(centerImageRandom);
  imagesPerRound.push(rightImageRandom);
  leftSideImage.setAttribute('src', leftImageRandom.imageUrl);
  leftSideImage.setAttribute('alt', leftImageRandom.imageName);
  leftImageRandom.numberViews++;
  centerImage.setAttribute('src', centerImageRandom.imageUrl);
  centerImage.setAttribute('alt', centerImageRandom.imageName);
  centerImageRandom.numberViews++;
  rightSideImage.setAttribute('src', rightImageRandom.imageUrl);
  rightSideImage.setAttribute('alt', rightImageRandom.imageName);
  rightImageRandom.numberViews++;
}
for (let i = 0; i < productUrl.length; i++) {
  new Product(productUrl[i]);
}
randomImage();
numberRounds++;
rounds.textContent = ('Round :' + numberRounds);
imagesSection.addEventListener('click', clicks);
function clicks(e) {
  if (e.target.id === 'left-side-img') {
    leftImageRandom.numberClicks++;
    totalClicks++,
    randomImage();
    numberRounds++;
  }

  if (e.target.id === 'center-img') {
    centerImageRandom.numberClicks++;
    totalClicks++;
    randomImage();
    numberRounds++;
  }
  if (e.target.id === 'right-side-img') {
    rightImageRandom.numberClicks++;
    totalClicks++;
    randomImage();
    numberRounds++;
  }
  rounds.textContent = ('Round :' + numberRounds);
  if (totalClicks === 25) {
    imagesSection.removeEventListener('click', clicks);
    leftSideImage.remove();
    centerImage.remove();
    rightSideImage.remove();
    rounds.textContent = ('');
    let results = JSON.stringify(products);
    localStorage.setItem('voteResults', results);
    let voteResults = localStorage.getItem('voteResults');
    products = JSON.parse(voteResults);
    let finalReport = document.getElementById('finalReport');
    finalReport.textContent = 'Thank you for participating, here are your voting results :';
    let report = document.getElementById('report');
    for (let j =0; j< products.length; j++){
      let reportList = document.createElement('li');
      reportList.textContent = `${products[j].imageName} had ${products[j].numberClicks} votes and was shown ${products[j].numberViews} times`;
      report.appendChild(reportList);
    }
    renderChart();
  }
}
function renderChart(){
  let productsNames = [];
  let productsClicks = [];
  let productsViews =[];
  for(let i = 0 ; i < products.length ; i++){
    let productName = products[i].imageName;
    productsNames.push(productName);
    let productLikes = products[i].numberClicks;
    productsClicks.push(productLikes);
    let productView = products[i].numberViews;
    productsViews.push(productView);
  }
  let ctx = document.getElementById('chart').getContext('2d');
  let chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: productsNames,
      datasets: [{
        label: '# of Votes',
        data: productsClicks,
        backgroundColor: 'rgba(138, 43, 226, 0.2)',
        borderColor: 'rgba(138, 43, 226, 1)',
        borderWidth: 1
      }, {
        label: '# of Views',
        data: productsViews,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}