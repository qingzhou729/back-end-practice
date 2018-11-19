const btn = document.getElementById('btn');
const text = document.getElementById('text');
let isClick = false;
btn.addEventListener('click', () => {
    console.log('点击事件生效了');
    isClick = !isClick;
    if (isClick) {
        text.innerText = '你看我变帅了'; 
    } else {
       text.innerText = '嘻嘻';
    }
})
