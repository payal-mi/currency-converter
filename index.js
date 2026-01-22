window.addEventListener("DOMContentLoaded", () => {

  
  const fromCurr = document.getElementById("from-currency");
  const toCurr = document.getElementById("to-currency");
  const amountInput = document.getElementById("amount-input");
  const swapBtn = document.getElementById("swap-btn");
  const convertBtn = document.getElementById("convert-btn");
  const msg = document.getElementById("msg");


  [fromCurr, toCurr].forEach(select => {
    for (let curr in countryList) {
      const option = document.createElement("option");
      option.value = curr;
      option.text = curr;
      if (select === fromCurr && curr === "USD") option.selected = true;
      if (select === toCurr && curr === "INR") option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener("change", () => updateFlag(select));
  });

 
  function updateFlag(select) {
    const countryCode = countryList[select.value];
    const img = select.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
  async function updateExchangeRate() {
    let amtVal = parseFloat(amountInput.value);
    if (isNaN(amtVal) || amtVal < 1) {
      amtVal = 1;
      amountInput.value = "1";
    }

    try {
      const response = await fetch("https://cdn.moneyconvert.net/api/latest.json");
      const data = await response.json();
      const rates = data.rates;

      const fromRate = rates[fromCurr.value];
      const toRate = rates[toCurr.value];

      if (!fromRate || !toRate) {
        msg.innerText = "Rate not available for selected currencies";
        return;
      }

      const rate = toRate / fromRate;
      const finalAmount = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;

    } catch (err) {
      console.error(err);
      msg.innerText = "Error fetching exchange rate";
    }
  }

 
  swapBtn.addEventListener("click", () => {
    const temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
  });

 
  convertBtn.addEventListener("click", updateExchangeRate);

 
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
