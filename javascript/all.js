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

function renderC3() {
/*
c3 資料格式：
[["高雄", 2], ["台北",1], ["台中", 1]]
*/
  const obj = {};

  ticketData.forEach((item) => {
    if (obj[item.area] === undefined) {
      obj[item.area] = 1;
    } else {
      obj[item.area] += 1;
    }
  });

  const objKeysArr = Object.keys(obj);
  const objValuesArr = Object.values(obj);

  const renderC3Arr = [];

  objKeysArr.forEach((item, idx) => {
    renderC3Arr.push([item, objValuesArr[idx]]);
  });

  // eslint-disable-next-line no-undef
  c3.generate({
    bindto: '.chart',
    data: {
      columns: renderC3Arr,
      type: 'donut',
      colors: {
        台北: '#26BFC7',
        台中: '#5151D3',
        高雄: '#E68618',
      },
    },
    donut: {
      title: '套票地區比重',
      width: 15, // 資料圈圈寬度為%數
      label: {
        show: false, // 標籤不顯示
      },
    },
    size: { // 大小
      height: 200,
      width: 200,
    },
  });
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
    renderC3();

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

function init() {
  // eslint-disable-next-line no-undef
  axios.get(url).then((res) => {
    ticketData = res.data.data;
    render();
    renderC3();
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
}

init();
