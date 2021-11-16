// DOM
const formEl = document.querySelector('.addTicket-form');
const regionSearch = document.querySelector('.regionSearch');
const ticketCardArea = document.querySelector('.ticketCard-area');
const searchResultText = document.querySelector('#searchResult-text');

const url = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';
let ticketData = [];

function cardTemplate(dataObj) {
  return `
    <li class='ticketCard'>
        <div class='ticketCard-img'>
          <a href='#'>
            <img src='${dataObj.imgUrl}' alt='圖片'>
          </a>
          <div class='ticketCard-region'>${dataObj.area}</div>
          <div class='ticketCard-rank'>${dataObj.rate}</div>
        </div>
        <div class='ticketCard-content'>
          <div>
            <h3>
              <a href='#' class='ticketCard-name'>${dataObj.name}</a>
            </h3>
            <p class='ticketCard-description'>
              ${dataObj.description}
            </p>
          </div>
          <div class='ticketCard-info'>
            <p class='ticketCard-num'>
              <span><i class='fas fa-exclamation-circle'></i></span>
              剩下最後 <span id='ticketCard-num'> ${dataObj.group} </span> 組
            </p>
            <p class='ticketCard-price'>
              TWD <span id='ticketCard-price'>$${dataObj.price}</span>
            </p>
          </div>
        </div>
      </li>
  `;
}

function render(data = ticketData) {
  ticketCardArea.innerHTML = data.reduce((prev, curr) => prev + cardTemplate(curr), '');
  searchResultText.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
}

// 事件物件處理
const eventHandlerObj = {
  addTicket(e) {
    e.preventDefault();
    const formData = [...e.target];
    formData.pop();

    const obj = {
      // 或者 id: Date.now()
      id: ticketData.length,
    };
    const n = 'name';
    formData.forEach((item) => {
      obj[item[n]] = item.value.trim();
    });
    obj.group = Number(obj.group);
    obj.price = Number(obj.price);
    obj.rate = Number(obj.rate);

    ticketData.push(obj);
    regionSearch.value = '';
    render();
    formEl.reset();
  },
  changeSelect(e) {
    const filterStr = e.target.value;

    if (filterStr === '') {
      render();
    } else {
      render(ticketData.filter((item) => item.area === filterStr));
    }
  },
};

formEl.addEventListener('submit', eventHandlerObj.addTicket);
regionSearch.addEventListener('change', eventHandlerObj.changeSelect);

// eslint-disable-next-line no-undef
axios.get(url).then((res) => {
  ticketData = res.data.data;
  render();
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err.status);
});

render();
