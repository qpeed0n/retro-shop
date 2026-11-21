const card = document.querySelector('.delivery-card');
const citySelect = document.getElementById('citySelect');
const giftWrap = document.getElementById('giftWrap');
const totalPriceEl = document.getElementById('totalPrice');
const orderBtn = document.getElementById('orderBtn');

function calculateTotal() {
    const cityMult = Number(citySelect.value);
    const deliveryPrice = Number(card.querySelector('input[name="delivery"]:checked').value);
    const giftPrice = giftWrap.checked ? Number(giftWrap.value) : 0;

    const total = Math.round(deliveryPrice * cityMult + giftPrice);
    totalPriceEl.textContent = `${total} ₽`;
}

card.addEventListener('change', calculateTotal);

orderBtn.addEventListener('click', () => {
    const cityName = citySelect.options[citySelect.selectedIndex].text.split(' (')[0];
    alert(`Заказ оформлен!\nГород: ${cityName}\nК оплате: ${totalPriceEl.textContent}`);
});

calculateTotal();