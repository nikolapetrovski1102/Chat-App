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

        firebase.database().ref('UserInfo/').on('value', (snapshot) => {
                for (let i = 0; i < Object.keys(snapshot.val()).length; i++) {
                  if (Object.keys(snapshot.val())[i] != user.uid){
                    document.getElementById('onlineUsers').innerHTML += '<li id="User" class="text-start">' + snapshot.val()[Object.keys(snapshot.val())[i]].username + '<span id="UserUid" >' + Object.keys(snapshot.val())[i] + '</span> </li>';
                    document.getElementById('onlineUsersGroup').innerHTML += '<label> <li id="AddToGroup">' + snapshot.val()[Object.keys(snapshot.val())[i]].username + '<input type="checkbox" id="UserGroupCheckBox" name="UserGroup" value="UserGroup"><span id="UserUid" >' + Object.keys(snapshot.val())[i] + '</span></li> </label> ';
                  }
                }
        });

        let ChatWithUid = '';
        setTimeout( () => {
            document.querySelectorAll('#User').forEach(element => {
                element.addEventListener('click', () => {
                  document.getElementById('chat').style.height = window.innerHeight - 185 +'px';
                  document.querySelector('.parent-input-private').style.display = 'block';
                  document.querySelector('.parent-input').style.display = 'none';
                  document.querySelector('.parent-input-group').style.display = 'none';
                  if (document.querySelector('#chat').hasChildNodes()){
                    document.querySelectorAll('#chat .imessage').forEach(element => {
                      element.remove();  
                    });
                    document.querySelectorAll('#chat p').forEach(element => {
                      element.remove();
                    });
                  }
                    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                      document.getElementById('ShowOnlineUsers').click();
                    }
                    document.getElementById('ChatInformation').style.display = 'block';
                    document.getElementById('ChatInformation').innerHTML = '<button class="btn btn-primary" id="BackToPublic">&laquo back</button>' + element.innerHTML;
                    ChatWithUid = document.querySelector('#ChatInformation #UserUid').innerHTML;
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
                document.getElementById("chat").innerHTML += info;
                // $(info).hide().appendTo('#chat').toggle('normal');
                LastTime(document.querySelectorAll('#timeRight'));
                LastTime(document.querySelectorAll('#timeLeft'));
                setTimeout( () => {
                  scrollBottom($('#chat'), 200)
                }, 100)
                if (counter == 1){
                  document.querySelector('.lds-ellipsis').style.display = 'none';
                }
                MessagePoP();
            });

            document.getElementById('BackToPublic').addEventListener('click', () => {
              document.querySelector('#chat').style.height = window.innerHeight - 150 +'px';
              document.querySelector('.parent-input-group').style.display = 'none';
              document.querySelector('.parent-input-private').style.display = 'none';
              document.querySelector('.parent-input').style.display = 'block';
              if (document.querySelector('#chat').hasChildNodes()){
                console.log('Biris nodes');
                document.querySelectorAll('#chat .imessage').forEach(element => {
                    element.remove();
                });
                document.querySelectorAll('#chat #selector').forEach(element => {
                  element.remove();
                });
              }
              set(ref(database, 'load/' + 'load'), {
                load: 'loading'
              }).then( () => {
                firebase.database().ref('messages').on('child_added', (snapshot) => {
                  
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
              })
    
              document.getElementById('ChatInformation').style.display = 'none';
  
            });

                });
            });
        }, 5000)
        
        document.querySelector('#send-private').addEventListener('click', SendMsgPrivate);
        document.querySelector('#message-private').addEventListener('keypress', (e) => { (e.key === 'Enter') ? SendMsgPrivate() : null; });

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
          document.querySelector('#ImagePrivate').click();
          document.getElementById('ModalImage-private').src = url;
        };

        document.querySelector('#myModal-private > div > div > div.modal-header > button').addEventListener('click', () => {
          document.getElementById('fileInput-private').value = '';
        });
        
        document.querySelector('#myModal-private > div > div > div.modal-footer > button:nth-child(1)').addEventListener('click', () => {
          document.getElementById('fileInput-private').value = '';
        });

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

        document.getElementById('FireInput-group').addEventListener('click', () => {
          document.getElementById('fileInput-group').click();
        });

        let urlGroup = '';
        document.getElementById('fileInput-group').onchange = async function () {
          urlGroup = await base64Url(this.files[0]);
          document.querySelector('#GroupImage').click();
          document.getElementById('ModalImageGroup').src = urlGroup;
        };

        document.querySelector('#myModalGroup > div > div > div.modal-header > button').addEventListener('click', () => {
          document.getElementById('fileInput-group').value = '';
        });
        
        document.querySelector('#myModalGroup > div > div > div.modal-footer > button:nth-child(1)').addEventListener('click', () => {
          document.getElementById('fileInput-group').value = '';
        });

        document.getElementById('sub-group').addEventListener('click', () => {
          console.log(GroupName);
          set(ref(database, 'GroupsChat/' + document.getElementById('GroupUid').innerHTML + '/' + Date.now()), {
            message: urlGroup,
            username: document.querySelector('#user').innerHTML,
            timeSent: (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes(),
            userUid: user.uid,
          }).then( () => {
            document.querySelector('#myModalGroup > div > div > div.modal-header > button').click();
            document.querySelector('#fileInput-group').value = '';
          }).catch( (error) => {
            console.log(error);
            });
        });
            
        let StringArray = '';
        document.querySelector('#CreateGroup > div > div > div.modal-footer > button.btn.btn-primary').addEventListener('click', () => {
          StringArray += user.uid + ', ';
            document.querySelectorAll('#UserGroup').forEach(element => {
              if (element.checked){
                let parent = element.parentNode
                StringArray += parent.childNodes[3].innerHTML + ', ';
              }
            });
          
          if (StringArray == ''){
            return;
          }
          else{
            let GroupName;
            if (document.getElementById('GroupName').value == ''){
              GroupName = 'No Name Group';
            }
            else{
              GroupName = document.getElementById('GroupName').value;
            }
            set(ref(database, 'GroupsInfo/' + StringArray), {
              name: GroupName,
              users: StringArray,
              creator: user.uid,
            }).then( () => {
              document.querySelector('#CreateGroup > div > div > div.modal-header > button').click();
              document.querySelectorAll('#UserGroup').forEach(element => {
                element.checked = false;
              });
            }).catch( (error) => {
              console.log(error);
            });
          }

        });

        let GroupRef = firebase.database().ref('GroupsInfo/');

        GroupRef.on('value', (snapshot) => {
          let data = snapshot.val();
          let keys = Object.keys(data);
          for (let i = 0; i < keys.length; i++) {
            if (keys[i].split(', ').includes(user.uid)){
              console.log(snapshot.val());
              GroupRef.child(keys[i]).on('value', (snapshot) => {
                document.querySelector('#onlineUsers').innerHTML += '<li class="text-start" id="UserGroup">' + snapshot.val().name + '<span id="GroupUid">' + keys[i] + '</span></li>'
              });
            }
          }
        });
        let GroupID;
        setTimeout(() => {
        document.querySelectorAll('#UserGroup').forEach(element => {
          element.addEventListener('click', () => {
            document.querySelector('#chat').style.height = window.innerHeight - 185 +'px';
            document.getElementById('ChatInformation').style.display = 'block';
            document.getElementById('ChatInformation').innerHTML = '<button class="btn btn-primary" id="BackToPublic">&laquo back</button>' + element.innerHTML;
            GroupID = element.childNodes[1].innerHTML;
            document.querySelector('.parent-input').style.display = 'none';
            document.querySelector('.parent-input-private').style.display = 'none';
            document.querySelector('.parent-input-group').style.display = 'block';
          if (document.querySelector('#chat').hasChildNodes()){
            document.querySelectorAll('#chat .imessage').forEach(element => {
                element.remove();
            });
            document.querySelectorAll('#chat #selector').forEach(element => {
              element.remove();
            });
          }

          console.log(GroupID);
          firebase.database().ref('GroupsChat/' + GroupID + '/').on("child_added", function(snapshot) {
            
            counter++;
            var info = "";

            let sender = document.getElementById('user').innerHTML;

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
              document.getElementById("chat").innerHTML += info;
              LastTime(document.querySelectorAll('#timeRight'));
              LastTime(document.querySelectorAll('#timeLeft'));
              setTimeout( () => {
                scrollBottom($('#chat'), 200)
              }, 100)
              if (counter == 1){
                document.querySelector('.lds-ellipsis').style.display = 'none';
              }
              MessagePoP();
          });

          document.getElementById('BackToPublic').addEventListener('click', () => {
            document.querySelector('#chat').style.height = window.innerHeight - 150 +'px';
            document.querySelector('.parent-input-group').style.display = 'none';
            document.querySelector('.parent-input-private').style.display = 'none';
            document.querySelector('.parent-input').style.display = 'block';
            if (document.querySelector('#chat').hasChildNodes()){
              console.log('Biris nodes');
              document.querySelectorAll('#chat .imessage').forEach(element => {
                  element.remove();
              });
              document.querySelectorAll('#chat #selector').forEach(element => {
                element.remove();
              });
            }
            set(ref(database, 'load/' + 'load'), {
              load: 'loading'
            }).then( () => {
              firebase.database().ref('messages').on('child_added', (snapshot) => {
                
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
            })
  
            document.getElementById('ChatInformation').style.display = 'none';

          });

          });
        });
      }, 1000);

      document.querySelector('#send-group').addEventListener('click', SendMsgGroup);
      document.querySelector('#message-group').addEventListener('keypress', (e) => { (e.key === 'Enter') ? SendMsgGroup() : null; });

        function SendMsgGroup() {
          let msg = document.getElementById('message-group').value;
          let sender = document.querySelector('#user').innerHTML;
          let time = (new Date().getHours()<10?'0':'') + new Date().getHours() + ":" + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes();
          if (msg != ''){
            set(ref(database, 'GroupsChat/' + GroupID + '/' + Date.now()), {
              name: sender,
              message: msg,
              userUid: user.uid,
              timeSent: time
            })
          }

          document.getElementById('message-group').value = '';

        };

  };
});