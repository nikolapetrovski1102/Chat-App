import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, set, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { onAuthStateChanged, GoogleAuthProvider, getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"; 

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

    onAuthStateChanged(auth, (user) => {

        if (user) {

          document.getElementById('FireInput-private').addEventListener('click', () => {
            document.getElementById('fileInput-private').click();
          });

        let username = document.getElementById('user').innerHTML;

    // setTimeout( () => {
        firebase.database().ref('UserInfo/').on('value', (snapshot) => {
                for (let i = 0; i < Object.keys(snapshot.val()).length; i++) {
                  if (Object.keys(snapshot.val())[i] != user.uid){
                    document.getElementById('onlineUsers').innerHTML += '<li id="User" class="text-start"> <a id="UserRedirect" href="/nekoj">' + snapshot.val()[Object.keys(snapshot.val())[i]].username + '</a> <span id="UserUid" >' + Object.keys(snapshot.val())[i] + '</span> </li>';
                  }
                }
        });
    // }, 2000)

        let ChatWithUid = '';
        setTimeout( () => {
            document.querySelectorAll('#User').forEach(element => {
                element.addEventListener('click', () => {
                  // window.location.assign('http://localhost:5000/new.html');
                  if (document.querySelector('#chat-private').hasChildNodes()){
                    document.querySelectorAll('#chat-private .imessage').forEach(element => {
                      element.remove();  
                    });
                  }
                  function autoResizeDiv()
                  {
                      document.getElementById('chat-private').style.height = window.innerHeight - 150 +'px';
                  }
                  window.onresize = autoResizeDiv;
                  autoResizeDiv();
                    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                      document.getElementById('ShowOnlineUsers').click();
                    }
                    document.getElementById('chat-with').innerHTML = element.innerHTML;
                    document.querySelector('.first-float-child').style.display = 'none';
                    document.querySelector('.first-float-child-private').style.display = 'block';
                    ChatWithUid = document.querySelector('#chat-with #UserUid').innerHTML;
                    set(ref(database, 'load/' + 'load'), {
                      load: 'loading'
                  })
                  let reeef = '';
                  if (user.uid > ChatWithUid){
                    reeef = firebase.database().ref('PrivateChats/' + user.uid + ',' +  ChatWithUid + '/');
                  }
                  else{
                    reeef = firebase.database().ref('PrivateChats/' + ChatWithUid + ',' +  user.uid + '/');
                  }
                let sender = document.getElementById('user').innerHTML;

            let counter = 0;
            
            reeef.on("child_added", function(snapshot) {

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
                info = '<div id="me" class="imessage text-end"> <li class="messages text-end from-me" id="right">' + snapshot.val().message + '</li>' + '<p class="text-end" id="timeRight">' + snapshot.val().timeSent + '</p> </div>'
              }
              else{
                info = '<div id="them" class="imessage"> <p id="nameSender" class="text-start">' + snapshot.val().name + '</p> <li class="messages text-start from-them" id="left">'  + snapshot.val().message + '</li>' + '<li class="text-start" id="timeLeft">' + snapshot.val().timeSent + '</li> </div>'
              }
                document.getElementById("chat-private").innerHTML += info;
                // $(info).hide().appendTo('#chat').toggle('normal');
                LastTime(document.querySelectorAll('#timeRight'));
                LastTime(document.querySelectorAll('#timeLeft'));
                setTimeout( () => {
                  scrollBottom($('#chat-private'), 200)
                }, 100)
                if (counter == 1){
                  document.querySelector('.lds-ellipsis-private').style.display = 'none';
                }
                MessagePoP();
            });

                });
            });
        }, 5000)
        
        document.querySelector('#send-private').addEventListener('click', SendMsgPrivate);
        document.querySelector('#message-private').addEventListener('keypress', (e) => { (e.key === 'Enter') ? SendMsg() : null; });

        function SendMsgPrivate(){
            let msg = document.getElementById("message-private").value;
            let sender = document.getElementById('user').innerHTML
            let time = (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes();
            
            //if message is empty then return and do nothing
            if (msg == ''){
                return;
            }
            
            //create new message in database with simple timestamp\
            if (user.uid > ChatWithUid){
                set(ref(database, 'PrivateChats/' + user.uid + ',' +  ChatWithUid + '/' + Date.now()), {
                    name: sender,
                    message: msg,
                    userUid: user.uid,
                    timeSent: time
                })
            } else {
                set(ref(database, 'PrivateChats/' + ChatWithUid + ',' +  user.uid + '/' + Date.now()), {
                    name: sender,
                    message: msg,
                    userUid: user.uid,
                    timeSent: time
                })
            }
      
            //clear input field
            document.getElementById('message-private').value = '';
        };

        let url = '';
        document.getElementById('fileInput-private').onchange = async function () {
          url = await base64Url(this.files[0]);
          document.querySelector('body > button:nth-child(6)').click();
          document.getElementById('ModalImage-private').src = url;
        };

        function base64Url(file){
          return new Promise(function(resolve,reject){
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result)
              reader.onerror = (error) => reject(error)
              reader.readAsDataURL(file);
          })
        }

        document.getElementById('sub-private').addEventListener('click', () => {
          if (user.uid > ChatWithUid){
            set(ref(database, 'PrivateChats/' + user.uid + ',' +  ChatWithUid + '/' + Date.now()), {
            message: url,
            username: document.querySelector('#user').innerHTML,
            timeSent: (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes(),
            userUid: user.uid,
          }).then( () => {
            document.querySelector('#myModal-private > div > div > div.modal-header > button').click();
            document.querySelector('#fileInput-private').value = '';
          }).catch( (error) => {
            console.log(error);
            });
        }
        else{
          set(ref(database, 'PrivateChats/' + ChatWithUid + ',' +  user.uid + '/' + Date.now()), {
            message: url,
            username: document.querySelector('#user').innerHTML,
            timeSent: (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes(),
            userUid: user.uid,
          }).then( () => {
            document.querySelector('#myModal-private > div > div > div.modal-header > button').click();
            document.querySelector('#fileInput-private').value = '';
          }).catch( (error) => {
            console.log(error);
            });
          }
        });

        document.querySelector('#myModal-private > div > div > div.modal-footer > button:nth-child(1)').addEventListener('click', () => {
          document.querySelector('#fileInput').value = '';
        });
        document.querySelector('#myModal-private > div > div > div.modal-header > button').addEventListener('click', () => {
          document.querySelector('#fileInput').value = '';
        });

          document.getElementById('backToGroup').addEventListener('click', () => {
            document.querySelector('.first-float-child').style.display = 'block';
            document.querySelector('.first-float-child-private').style.display = 'none';
            ChatWithUid = document.querySelector('#chat-with #UserUid').style.display = 'none';
          });

        };
    });