/* /pages/register.js */

import React, { useState, useContext } from "react";
import validate from "../components/validate";
import { fireBaseSignUp } from "../components/auth";

// importing the router to be able to conditionally show success message

import Router from "next/router";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { registerUser } from "../components/auth";
import AppContext from "../components/context";

const Register = () => {
  const [data, setData] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  // Show allows the form to be conditional
  const [show, setShow] = useState(true);

  // Validation variables
  const [userNameMessage, setUserNameMessage] = useState(null);
  const [emailMessage, setEmailMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [shouldEnable, setShouldEnable] = useState(false);
  const appContext = useContext(AppContext);

  // Grabbing the useState function setUser from the context
  const [user, setUser] = appContext.user;

  // A function to check whether the submit button should be enabled
  const checkEnable = () => {
    if (((data.username.length > 0) && (data.email.length > 0)) && (data.password.length > 0)) {
      if (((emailMessage == null) && (passwordMessage == null)) && (userNameMessage == null)) {
        setShouldEnable(true);
        return; 
      };
    };
    setShouldEnable(false);
    return;
  }


  // a variable to catch the name of the newly registered user
 const [newUser, setNewUser] = useState("");

  return (
    <>
    <div className="page-header">
      <div className="header-text">
        <h2>You're clicks away from all you've been CRAVE-ing ...</h2>
      </div>
    </div>
    <Container
      className="below-header">
      <Row>
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className="paper">
            <div className="card-head">
              <h2>Create Account</h2>
            </div>
            <section className="wrapper">
              {Object.entries(error).length !== 0 &&
                error.constructor === Object &&
                error.message.map((error) => {
                  return (
                    <div
                      key={error.messages[0].id}
                      style={{ marginBottom: 10 }}
                    >
                      <small style={{ color: "red" }}>
                        {error.messages[0].message}
                      </small>
                    </div>
                  );
                })}
              { show ? (
                <Form>
                <fieldset disabled={loading}>
                  <FormGroup>
                    <Label>Username:</Label>
                    <Input
                      disabled={loading}
                      onChange={(e) => {
                        setData({ ...data, username: e.target.value });
                        setUserNameMessage(validate(e.target.value, "username"));
                        checkEnable();
                      }}
                      value={data.username}
                      type="text"
                      name="username"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                    {userNameMessage && 
                      <h5>{userNameMessage}</h5>}
                  </FormGroup>
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      onChange={(e) => {
                        setData({ ...data, email: e.target.value });
                        setEmailMessage(validate(e.target.value, "email"));
                        checkEnable();
                      }}
                      value={data.email}
                      type="email"
                      name="email"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                    {emailMessage && 
                      <h5>{emailMessage}</h5>}
                  </FormGroup>
                  <FormGroup style={{ marginBottom: 30 }}>
                    <Label>Password:</Label>
                    <Input
                      onChange={(e) => {
                        setData({ ...data, password: e.target.value });
                        setPasswordMessage(validate(e.target.value, "password"));
                        checkEnable();
                      }}
                      value={data.password}
                      type="password"
                      name="password"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                    {passwordMessage && 
                      <h5>{passwordMessage}</h5>}
                  </FormGroup>
                  <FormGroup>
                    <Button
                      className="button-full"
                      disabled={!shouldEnable}
                      onClick={() => {
                        setLoading(true);
                        registerUser(data.username, data.email, data.password)
                          .then((res) => {
                            // set authed user in global context object
                            setUser(res.data.user);
                            appContext.isAuthenticated = true;
                            setLoading(false);
                            // Set the name of the new user
                            setNewUser(res.data.user.username);
                            // Hide all of this and show success message
                            setShow(false);
                          })
                          .catch((error) => {
                            console.log(`error in register: ${error}`)
                            //setError(error.response.data);
                            setLoading(false);
                          });
                      }}
                    >
                      {loading ? "Loading..." : "Submit"}
                    </Button>
                    <br/><br/>
                    <Button 
                      className="button-full"
                      onClick={() => {
                      setLoading(true);
                      fireBaseSignUp()
                      .then(
                          (res) => {
                            const fbUser = res;
                            console.log(' within the then fbuser is:');
                            console.log(JSON.stringify(fbUser));
                            registerUser(fbUser.userName, fbUser.userEmail, fbUser.userPassword)
                            .then((res) => {
                              // set authed user in global context object
                              setUser(res.data.user);
                              appContext.isAuthenticated = true;
                              setLoading(false);
                              // Set the name of the new user
                              setNewUser(res.data.user.username);
                              // Hide all of this and show success message
                              setShow(false);
                            })
                            .catch((error) => {
                              console.log(`error in register: ${error}`)
                              //setError(error.response.data);
                              setLoading(false);
                            });
                          }
                        );
                    }
                    }>Sign Up with Google</Button>
                  </FormGroup>
                </fieldset>
              </Form>
              ):(
                <div>
                  {console.log(`appContext.isAuthenticated is ${appContext.isAuthenticated}`)}
                  {console.log(`now newUser is ${newUser}`)}
                  {console.log(`appContext user is ${JSON.stringify(appContext.user)}`)}
                  {console.log(`AppContext user is ${AppContext.user}`)}
                  <h2>Welcome {newUser}!</h2>
                  <h5>Your account was successfully created.</h5>
                  <br/>
                  <Button
                    className="button-full"
                    onClick={() => Router.push("/")}
                  >
                    Start Ordering!
                  </Button> 
                </div>
              )}
              
            </section>
          </div>
          
        </Col>
      </Row>
      
      
      
      <style jsx>
        {`
          .paper {
            border: 1px solid lightgray;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.14),
              0px 2px 1px -1px rgba(0, 0, 0, 0.12);
            border-radius: 6px;
            margin-top: 90px;
          }
          .notification {
            color: #ab003c;
          }
          .header {
            width: 100%;
            height: 120px;
            background-color: #2196f3;
            margin-bottom: 30px;
            border-radius-top: 6px;
          }
          .wrapper {
            padding: 10px 30px 20px 30px !important;
          }
          a {
            color: blue !important;
          }
          img {
            margin: 15px 30px 10px 50px;
          }
        `}
      </style>
    </Container>
    </>
  );
};
export default Register;
