document.getElementById("itemForm").addEventListener("submit", runSearch);

async function runSearch(event) {
  event.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getItens,
  });
}

function getItens() {
  const proxyUrl = "https://zeusdrive.cloud/proxy.php?url=";
  const targetUrl = "https://api.warframe.market/v2/orders/item/";
  const url = proxyUrl + targetUrl;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na solicitação: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      document.body.style.backgroundColor = "red";
      /* 
      if (data && data.data) {
        const ordersDiv = document.getElementById("orders");
        ordersDiv.innerHTML = "";

        data.data.forEach((item) => {
          const orderElement = document.createElement("p");
          orderElement.textContent = `${item.user.ingameName} - ${item.platinum} - ${item.user.status} -`;
          ordersDiv.appendChild(orderElement);
        });
      } else {
        console.error("Erro ao decodificar JSON: Dados inválidos");
      } */
    })
    .catch((error) => {
      console.error("Erro: ", error);
    });
}
