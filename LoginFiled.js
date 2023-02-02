const ErrorHandler = (Error, target) => {
    if (Error === "Password too weak."){
        document.getElementById("CreatePass").classList.add("invalid")
    }
    if (target == "error"){
        document.getElementById("email").value = "";
        document.getElementById("pass").value = "";
        document.getElementById("pass").classList.add("invalid")
        document.getElementById("email").classList.add("invalid")
    }
    else{
        document.getElementById('username').value = "";
        document.getElementById('CreateEmail').value = "";
        document.getElementById("CreateEmail").classList.add("invalid")
        document.getElementById('CreatePass').value = "";
    }
    document.getElementById(target).innerHTML = Error;

    setTimeout( () => {
        $('#error').fadeOut('slow');
    }, 10000)
}

const ShowLogin = () => {
    console.log('ova');
    document.getElementById('send').disabled = true;
    document.getElementById('LogOut').style.display = 'none'
    document.getElementById('IsSingedIn').innerHTML = "Please Sign In <strong id='user'></strong>"
    // document.getElementById('ModalSignIn').style.display = 'block'
    // document.getElementById('ModalCreateAcc').style.display = 'block'
}

const ShowLogOut = () => {
    // document.getElementById('send').disabled = false;
    document.getElementById('LogOut').style.display = 'block'
    // document.getElementById('ModalSignIn').style.display = 'none'
    // document.getElementById('ModalCreateAcc').style.display = 'none'
    document.getElementById('IsSingedIn').innerHTML = '<strong id="user"></strong>';
}

// const LoadMessages = () => {
//     set(ref(database, 'load/' + 'load'), {
//         load: 'loading'
//     })
// }

// const uploadInput = document.getElementById("uploadInput");
// uploadInput.addEventListener(
//   "change",
//   () => {
//     // Calculate total size
//     let numberOfBytes = 0;
//     for (const file of uploadInput.files) {
//       numberOfBytes += file.size;
//     }

//     // Approximate to the closest prefixed unit
//     const units = [
//       "B",
//       "KiB",
//       "MiB",
//       "GiB",
//       "TiB",
//       "PiB",
//       "EiB",
//       "ZiB",
//       "YiB",
//     ];
//     const exponent = Math.min(
//       Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
//       units.length - 1
//     );
//     const approx = numberOfBytes / 1024 ** exponent;
//     const output =
//       exponent === 0
//         ? `${numberOfBytes} bytes`
//         : `${approx.toFixed(3)} ${
//             units[exponent]
//           } (${numberOfBytes} bytes)`;

//     document.getElementById("fileNum").textContent = uploadInput.files.length;
//     document.getElementById("fileSize").textContent = output;
//   },
//   false
// );