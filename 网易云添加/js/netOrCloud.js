//获取html的属性
let carouselBoxImgEl = document.querySelector('.carousel-box-img')
let dotEl = document.querySelectorAll('.dot')
let leftArrowEl = document.querySelector('.leftArrow')
let rightArrowEl = document.querySelector('.rightArrow')
//调用接口封装函数
function ajax({ method = "GET", url, params = {}, success } = {}) {
    method = method.toUpperCase();

    let xhr = new XMLHttpRequest();
    let data = null; // 最终请求体发送的数据

    if (method !== 'GET') {
    data = JSON.stringify(params)
    } else {
    url = new URL(url);

    for (const key of Object.keys(params)) {
        url.searchParams.append(key, params[key])
    }

    url = url.href;
    }


    xhr.open(method, url);

    if (method !== 'GET') {
    xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.send(data)

    xhr.onload = () => {
    let res = JSON.parse(xhr.response);
    success?.(res)
    }

    xhr.onerror = () => {
    alert('请求错误，请稍后重试！')
    }
}
//轮播图
ajax({
    url: `http://47.98.138.57:3000/banner?time=${Date.now()}`,
    params: {
        // limit: 8
    },
    method: 'get',
    success: carousel
    })
    function carousel(res){
        let allTheBanner = res.banners
        let html = ``
        allTheBanner.forEach(function(allTheBanner){
            html+=`
                <img class='img' src="${allTheBanner.imageUrl}" alt="">
            `
        })
        carouselBoxImgEl.innerHTML = html
        let imgList =document.querySelectorAll('.img')
        //轮播图动起来
        let currentIndex = 0;
        let a = 8
        let timer = setInterval(function () {
            rightArrowEl.click()
        }, 3000)
        for (let i = 0; i < a; i++) {
            if(i == 8){
                return
            }
            dotEl[i].onmouseover = function () {
                currentIndex = i
                for (let i = 0; i < a; i++) {
                    imgList[i].style.display = 'none'
                    dotEl[i].className = 'dot'
                }
                imgList[currentIndex].style.display = 'block'
                dotEl[currentIndex].className = 'dot discolor'
                clearInterval(timer)
            }
            if (i === 0) {
                dotEl[i].className = 'dot discolor'
            }
            dotEl[i].onmouseout = function () {
                timer = setInterval(function () {
                    rightArrowEl.click()
                }, 3000)
            }
            imgList[i].onmouseover = function () {
                clearInterval(timer)
            }
            imgList[i].onmouseout = function () {
                timer = setInterval(function () {
                    rightArrowEl.click()
                }, 3000)
            }
        }
        rightArrowEl.onclick = function () {
            let index = currentIndex + 1;
            if (index == 8) {
                index = 0
            }
            for (let i = 0; i < a; i++) {
                imgList[i].style.display = 'none'
                dotEl[i].className = 'dot'
            }
            imgList[index].style.display = 'block'
            dotEl[index].className = 'dot discolor'
            currentIndex++
            if (currentIndex == 8) {
                currentIndex = 0
            }
        }
        rightArrowEl.onmouseover = function () {
            clearInterval(timer)
        }
        rightArrowEl.onmouseout = function () {
            timer = setInterval(function () {
                rightArrowEl.click()
            }, 3000)
        }
        leftArrowEl.onclick = function () {
            let index1 = currentIndex - 1;
            if (index1 == -1) {
                index1 = 7
            }
            for (let i = 0; i < a; i++) {
                imgList[i].style.display = 'none'
                dotEl[i].className = 'dot'
            }
            imgList[index1].style.display = 'block'
            dotEl[index1].className = 'dot discolor'
            currentIndex--
            if (currentIndex == -1) {
                currentIndex = 7
            }
        }
        leftArrowEl.onmouseover = function () {
            clearInterval(timer)
        }
        leftArrowEl.onmouseout = function () {
            timer = setInterval(function () {
                rightArrowEl.click()
            }, 3000)
        }
    }
    //热门推荐
    let playlistEl = document.querySelector('.playlist')
    ajax({
        url: `http://47.98.138.57:3000/personalized?time=${Date.now()}`,
        params: {
            limit:8
        },
        method: 'get',
        success: hotRecommended
        })
        function hotRecommended(res){
            let recommendAll = res.result
            // console.log(recommendAll);
            let html=''
            recommendAll.forEach(function(recommendAll){
                html+=`
                    <div class="playlist-box">
                        <span><img src="${recommendAll.picUrl}" alt=""></span>
                        <span class="playlistButton" data-id="${recommendAll.id}">${recommendAll.name}</span>
                    </div>
                `
            })
            playlistEl.innerHTML=html
            let navigationButtons = document.querySelectorAll('li')
            let hotRecommendedHeadMax = document.querySelector('.hotRecommended-head-max')
            hotRecommendedHeadMax.classList.add('discoloration')
            hotRecommendedHeadMax.onclick=function(){
                this.classList.add('discoloration')
                playlistEl.innerHTML = html
                navigationButtons.forEach(e=>{
                    e.classList.remove('discoloration')
                })
            }
            let playlistButtonEl = document.querySelectorAll('.playlistButton')
            playlistButtonEl.forEach(function(e){
                e.onclick = function (){
                    if (!e) return;
                    location.href = `./歌单详情.html?id=${e.dataset.id}`
                }
            })
        }
        //切换歌单
            let navigationButtons = document.querySelectorAll('li')
            let hotRecommendedHeadMax = document.querySelector('.hotRecommended-head-max')
            
            navigationButtons.forEach(navigationButton=>{
                navigationButton.onclick=function(){
                    let text = navigationButton.textContent
                    console.log(text);
                    navigationButtons.forEach(e=>{
                        e.classList.remove('discoloration')
                    })
                    this.classList.add('discoloration')
                    hotRecommendedHeadMax.classList.remove('discoloration')
                    ajax({
                        url: `http://47.98.138.57:3000/top/playlist?time=${Date.now()}`,
                        params: {
                            limit:8,
                            cat:text
                        },
                        method: 'get',
                        success: switchThePlaylist
                    })
                    function switchThePlaylist(res){
                        let songSingleStyle = res.playlists
                        let addPlaylistsSwitch = ``
                        songSingleStyle.forEach((songSingleStyle)=>{
                            addPlaylistsSwitch +=`
                                <div class="playlist-box">
                                    <span><img src="${songSingleStyle.coverImgUrl}" alt=""></span>
                                    <span class="playlistButton" data-id="${songSingleStyle.id}">${songSingleStyle.name}</span>
                                </div>
                            `
                        })
                        playlistEl.innerHTML = addPlaylistsSwitch
                        let playlistButtonEl = document.querySelectorAll('.playlistButton')
                        playlistButtonEl.forEach(function(e){
                            e.onclick = function (){
                                if (!e) return;
                                location.href = `./歌单详情.html?id=${e.dataset.id}`
                            }
                        })
                    }
                }
            })