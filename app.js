import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, set, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { onAuthStateChanged, signOut, GoogleAuthProvider, getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"; 


const firebaseConfig = {
  apiKey: "AIzaSyBv1HZ-dv0fHelFPplmo0NkUhLvjLCOF5U",
  authDomain: "chatapp-5a8f7.firebaseapp.com",
  databaseURL: "https://chatapp-5a8f7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatapp-5a8f7",
  storageBucket: "chatapp-5a8f7.appspot.com",
  messagingSenderId: "664027121459",
  appId: "1:664027121459:web:c65c3367d6d0b7a2a1a046",
  measurementId: "G-GQRPMCSEFE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);
const db = firebase.database();

  const RequestNotification = () => {
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted'){
        console.log('granted');
        new Notification ('Welcome to ChatApp', {
          body: 'You can now send and receive messages',
        })
      }
      else if (permission === 'denied'){
        new Notification ('Welcome to ChatApp', {
          body: 'You can now send and receive messages please allow notifications to get notified when you receive a message',
        })
      }
      else if (permission === 'default'){
        new Notification ('Welcome to ChatApp', {
          body: 'You can now send and receive messages please allow notifications to get notified when you receive a message',
        })
      }
    }
  )};

  let ShowNotification = document.visibilityState !== 'visible';

  if (ShowNotification){
    console.log('show notification');
  }

  //scroll to bottom on page load and on new message
  const scrollBottom = (element, t) => {
    $(element).stop().animate({
      scrollTop: $(element)[0].scrollHeight
    }, t);
  }

  //show time on last message only
  const LastTime = (element) => {
    for (let i = 0; i < element.length - 1; i++) {
      element[i].remove();
    }
  }

  //add tail on last message only
  const MessagePoP = () => {
    document.querySelectorAll('#right').forEach(element => {
      if (element != document.querySelectorAll('#right')[document.querySelectorAll('#right').length - 1]){
        element.classList.add('no-tail');
      }
    });
  }

  function autoResizeDiv()
  {
      document.getElementById('chat').style.height = window.innerHeight - 150 +'px';
      document.querySelector('.second-float-child').style.height = window.innerHeight - 150 +'px';
  }
  window.onresize = autoResizeDiv;
  autoResizeDiv();
  
  onAuthStateChanged(auth, (user) => {

  //If user is still logged in
  if (user) {

    document.querySelector('body > div.float-container').style.display = 'block'
    document.getElementById('IsLogedIn').style.display = 'none';

    var chat = document.getElementById('chat');

    if(user.uid){

      //adding load to database for loading on page load
      set(ref(database, 'load/' + 'load'), {
        load: 'loading'
      })

      setTimeout ( () => {
        set(ref(database, 'OnlineUsers/'+ user.uid), {
          username: document.querySelector('#user').innerHTML,
          isOnline: 'online',
          userUid: user.uid
        })
        //listing all users that have account
        let OnlineUsers = firebase.database().ref("OnlineUsers/");
  
        let OnlineUsersCount = 0;
        OnlineUsers.on('child_added', (snapshot) => {
          if (snapshot.val().userUid != user.uid){
            document.querySelectorAll('#onlineUsers li').forEach(element => {
                if (element.querySelector('span').innerHTML == snapshot.val().userUid){
                  element.innerHTML = snapshot.val().username + '     &#128994' + '<span id="UserUid" style="display: none;">' + snapshot.val().userUid + '</span>'
                  OnlineUsersCount++;
                }
              });
          }
          document.querySelector('#OnlineUsersCount').innerHTML = 'Online Users' + ' (' + OnlineUsersCount + ')' + '<img class="ms-3" src="./assets/CreateGroup.png" id="CreateGroupButton" data-bs-toggle="modal" data-bs-target="#CreateGroup" alt="Create group" width="40">';
          document.querySelector('#ShowOnlineUsers').innerHTML = OnlineUsersCount + ' <span id="pulse" > &#128994 </span>';
        });

                  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    document.onvisibilitychange = () => {
                      if (document.visibilityState === 'hidden') {
                        firebase.database().ref("OnlineUsers/" + user.uid).remove();
                      }
                      else if (document.visibilityState === 'visible'){
                        set(ref(database, 'OnlineUsers/'+ user.uid), {
                          isOnline: 'online',
                          userUid: user.uid,
                          username: document.querySelector('#user').innerHTML,
                        })
                      }
                    }
                  }
                  else{
                    window.addEventListener('beforeunload',  (e) => {
                      firebase.database().ref("OnlineUsers/" + user.uid).remove();
                    });
                  }
        
        OnlineUsers.on('child_removed', (snapshot) => {
          document.querySelectorAll('#onlineUsers li').forEach(element => {
            if (element.querySelector('span').innerHTML == snapshot.val().userUid){
              console.log('removed');
              element.innerHTML = snapshot.val().username + '<span style="display: none;">  ' + snapshot.val().userUid + '</span>'
              OnlineUsersCount--;
              document.querySelector('#OnlineUsersCount').innerHTML = 'Online Users' + ' (' + OnlineUsersCount + ')' + '<img class="ms-3" src="./assets/CreateGroup.png" id="CreateGroupButton" data-bs-toggle="modal" data-bs-target="#CreateGroup" alt="Create group" width="40">' ;
              document.querySelector('#ShowOnlineUsers').innerHTML = OnlineUsersCount + ' <span id="pulse" > &#128994 </span>';
            }
          })
        });

      }, 1500);
        
      // if user is logged in then show logout button
      ShowLogOut();
      setTimeout( () => {

      //display username if user is logged in with email and password
      if (user.displayName == null){
        var ref = firebase.database().ref("UserInfo/" + user.uid);
        ref.on("value", function(snapshot) {
          var username = snapshot.val().username;
          document.getElementById('user').innerHTML = username
          document.getElementById('loaderPage').style.display = 'none';
          document.querySelector('#user').classList.remove('loader');
        }, function (error) {
        })
      }
    }, 10)
    //display username if user is logged in with google
      if (user.displayName != null){
        document.getElementById('user').innerHTML = user.displayName
        document.querySelector('#user').classList.remove('loader');
      }
      // document.getElementById("LogedIn").style.display = 'block'
      document.querySelector("#LogOut").addEventListener('click', (event) => {
      signOut(auth).then( () => {

        firebase.database().ref("OnlineUsers/" + user.uid).remove();

        document.getElementById("LogIn").style.display = 'block'
        document.getElementById('email').value = "";
        document.getElementById('pass').value = "";

      }).catch( (error) => {
          console.log(error);
      })
    })


    var url;

    document.getElementById('FireInput').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').onchange = async function () {
      url = await base64Url(this.files[0]);
      console.log(url);
      document.getElementById('ModalImage').src = url;
      document.querySelector('#ImagePublic').click();
    };

    document.querySelector('#myModal > div > div > div.modal-footer > button:nth-child(1)').addEventListener('click', () => {
      document.querySelector('#fileInput').value = '';
    });
    document.querySelector('#myModal > div > div > div.modal-header > button').addEventListener('click', () => {
      document.querySelector('#fileInput').value = '';
    });

    document.getElementById('sub').addEventListener('click', () => {
      set(ref(database, 'messages/' + Date.now()), {
        message: url,
        username: document.querySelector('#user').innerHTML,
        timeSent: (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes(),
        userUid: user.uid,
      }).then( () => {
        document.querySelector('#myModal > div > div > div.modal-footer > button:nth-child(1)').click();
        document.querySelector('#fileInput').value = '';
      }).catch( (error) => {
        console.log(error);
        });
    });

      function base64Url(file){
        return new Promise(function(resolve,reject){
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
            reader.readAsDataURL(file);
        })
      }

    }   //istening for button on click and evaluating function
    document.querySelector('#send').addEventListener("click", SendMsg)
    //listening for enter key and evaluating function
    document.querySelector('#message').addEventListener('keypress', (e) => { (e.key === 'Enter') ? SendMsg() : null; });
    function SendMsg(){
      let msg = document.getElementById("message").value;
      let sender = document.getElementById('user').innerHTML
      let time = (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes();

      //if message is empty then return and do nothing
      if (msg == ''){
        return;
      }

      //create new message in database with simple timestamp
      set(ref(database, 'messages/' + Date.now()), {
        name: sender,
        message: msg,
        userUid: user.uid,
        timeSent: time
      })

      //clear input field
      document.getElementById('message').value = '';
      RequestNotification();
    }



    setTimeout( () => {

      let sender = document.getElementById('user').innerHTML;
      let reef = firebase.database().ref("messages");
      let counter = 0;
      
      reef.on("child_added", function(snapshot) {
        
        counter++;
        var info = "";

        if(snapshot.val().message.split(':')[0] == 'data'){
          if (snapshot.val().userUid == user.uid){
          info = '<div id="me" class="imessage"> <li class="messages text-end from-me no-tail" id="rightImage">' + '<img src="' + snapshot.val().message + '" width="350"  class="img-fluid" alt="Responsive image">' + '</li>' + '<p class="text-end" id="timeRight">' + snapshot.val().timeSent + '</p> </div>'
        }
        else{
          info = '<div id="them" class="imessage"> <li class="messages text-start from-them no-tail" id="rightImage">' + '<img src="' + snapshot.val().message + '" width="350" class="img-fluid" alt="Responsive image">' + '</li>' + '<p class="text-start" id="timeRight">' + snapshot.val().timeSent + '</p> </div>'
          }
        }
        else if (snapshot.val().message === "just joined the chat"){
          info = '<div class="text-center" id="selector"> <p> <strong id="JoinedUser">' + snapshot.val().name + '</strong> ' + snapshot.val().message + '</p> <p id="NewUserTime">' + snapshot.val().timeSent + '</p> </div>'
        }
        else if (sender === snapshot.val().name){
          // info = '<div class="d-flex align-items-center float-end"> <div class="d-inline-block">Delete</div> <div class="d-inline-block"> <li class="sent">' + snapshot.val().message + '</li> </div> </div>'
          info = '<div id="me" class="imessage text-end"> <li class="messages text-end from-me" id="right">' + snapshot.val().message + '</li>' + '<p class="text-end" id="timeRight">' + snapshot.val().timeSent + '</p> </div>'
        }
        else{
          info = '<div id="them" class="imessage"> <p id="nameSender" class="text-start">' + snapshot.val().name + '</p> <li class="messages text-start from-them" id="left">'  + snapshot.val().message + '</li>' + '<li class="text-start" id="timeLeft">' + snapshot.val().timeSent + '</li> </div>'
        }
          document.getElementById("chat").innerHTML += info;
          // $(info).hide().appendTo('#chat').toggle('normal');
          LastTime(document.querySelectorAll('#timeRight'));
          LastTime(document.querySelectorAll('#timeLeft'));
          setTimeout( () => {
            scrollBottom(chat, 200)
          }, 100)
          if (counter == 1){
            document.querySelector('.lds-ellipsis').style.display = 'none';
          }
          MessagePoP();
        });
      }, 10)

      }

      //If user is not logged in then show login button
      else {
        ShowLogin();
        
  document.querySelector("#SignInGoogle").addEventListener('click', GoogleLogin)
  document.querySelector("#CreateGoogle").addEventListener('click', GoogleLogin)
  function GoogleLogin() {
  const auth = getAuth();
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;

    let reef = firebase.database().ref("UserInfo/");
    
    reef.on('value', (snapshot) =>{
      for (let i = 0; i < Object.keys(snapshot.val()).length; i++) {
        if (Object.keys(snapshot.val())[i] != user.uid){
          set(ref(database, 'UserInfo/' + user.uid), {
            email: user.email,
            username: user.displayName,
          })
        }
      }
    })
    
    document.getElementById('IsLogedIn').style.display = 'none';
    document.getElementById('user').innerHTML = user.displayName
    document.getElementById('CloseCreateAccount').click();
    document.getElementById('CloseSingIn').click();
    
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }

  document.querySelector('#SignUp').addEventListener('click', (event) => {
  const email = document.getElementById('CreateEmail').value;
  const password = document.getElementById('CreatePass').value;
  const username = document.getElementById('username').value;
  const time = (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes();
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {

    console.log('da');
    // const userCred = push(child(ref(database), 'user')).key;

    set(ref(database, 'UserInfo/' + userCredential.user.uid), {
      email: email,
      password: password,
      username: username
    }).then( () => {
      set(ref(database, 'messages/' + Date.now()), {
        name: username,
        message: "just joined the chat",
        userUid: userCredential.user.uid,
        timeSent: time
    })
  });
    
    document.getElementById('LogedIn').style.display = 'none';
    document.getElementById('user').innerHTML = username;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    if (errorCode == "auth/email-already-in-use"){
      ErrorHandler("The email address is already in use.", "errorCreate")
    }
    if (errorCode == "auth/invalid-email"){
      ErrorHandler("Invalid email address.", "errorCreate")
    }
    if (errorCode == "auth/weak-password"){
      ErrorHandler("Password too weak.", "errorCreate")
    }
  });
  })

  document.querySelector('#SignIn').addEventListener('click', (event) => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('pass').value;
  
  const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    const user = userCredential.user;

    document.getElementById('IsLogedIn').style.display = 'none';
  })
  .catch((error) => {
    console.log(error);
    const errorCode = error.code;
    if (errorCode == "auth/wrong-password" || errorCode == "auth/invalid-email"){
      ErrorHandler("The email or password you entered is incorrect.", "error")
    }
    if (errorCode == "auth/user-not-found"){
      ErrorHandler("User not found.", "error");
    }
    const errorMessage = error.message;
    });
  })
  }
  });