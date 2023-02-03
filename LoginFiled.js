window.onload = () => {
    let background = localStorage.getItem('background');
    if (background !== null){
        document.querySelector('#chat').style.backgroundImage = `url(${background})`
    }
    else{
        document.querySelector('#chat').style.background = '#1f2029';
    }
} 

const ErrorHandler = (Error, target) => {
    if (Error === "The email address is already in use."){
        document.getElementById("CreateEmail").value = "";
        document.getElementById("CreatePass").value = "";
        document.getElementById("username").value = "";
        document.getElementById("CreateEmail").classList.add("invalid")
    }
    else if (Error === 'Invalid email address.'){
        document.getElementById("CreateEmail").value = "";
        document.getElementById("CreatePass").value = "";
        document.getElementById("username").value = "";
        document.getElementById("CreateEmail").classList.add("invalid")
    }
    if (Error === "Password too weak."){
        document.getElementById("CreateEmail").value = "";
        document.getElementById("CreatePass").value = "";
        document.getElementById("username").value = "";
        document.getElementById("CreatePass").classList.add("invalid")
    }
    if (Error === 'The email or password you entered is incorrect.' || Error === 'User not found.'){
        document.getElementById("email").value = "";
        document.getElementById("pass").value = "";
        document.getElementById("pass").classList.add("invalid")
        document.getElementById("email").classList.add("invalid")
    }
    document.getElementById(target).innerHTML = Error;
    document.querySelector('.card-front').style.height = "125%";
    document.querySelector('.card-back').style.height = "125%";
}

const ShowLogin = () => {
    document.getElementById('LogOut').style.display = 'none'
    document.querySelector('#IsSingedIn').style.visibility = 'hidden'
    document.querySelector('body > div.float-container').style.display = 'none'
    document.getElementById('IsLogedIn').style.display = 'block';
    document.querySelector('.lds-ellipsis').style.display = 'none';
}

const ShowLogOut = () => {
    document.getElementById('LogOut').style.display = 'block'
    document.querySelector('#IsSingedIn').style.visibility = 'visible'
}

document.getElementById('ShowOnlineUsers').addEventListener('click', () => {
    $('.second-float-child').fadeIn('slow');
    document.querySelector('.second-float-child').classList.add('mobile')
    document.getElementById('ShowOnlineUsers').style.display = 'none'
});

document.getElementById('CloseUserCount').addEventListener('click', () => {
    $('.second-float-child').fadeOut('slow');
    document.querySelector('.second-float-child').classList.remove('mobile')
    document.getElementById('ShowOnlineUsers').style.display = 'block'
});

    console.log( document.querySelectorAll('#exampleModal > div > div > div.modal-body > ul > li > img') );

document.querySelectorAll('#exampleModal > div > div > div.modal-body > ul > li > img').forEach((li) => {
    li.addEventListener('click', () => {
        document.querySelector('#chat').style.backgroundImage = `url(${li.src})`
        localStorage.setItem('background', li.src)
        document.querySelector('#exampleModal > div > div > div.modal-footer > button:nth-child(2)').click();
    })
});

document.querySelector('#exampleModal > div > div > div.modal-footer > button:nth-child(1)').addEventListener('click', () => {
    document.querySelector('#chat').style.background = '#1f2029';
    localStorage.removeItem('background')
    localStorage.setItem('background', '#1f2029')
});