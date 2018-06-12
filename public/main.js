function transition(isOnLogin) {
  if(isOnLogin)
    document.getElementById("loginOverlay").style.marginLeft = "-100%";
  else 
    document.getElementById("loginOverlay").style.marginLeft = "0";
}

function login() {
  var username = document.getElementById("loginUsernameInput").value,
  pass = document.getElementById("loginPasswordInput").value;

  if( username ) {
    if(pass) {
      $.post("http://141.126.155.58:7777/login/",{username: username , password: pass}, function (data) {
        if(data.status == "success") {
          alert("You logged in and got your key, it's: " + data.key);
        }
        else  {
          alert("Incorrect login details");
        }
      });
    }
    else {
      alert("You must enter a password!");
    }
  }
  else {
    alert("Your username cannot be blank!");
  }
}

function register() {
  var username = document.getElementById("registerUsernameInput").value,
      pass1 = document.getElementById("registerPassword1Input").value,
      pass2 = document.getElementById("registerPassword2Input").value;

  if( username ) {
    if(pass1 == pass2) {
      $.post("http://141.126.155.58:7777/register/",{username: username , password: pass1}, function (data) {
        alert("Your account has been registered successfully, your user's key is: " + data.key + ", try logging in!");
      });
    }
    else {
      alert("Passwords do not match!");
    }
  }
  else {
    alert("Your username cannot be blank!");
  }
  
}