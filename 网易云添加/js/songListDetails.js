let id = new URLSearchParams(location.search).get('id');
console.log(id);
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
let songListDetailsBoxImgEl = document.querySelector('.songListDetails-box-img')
ajax({
        url: `http://47.98.138.57:3000/playlist/detail?time=${Date.now()}`,
        params: {
            id: id
        },
        method: 'get',
        success: songListDetails
        })
        function songListDetails(res){
            let allSongListDetails = res.playlist
            console.log(allSongListDetails);
            let songListDetailsBoxImgElHtml = `
                <div class = 'img-box'>
                    <img src="${allSongListDetails.coverImgUrl}" alt="">
                </div>
            `
            songListDetailsBoxImgEl.innerHTML = songListDetailsBoxImgElHtml
            let playlistNameEl = document.querySelector('.playlistName')
            let playlistNameElHtml = `
                <span>${allSongListDetails.name}</span>
            `
            playlistNameEl.innerHTML = playlistNameElHtml
            let songSingleUserEl = document.querySelector('.songSingleUser')
            let songSingleUserElHtml = `
                <span><img src="${allSongListDetails.creator.avatarUrl}" alt=""></span>
                <span>${allSongListDetails.creator.nickname}</span>
            `
            songSingleUserEl.innerHTML = songSingleUserElHtml
            let labelEl = document.querySelector('.label')
            let labelElHtml = `
                <span>标签：</span>
            `
            allSongListDetails.tags.forEach(function(tags){
                labelElHtml+=`
                    <span class= 'theLabelColor'>${tags}</span>
                `
            })
            labelEl.innerHTML = labelElHtml
            let introduceEl = document.querySelector('.introduce')
            let introduceElHtml = `
                <span>介绍：</span>
                <span>${allSongListDetails.description}</span>
            `
            introduceEl.innerHTML = introduceElHtml




            //歌曲列表
        ajax({
            url: `http://47.98.138.57:3000/playlist/track/all?time=${Date.now()}`,
            params: {
                id: id
            },
            method: 'get',
            success: songSingleTable
        })
            function songSingleTable(res){
                let songSequence = res.privileges
                console.log(songSequence);
                let allTheSongTitle = res.songs
                console.log(allTheSongTitle);


                let allTheSongs = res.privileges.length
                let allTheSongsSongListEl = document.querySelector('.allTheSongsSongList')
                let allTheSongsSongListElHtml = `
                    <div class='totalSong'>
                        <span>歌曲列表：</span>
                        <span>${allTheSongs}首歌</span>
                    </div>
                    <div class='degree'>
                        <span>播放：</span>
                        <span>${allSongListDetails.playCount}次</span>
                    </div>
                `
                allTheSongsSongListEl.innerHTML = allTheSongsSongListElHtml

                let songSequenceEl = document.querySelector('.songSequence')
                let songSequenceElHtml = ``
                let playEl = document.querySelector('.play')
                let playElHtml = ``
                songSequence.forEach((songSequence,index)=>{
                    
                    songSequenceElHtml += `
                        <span>${index+1}</span>
                    `
                    playElHtml += `
                        <img src="./img/播放_o.png" alt="">
                    `
                })
                songSequenceEl.innerHTML = songSequenceElHtml
                playEl.innerHTML = playElHtml
                let theSongTitleEl = document.querySelector('.theSongTitle')
                let theSongTitleElHtml = ``
                let burningTimeEl = document.querySelector('.burningTime')
                let burningTimeElHtml = ``
                let singerEl = document.querySelector('.singer')
                let singerElHtml = ``
                let theAlbumEl = document.querySelector('.theAlbum')
                let theAlbumElHtml = ``
                allTheSongTitle.forEach((allTheSongTitle)=>{
                    //时间
                    let minute = parseInt(allTheSongTitle.dt / 1000 / 60)
                    minute = minute < 10 ? '0' + minute : minute
                    let second = parseInt(allTheSongTitle.dt / 1000 % 60)
                    second = second < 10 ? '0' + second : second
                    
                    theSongTitleElHtml += `
                        <span>${allTheSongTitle.name}</span>
                    `
                    burningTimeElHtml+=`
                        <span>${minute}:${second}</span>
                    `
                    singerElHtml += `
                        <span>${allTheSongTitle.ar[0].name}</span>
                    `
                    theAlbumElHtml += `
                        <span>${allTheSongTitle.al.name}</span>
                    `
                })
                theSongTitleEl.innerHTML = theSongTitleElHtml
                burningTimeEl.innerHTML = burningTimeElHtml
                singerEl.innerHTML = singerElHtml
                theAlbumEl.innerHTML = theAlbumElHtml
            }
        }