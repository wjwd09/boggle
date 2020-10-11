// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAXKXjv8FwrqKr6q2Poc4vaA-hb05oIRrk",
    authDomain: "boggle-16e1d.firebaseapp.com",
    databaseURL: "https://boggle-16e1d.firebaseio.com",
    projectId: "boggle-16e1d",
    storageBucket: "boggle-16e1d.appspot.com",
    messagingSenderId: "510362138745",
    appId: "1:510362138745:web:5b0b39a5d8b4628b383ca8"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);


let myDatabase = firebase.database();
let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];



var userGame = function(username){
  let score = 0;
  let playedWords = [];
  let board = [["a","a","a","a"],["a","a","a","a"],["a","a","a","a"],["a","a","a","a"]];
  
  function makeBoard(){
    for(let i = 0; i < 4; i++){
      for(let z = 0; z < 4; z++){
        board[i][z] = alphabet[Math.floor(25*Math.random())];
        document.getElementById(`${i+1}${z+1}`).innerText = board[i][z];
      }
    }
  }
  
  function isAdjacent(letter1, letter2){
    let number1 = -1;
    let number2 = -1;

    for(let i = 0; i < 4; i++){
      for(let z = 0; z < 4; z++){
        if(board[i][z] == letter1){
          number1 = (i*10) + z;

          for(let j = Math.max(i-1, 0); j < Math.min(i+2,4); j++){
            for(let k = Math.max(z-1, 0); k < Math.min(z+2, 4); k++){
              if(j != i || k != z){
                if(board[j][k] == letter2){
                  return 1;
                }

              }

            }
          }

        }

      }
    }

    return 0;

  }

  function guessChecker(){
    let wordGuess = document.getElementById("guess").value;

    for(let i = 0; i < wordGuess.length - 1; i++){
      if(!isAdjacent(wordGuess[i], wordGuess[i+1])){
        alert("Invalid Submission");
        return;
      }
    }

    if(playedWords.includes(wordGuess)){
      alert("Already Submitted!");
      return;
    }
    else{
      playedWords.push(wordGuess);
    }

    myDatabase.ref("dictionary/0").child(wordGuess).on('value', ss=>{
      if(ss.val() && wordGuess.length > 2){
        $("#submission").append(`<li>${wordGuess}</li>`);
        score += wordGuess.length * 10;
        document.getElementById("score").innerText = `Score: ${score}pts`
      }
      else if(wordGuess.length < 3){
        alert("Submission must be 3 or more letter words!");
      }
      else{
        alert("Submission is not a valid dictionary word!");
      }
    })

  }

  function resetGame(){
    score = 0;
    document.getElementById("score").innerText = `Score: ${score}pts`
    document.getElementById("submission").innerText = "";
    playedWords.splice(0, playedWords.length);
    makeBoard();
    alert("Resetting game...");
  }
  
  makeBoard();
  document.getElementById("submit").addEventListener("click", guessChecker);
  document.getElementById("reset").addEventListener("click", resetGame);
}





document.addEventListener("DOMContentLoaded", function(event){
  var googleLogin = new firebase.auth.GoogleAuthProvider();
  document.getElementById("reset").style.display = "none";
  let playerID = localStorage.getItem("uuid");
  
  if(!playerID){
    uuid = `uuid-${Math.floor(10000000000*Math.random())}`;
    localStorage.setItem("uuid", playerID);
  }
  
  firebase.auth().onAuthStateChanged(user => {
    if(!!user){
      playerID = user.displayName.split(' ')[0];
      document.getElementById("user").innerText = playerID;
    }
  });
  
  document.getElementById("login").addEventListener("click", function(){
    document.getElementById("login").style.display = "none";
    firebase.auth().signInWithRedirect(googleLogin).catch(function(error){
      console.log(error.code);
      console.log(error.message);
      document.getElementById("login").style.display = "block";
    });
  });
  
  document.getElementById("startGame").addEventListener("click", function(){
    document.getElementById("login").style.display = "none";
    document.getElementById("startGame").style.display = "none";
    document.getElementById("reset").style.display = "block";
    var game = new userGame(playerID);
  })
  
});
