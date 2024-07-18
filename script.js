const proxyUrl = 'https://corsproxy.io/?';
const targetUrl = 'https://api.warframe.market/v2/items';
const url = proxyUrl + targetUrl;
const form = document.getElementById('itemForm');
const itemInput = document.getElementById('itemName');

async function filterItemsName() {
  const items = await getItens();

  itemInput.addEventListener('keydown', (event) => {
    updateItemList(event.target.value);
  });

  // Adiciona o listener para o clique fora do input
  document.addEventListener('click', (event) => {
    if (!itemInput.contains(event.target)) {
      updateItemList(''); // Limpa a lista se o clique for fora do input
    }
  });

  // Adiciona o listener para o clique nos itens da lista
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item')) {
      itemInput.value = event.target.textContent;
      const urlName = event.target.getAttribute('urlName');
      console.log(`Item clicado: ${urlName}`);
    }
  });

  function updateItemList(itemName) {
    const list = document.getElementById('itemList');
    list.innerHTML = '';
    items.forEach((item) => {
      if (item.i18n.en.name.toLowerCase().includes(itemName.toLowerCase())) {
        const itemElement = document.createElement('li');
        itemElement.innerHTML = `<a href="javascript:void(0);" class="item" urlName="${item.urlName}">${item.i18n.en.name}</a>`;
        list.appendChild(itemElement);
      }
    });
  }
}

window.onload = filterItemsName;

form.addEventListener('click', async (event) => {
  event.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getItens,
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getItens,
  });
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Iniciando extensão');
  getItens();
});

const getItens = () => {
  const proxyUrl = 'https://corsproxy.io/?';
  const targetUrl = 'https://api.warframe.market/v2/items';
  const url = proxyUrl + targetUrl;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro na solicitação: ' + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const items = data.data;
      return items;
      //const test = itemNames.map((item) => item.i18n.en.name);
    })
    .catch((error) => {
      console.error('Erro: ', error);
    });
};

/* async function main() {
  const data = await getItens();
  console.log(data);
}

function getOrderItem() {
  if (data && data.data) {
    const ordersDiv = document.getElementById('orders');
    ordersDiv.innerHTML = '';
    data.data.forEach((item) => {
      const orderElement = document.createElement('p');
      orderElement.textContent = `${item.user.ingameName} - ${item.platinum} - ${item.user.status} -`;
      ordersDiv.appendChild(orderElement);
    });
  } else {
    console.error('Erro ao decodificar JSON: Dados inválidos');
  }
}
main();*/
