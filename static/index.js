
const handelHtml = (data) => {
    let tmp = '';
    let indexStyle = '';
    data.forEach((ele, i) => {
        if (i === 0) {
            indexStyle = 'one';
        } else if (i === 1) {
            indexStyle = 'two';
        } else if (i === 2) {
            indexStyle = 'three';
        } else {
            indexStyle = '';
        }

        tmp += `
        <div class="item">
            <div class="left">
                <img class="avatar" src="http://b3.hucdn.com/upload/face/1607/18/18407810631476_1600x1600.jpg"/>
                <div>
                    <div class="name">${ele.player}</div>
                    <div class="score">${ele.score}</div>
                </div>
            </div>
            <div class="item-index ${indexStyle}">${i + 1}</div>
        </div>
        `;
    });
    $('#J_rank').html(tmp);
}

$.ajax({
    url: 'http://47.107.188.55:3377/rank',
    success(res) {
        console.log(res);
        res = JSON.parse(res);
        handelHtml(res.data);
    }
});


$.ajax({
    url: 'http://47.107.188.55:3377/goods',
    success(res) {
        res = JSON.parse(res);
        if (res.data) {
            $('#J_goods').html(`剩余库存: ${+res.data}`);
        } else {
            $('#J_goods').html(`剩余库存: ${+res.data}，已抢光~`);
        }
    }
});
