import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, set, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { signOut, GoogleAuthProvider, getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"; 
import { getStorage, ref as ref_storage} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDq6FucrXdbFCIEh9Q7xAw6aJs3irX77Y8",
  authDomain: "realtime-chatapp-9ef58.firebaseapp.com",
  databaseURL: "https://realtime-chatapp-9ef58-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "realtime-chatapp-9ef58",
  storageBucket: "realtime-chatapp-9ef58.appspot.com",
  messagingSenderId: "32685298126",
  appId: "1:32685298126:web:4bd77d388dab3afb909b9f",
  measurementId: "G-PE2LGSRHZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);
const db = firebase.database();

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


firebase.auth().onAuthStateChanged(function(user) {

  //If user is still logged in
  if (user) {

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
  
        OnlineUsers.on('child_added', (snapshot) => {
          let chatNames = '<li class="text-start" id="OnlineUser">' + snapshot.val().username + '<span style="display: none;">' + snapshot.val().userUid + '</span> &#128994 </li>'
          console.log(chatNames);
          document.getElementById('OnlineUsers').innerHTML += chatNames;
          document.querySelector('body > div:nth-child(3) > button').innerHTML = 'Online Users' + ' (' + document.querySelectorAll('#OnlineUsers li').length + ')';
        });
        
        OnlineUsers.on('child_removed', (snapshot) => {
          document.querySelectorAll('#OnlineUsers li').forEach(element => {
            if (element.querySelector('span').innerHTML == snapshot.val().userUid){
              element.remove();
              document.querySelector('body > div:nth-child(3) > button').innerHTML = 'Online Users' + ' (' + document.querySelectorAll('#OnlineUsers li').length + ')';
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
      document.getElementById("LogedIn").style.display = 'block'
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

    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      firebase.database().ref("OnlineUsers/" + user.uid).remove();
    });

    var selectedFile;
    document.getElementById('fileInput').onchange = function () {
      // alert('Selected file: ' + this.value);
      document.getElementById('message').placeholder = 'Image Selected';
      document.getElementById('send').style.display = 'none';
      document.getElementById('sub').style.display = 'block';
      selectedFile = this.files[0];
    };
    // if( document.getElementById("fileInput").files.length != 0){
      document.querySelector('#sub').addEventListener('click', () => {
          let fileName = selectedFile.name;
          let storageRef = firebase.storage().ref('images/' + fileName);
          let uploadTask = storageRef.put(selectedFile);

          uploadTask.on('state_changed', function (snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, function (error) {
            console.log(error);
          }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              console.log('File available at', downloadURL);
              set(ref(database, 'messages/' + Date.now()), {
                message: downloadURL + '_image',
                name: document.querySelector('#user').innerHTML,
                timeSent: (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes(),
                userUid: user.uid
              })
            });
          });
      })
  // }

      // set(ref(database, 'OnlineUsers/' + user.uid)), {
      //   username: user.displayName
      // }

      // names.on('value', (snapshot) => {
      //   let i = -1;
      //   console.log(snapshot.val());
      //   // let key = Object.keys(snapshot.val());
      //   snapshot.forEach(element => {
      //     i++;
      //     let chatNames = '<li>' + element.val().username + '<span style="display: none;">' + key[i] + '</span> <button id="private">Private Chat</button> </li>'

      //     document.getElementById('chatNames').innerHTML += chatNames;
      //   });
      // });
      //ends here

    // document.querySelector('#chat').addEventListener('click', () => {
    //   document.querySelectorAll('#private').forEach(element => {
    //     element.addEventListener('click', () => {
    //       document.getElementById('send').style.display = 'none';
    //       document.getElementById('sendPrivate').style.display = 'block';
    //       let privateChatUid = element.parentNode.childNodes[1].innerHTML;
    //       let privateChatName = element.parentNode.childNodes[0].data;
    //       set(ref(database, 'PrivateMessages/' + user.uid + ',' + privateChatUid), {
    //         communcation: user.uid + privateChatUid,
    //       })
    //       var messagesClass = document.querySelectorAll('#chat .imessage');
  
    //       for (let i = 0; i < messagesClass.length; i++) {
    //         messagesClass[i].remove()
    //       }

    //       document.getElementById("PrivateName").innerHTML = privateChatName;

    //       document.querySelector('#sendPrivate').addEventListener("click", function () {
    //   let msg = document.getElementById("message").value;
    //   // let sender = document.getElementById('user').innerHTML
    //   let time = (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes();

    //   if (msg == ''){
    //     return;
    //   }

      
    //   push(ref(database, 'PrivateMessages/' + user.uid + ',' + privateChatUid), {
    //     // name: user.displayName,
    //     message: msg,
    //     userUid: user.uid,
    //     timeSent: time
    //   })

    //   let refMessage = user.uid + ',' + privateChatUid;

    //   let reef = firebase.database().ref("PrivateMessages/" + refMessage);

    //     reef.on("value", function(snapshot) {

    //       var messagesClass = document.querySelectorAll('#chat .imessage');
  
    //       for (let i = 0; i < messagesClass.length; i++) {
    //         messagesClass[i].remove()
    //       }

    //       console.log(snapshot.val());
          
    //       var data = snapshot.val()
    //       var keys = Object.keys(data);
    //       console.log(keys);
    //       for (let i = 0; i < keys.length; i++){
    //           let k = keys[i];
    //           var liElement = "";
    //           if (data[k].userUid == user.uid){
    //             liElement = '<div class="imessage"> <li class="messages text-end from-me" id="right">' + data[k].message + '</li>' + '<p class="text-end" id="timeRight">' + data[k].timeSent + '</p> </div>'
    //           }
    //           else{
    //             liElement = '<div class="imessage"> <p id="nameSender" class="text-start">' + data[k].name + '</p> <li class="messages text-start from-them" id="left">'  + data[k].message + '</li>' + '<li class="text-start" id="timeLeft">' + data[k].timeSent + '</li> </div>'
    //           }
    //             document.getElementById('chat').innerHTML += liElement;
    //             // $(liElement).hide().appendTo('#chat').toggle('normal');
    //             MessagePoP();
    //             LastTime(document.querySelectorAll('#timeRight'));
    //             LastTime(document.querySelectorAll('#timeLeft'));
    //             setTimeout( () => {
    //               scrollBottom(chat, 200)
    //             }, 200)
    //       }
    //   });
    //   document.getElementById('message').value = '';
    // });
    //     });
    //   })
    // })
    }

    //istening for button on click and evaluating function
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
    }

    setTimeout( () => {

      let sender = document.getElementById('user').innerHTML;
      let reef = firebase.database().ref("messages");
      let counter = 0;
      
      reef.on("child_added", function(snapshot) {
        
        counter++;
        var info = "";

        if(snapshot.val().message.split('_')[1] == 'image'){
          if (snapshot.val().userUid == user.uid){
          console.log(snapshot.val().message.split('_')[0]);
          info = '<div id="me" class="imessage"> <li class="messages text-end from-me" id="rightImage">' + '<img src="' + snapshot.val().message.split('_')[0] + '" class="img-fluid" alt="Responsive image">' + '</li>' + '<p class="text-end" id="timeRight">' + snapshot.val().timeSent + '</p> </div>'
          }
        }
        else if (snapshot.val().message === "just joined the chat"){
          info = '<div id="selector"> <p> <strong id="JoinedUser">' + snapshot.val().name + '</strong> ' + snapshot.val().message + '</p> <p id="NewUserTime">' + snapshot.val().timeSent + '</p> </div>'
        }
        else if (sender === snapshot.val().name){
          info = '<div id="me" class="imessage"> <li class="messages text-end from-me" id="right">' + snapshot.val().message + '</li>' + '<p class="text-end" id="timeRight">' + snapshot.val().timeSent + '</p> </div>'
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
        });
      }, 500)

      }

      //If user is not logged in then show login button
      else {
        document.querySelector('.lds-ellipsis').style.display = 'none';
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
    
    
    document.getElementById('LogedIn').style.display = 'block'
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
    
    document.getElementById('user').innerHTML = username;
    document.getElementById('CloseCreateAccount').click();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
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

    document.getElementById('CloseSingIn').click();
  })
  .catch((error) => {
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