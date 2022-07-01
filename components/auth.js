/* /lib/auth.js */

import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";
import AppContext from "./context";
import { useState, useContext } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMXjZzqkTpbXxKTJUL8eAJhLknXLmpDuw",
  authDomain: "full-stack-restaurant-34899.firebaseapp.com",
  projectId: "full-stack-restaurant-34899",
  storageBucket: "full-stack-restaurant-34899.appspot.com",
  messagingSenderId: "349749740531",
  appId: "1:349749740531:web:4f3f987e74fe3738afc886",
  measurementId: "G-TV0SBJF0DG"
};

// Initialize Firebase
const fireb = initializeApp(firebaseConfig);
//const analytics = getAnalytics(fireb);
//const auth = getAuth(fireb);
const provider = new GoogleAuthProvider();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

//Firebase sign-in I hope!!!!
export async function fireBaseSignIn() {
  const auth = getAuth(fireb);
  console.log("It's been clicked");
  const result = await signInWithPopup(auth, provider)
  .then(
    (result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const fbuser = result.user.displayName;
    console.log('user is:');
    console.log(fbuser);
    console.log(`result.user is ${JSON.stringify(result.user)}`);
    return result.user;
    // ...
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
  console.log(`result is ${result}`);
  var currentuser = auth.currentUser.displayName;
  console.log(`Current User is ${currentuser}`);
  return result;
};

// Firebase signout
export function fireBaseSignOut() {
  const auth = getAuth(fireb);
  signOut(auth);
}

// Firebase signup

export async function fireBaseSignUp() {
  const auth = getAuth(fireb);
  const result = await signInWithPopup(auth, provider)
  .then(
    (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const uName = result.user.displayName;
      const uEmail = result.user.email;
      const uPass = "12345678";
      const userInfo = {
        userName: uName,
        userEmail: uEmail,
        userPassword: uPass
      };
      return userInfo;
    }
  ).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  return result;
}



//register a new user
export const registerUser = (username, email, password) => {
  console.log(`The data coming in is: ${username}`);
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/register`, { username, email, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
        alert("Oops! Something went wrong. The account you are trying to create may already exist. Try logging in instead.")
      });
  });
};

export const login = (identifier, password) => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/`, { identifier, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        //redirect back to home page for restaurance selection
        //Router.push("/");
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const logout = () => {
  // Firebase signout
  const fireBaseSignOut = () => {
  const auth = getAuth(fireb);
  signOut(auth);
}
  // Call the firebase signout in case of fb login
  fireBaseSignOut();
  //remove token and user cookie
  Cookie.remove("token");
  delete window.__user;
  // sync logout between multiple windows
  window.localStorage.setItem("logout", Date.now());
  //redirect to the home page
  Router.push("/");
};

//Higher Order Component to wrap our pages and logout simultaneously logged in tabs
// THIS IS NOT USED in the tutorial, only provided if you wanted to implement
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};
