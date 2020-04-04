const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginWindow = document.getElementsByClassName('login');
const registerWindow = document.getElementsByClassName('register');

const sideArea = document.querySelector('.side');
const functionalBtn = document.getElementById('functionalBtn');
const avatarMask = document.querySelector('.side__portrait--avatar.mask');
const contentArea = document.querySelector('.content');
const dynamicContentArea = document.querySelector('.dynamic');

const portrait = document.querySelector('.side__portrait');
const avatar = document.querySelector('.side__portrait--avatar');
const avatarTitle = document.querySelector('.side__portrait--userID');
const avatarDescription = document.querySelector('.side__portrait--description');


// 替代方案
const profile = {
    src: avatar.getAttribute('src'),
    userID: avatarTitle.innerHTML,
    description: avatarDescription.innerHTML,
    content: contentArea.innerHTML
}


function popLoginWindow(e) {
    e.preventDefault();
    loginWindow[0].style.display = 'flex';
}

function hideLoginWindow(e) {
    if (e.target === loginWindow[0]) loginWindow[0].style.display = 'none';
}

function popRegisterWindow(e) {
    e.preventDefault();
    registerWindow[0].style.display = 'flex';
}

function hideRegisterWindow(e) {
    if (e.target === registerWindow[0]) registerWindow[0].style.display = 'none';
}


/*Dynamic Content related*/
function sizeDynamicContentArea() {
    let {
        offsetLeft: left,
        offsetWidth: width
    } = contentArea;
    let contentInfo = {
        left,
        width
    };
    dynamicContentArea.style.transform = `translateX(${contentInfo.left}px)`;
    dynamicContentArea.style.width = `${contentInfo.width}px`;
}

function getDynamicContent(){
    if (this.innerHTML === 'make an album') {
        dynamicContentArea.innerHTML = `
        <div><span id="closeBtn" onclick="dynamicContentArea.style.display = 'none'">X</span></div>
        <div class="form__createAlbum dynamicForm">
            <form action="/upload" method="post" enctype="multipart/form-data">
                <div class="form__row form__title">
                    Create A New Album
                </div>
                <div class="form__row">
                    <label for="albumName">Album Name</label>
                    <input type="text" name="name" id="albumName">
                </div>
                <div class="form__row">
                    <label for="albumDescription">Album Description</label>
                    <textarea type="text" name="description" id="albumDescription" rows="5"></textarea>
                </div>
                <div class="form__row" style="display: none">
                    <input type="text" name="userId" value="${portrait.dataset.userid}">
                </div>
                <div class="form__row">
                    <label for="uploads">Upload Photos</label>
                    <input type="file" accept="image/gif, image/jpeg, image/png" name="image" id="uploads" multiple />
                </div>
                <div class="form__row">
                    <button type="submit" class="btn">Submit</button>
                </div>
            </form>
        </div>`;
    } else if (this.innerHTML === 'add photos') {
        dynamicContentArea.innerHTML = `
        <div><span id="closeBtn" onclick="dynamicContentArea.style.display = 'none'">X</span></div>
        <div class="form__addPhotos dynamicForm"> 
            <form action="/upload/album" method="post" enctype="multipart/form-data" id="addPhotosForm">
                <div class="form__row form__title">
                    Add photos
                </div>
                <div class="form__row">
                    <label for="uploads">Upload Photos</label>
                    <input type="file" accept="image/gif, image/jpeg, image/png" name="image" id="uploads" multiple />
                </div>
                <div class="form__row">
                    <button type="submit" class="btn">Upload</button>
                </div>
            </form>
        </div>`;
        addPhotosForm.addEventListener('submit',asyncPost);
    } else if (this.innerHTML === 'Update Avatar') {
        dynamicContentArea.innerHTML = `
        <div><span id="closeBtn" onclick="dynamicContentArea.style.display = 'none'">X</span></div>
        <div class="form__updateAvatar dynamicForm"> 
            <form action="/upload/avatar" method="post" enctype="multipart/form-data" id="updateAvatarForm">
                <div class="form__row form__title">
                    Update Personal Avatar
                </div>
                <div class="form__row">
                    <label for="upload">Choose a Photo</label>
                    <input type="file" accept="image/gif, image/jpeg, image/png" name="image" id="upload" />
                </div>
                <div class="form__row">
                    <div class="form__updateAvatar--preview" style="display: none">
                        <img src="" alt="">
                    </div>
                </div>
                <div class="form__row">
                    <button type="submit" class="btn">Upload</button>
                </div>
            </form>
        </div>`;
        updateAvatarForm.addEventListener('change',displayAvatarPreview);
    } else if (this.innerHTML === 'Change Cover') {
        dynamicContentArea.innerHTML = ``;
        console.log('do sth');
    }
}




