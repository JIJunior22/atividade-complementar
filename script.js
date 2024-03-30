const menu=document.getElementById("menu")
const cartBtn=document.getElementById("cart-btn")
const cartModal=document.getElementById("cart-modal")
const cartItemsContainer=document.getElementById("cart-items")
const cartTotal=document.getElementById("cart-total")
const checkoutBtn=document.getElementById("checkout-btn")
const closeModalBtn=document.getElementById("close-model-btn")
const cartCounter=document.getElementById("cart-count")
const addressInput=document.getElementById("address")
const addressWarn=document.getElementById("address-warn")


let cart=[];


//Abrir modal do carrinho
cartBtn.addEventListener("click",function(){    
    cartModal.style.display="flex"
    updateCartModal();

    
})

//fechar o modal do carrinho quando clicar fora
cartModal.addEventListener("click",function(event){
    if (event.target===cartModal){
        cartModal.style.display="none"
    }

})

//Botão fechar
closeModalBtn.addEventListener("click",function(){
    cartModal.style.display="none"
})

menu.addEventListener("click",function(event){
    let parantButton=event.target.closest(".add-to-cart-btn")

    if(parantButton){
        const name=parantButton.getAttribute ("data-name")
        const price=parseFloat(parantButton.getAttribute("data-price"))

        addToCart(name,price)
    }

})

//função para add no carrinho
function addToCart(name,price){
    const existingItem=cart.find(item=>item.name===name)

    if(existingItem){
        existingItem.quantity+=1;
       
    }
    else{
        cart.push({
            name,
            price,
            quantity:1,   

    
    })

    updateCartModal()
}}

//Atualizar carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML="";
    let total=0;

    cart.forEach(item=>{
        const cartItemElement=document.createElement("div");
        cartItemElement.classList.add("flex","justify-between","mb-4","flex-col")

        cartItemElement.innerHTML=`
            <div class="flex items-center justify-between">

                <div> 
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

            
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
                
            
            </div>
        
        `
        total+=item.price*item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    });

    cartCounter.innerHTML=cart.length;    


}
//Função para remover item do carrinho
cartItemsContainer.addEventListener("click",function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name=event.target.getAttribute("data-name")

        removeItemCart(name);
    }

})

function removeItemCart(name){
    const index=cart.findIndex(item=>item.name===name);

    if(index!==-1){
        const item=cart[index];
        if(item.quantity>1){
            item.quantity-=1;
            updateCartModal();
            return;
        }
        cart.splice(index,1);
        updateCartModal();
    }

}

addressInput.addEventListener("input",function(event){
    let inputValue=event.target.value;

    if(inputValue!==""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
        
    }


})

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen=checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Estamos fechados no momento!",
            duration: 3000,
            
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }
    if(cart.length===0) return;
    if(addressInput.value===""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;

    }

    // Enviar pedido pelo WhatsApp (API)
const cartItems = cart.map(item => {
    return `Item: ${item.name}\nQuantidade: ${item.quantity}\nPreço: R$${item.price.toFixed(2)}\n\n`;
}).join("");

const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

const message = encodeURIComponent(
    `Pedido:\n\n${cartItems}--------------------\nTotal: R$${totalPrice}\n\nEndereço de entrega:\n${addressInput.value}`
);

const phone = "++5583981948228";
window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

cart=[];
updateCartModal();


})

//verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    //Horario de funcionamento
    const data=new Date();
    const hora=data.getHours();
    return hora>=14 && hora<22;
    
}

const spanItem=document.getElementById("date-span")
const isOpen=checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}
else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}