async function asyncPost(e) {
    e.preventDefault();

    const formData = new FormData(addPhotosForm);

    let response = await fetch(`/upload/album?id=${getPresentAlbumId()}&userid=${getPresentUserId()}`, {
        method: 'POST',
        body: formData
    });
    if (response.ok) { // 如果 HTTP 状态码在 200-299 之间
        let imageArr = await response.json();

        addPhotosForm.reset();
        dynamicContentArea.style.display = 'none';

        let contentArr = [];
        contentArr.push(contentArea.innerHTML);

        imageArr.forEach(image=>{
            contentArr.push(`
                <div class="content__img">
                    <div>
                        <img src="${image.src}" alt="">
                        <div style="display: none">some info (maybe)</div>
                    </div>
                </div>`);
        })
        contentArea.innerHTML = contentArr.join('');
        
    } else {
        console.log("HTTP-Error: " + response.status);
    }
}

function displayAvatarPreview() {
    const inputElem = updateAvatarForm.querySelector('input[type="file"]');
    const file = inputElem.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
        updateAvatarForm.querySelector('.form__updateAvatar--preview').style.display = 'flex';
        updateAvatarForm.querySelector('img').setAttribute('src',reader.result);
    };

    reader.onerror = () => {
        console.log(reader.error);
    };
}


function getPresentAlbumId() {
    return portrait.dataset.albumid;
}

function getPresentUserId() {
    return portrait.dataset.userid;
}

function showDynamicContentArea() {
    sizeDynamicContentArea();
    getDynamicContent.bind(this)();

    dynamicContentArea.style.display = 'flex';
}
/*Dynamic Content related ---end*/




if (loginBtn) loginBtn.addEventListener('click', popLoginWindow);
if (registerBtn) registerBtn.addEventListener('click', popRegisterWindow);

loginWindow[0].addEventListener('click', hideLoginWindow);
registerWindow[0].addEventListener('click', hideRegisterWindow);




window.addEventListener('resize', sizeDynamicContentArea);
sideArea.addEventListener('click', e => {
    if (e.target === functionalBtn || e.target === avatarMask ) {
        showDynamicContentArea.bind(e.target)();
    }
})



// 好像可以再整理一下這邊
contentArea.addEventListener('click', getIntoAlbum);

function getIntoAlbum(e) {
    if (e.target.classList.contains('mask')) {
        const albumCover = e.target.nextElementSibling;
        const idInAlbum = albumCover.dataset.albumid; // idInAlbum是字串

        updateSideColumn(albumCover, idInAlbum);
        showImages(albumCover, idInAlbum);
        if (functionalBtn) functionalBtn.innerHTML = 'add photos';
    };
    // return
    if (e.target.classList.contains('return')) {
        // show albumList 這邊等render可以做出來再反向操作就可以ㄌ
        // 現在是替代方案ㄚ 
        avatar.setAttribute('src', profile.src);
        if (avatarMask) avatarMask.innerHTML = 'Update Avatar';
        avatarTitle.innerHTML = profile.userID;
        avatarDescription.innerHTML = profile.description;
        contentArea.innerHTML = profile.content;
        if (functionalBtn) functionalBtn.innerHTML = 'make an album';
    }
}

// 返回時應該要顯示回來 -> 只寫了替代方案
function updateSideColumn(albumCover, idInAlbum) {
    // change to album info
    // put albumid on portrait div
    portrait.dataset.albumid = idInAlbum;

    // change avatar to album cover
    const targetSrc = albumCover.getAttribute('src');
    avatar.setAttribute('src', targetSrc);

    // 
    if (avatarMask) avatarMask.innerHTML = 'Change Cover';

    // set albumName
    const targetAlbumName = albumCover.previousElementSibling.innerHTML;
    avatarTitle.innerHTML = targetAlbumName;

    // update description
    const targetAlbumDescription = albumCover.nextElementSibling.innerHTML;
    avatarDescription.innerHTML = targetAlbumDescription;
}
//



async function showImages(albumCover, idInAlbum) {
    let response = await fetch(`/upload/album?id=${idInAlbum}`);
    if (response.ok) { // 如果 HTTP 状态码在 200-299 之间
        let imageArr = await response.json();

        let contentArr = ['<div style="flex: 1 0 100%"><span class="return">← return</span></div>'];
        imageArr.forEach(image=>{
            contentArr.push(`
                <div class="content__img">
                    <div>
                        <img src="${image.src}" alt="">
                        <div style="display: none">some info (maybe)</div>
                    </div>
                </div>`);
        })
        contentArea.innerHTML = contentArr.join('');

    } else {
      console.log("HTTP-Error: " + response.status);
    }
}
