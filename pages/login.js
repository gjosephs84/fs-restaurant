/* /pages/login.js */

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
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
import { login, fireBaseSignIn } from "../components/auth";
import AppContext from "../components/context";
import validate from "../components/validate";

function Login(props) {
  const [data, updateData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  // Show allows the form to be conditional
  const [show, setShow] = useState(true);
  const appContext = useContext(AppContext);
  // Grabbing the useState function setUser from the context
  const [user, setUser] = appContext.user;
  // To catch the name of the logged in user in case context doesn't
  // update fast enough
  const [newUser, setNewUser] = useState("");

  // Validation variables
  const [emailMessage, setEmailMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [shouldEnable, setShouldEnable] = useState(false);

  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push("/"); // redirect if you're already logged in
    }
  }, []);

  const checkEnable = () => {
    if ((data.identifier.length > 0) && (data.password.length > 0)) {
      if ((emailMessage == null) && (passwordMessage == null)) {
        setShouldEnable(true);
        return;
      };
    };
    setShouldEnable(false);
    return;
  }

  function onChange(event, setMessage) {
    updateData({ ...data, [event.target.name]: event.target.value });
    setMessage(validate(event.target.value, event.target.name));
    checkEnable();
  }

  return (
    <>
    <div className="page-header">
      <div className="header-text">
        <h2>Welcome back. The food you're CRAVE-ing is waiting ...</h2>
      </div>
    </div>
    <Container
      className="below-header">
      <Row>
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className="paper">
            <div className="card-head">
              <h2>Log In</h2>
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
                    <Label>Email:</Label>
                    <Input
                      onChange={(event) => onChange(event, setEmailMessage)}
                      name="identifier"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                    {emailMessage && 
                      <h5>{emailMessage}</h5>}
                  </FormGroup>
                  <FormGroup style={{ marginBottom: 30 }}>
                    <Label>Password:</Label>
                    <Input
                      onChange={(event) => onChange(event, setPasswordMessage)}
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
                        login(data.identifier, data.password)
                          .then((res) => {
                            setLoading(false);
                            // set authed User in global context to update header/app state
                            setUser(res.data.user);
                            setNewUser(res.data.user.username);
                            // Hide all this and show success message
                            setShow(false);
                          })
                          .catch((error) => {
                            console.log(`error in login: ${error}`)
                            //setError(error.response.data);
                            setLoading(false);
                          });
                      }}
                    >
                      {loading ? "Loading... " : "Submit"}
                    </Button>
                    <br/><br/>
                    <Button 
                      className="button-full"
                      onClick={() => {
                        fireBaseSignIn()
                        .then(
                            (res) => {
                              const fbUser = res;
                              console.log(' within the then fbuser is:');
                              console.log(JSON.stringify(fbUser));
                              login(fbUser.displayName, "12345678")
                              .then((res) => {
                                setLoading(false);
                                // set authed User in global context to update header/app state
                                setUser(res.data.user);
                                setNewUser(res.data.user.username);
                                // Hide all this and show success message
                                setShow(false);
                              })
                              .catch((error) => {
                                console.log(`error in login: ${error}`)
                                //setError(error.response.data);
                                setLoading(false);
                              });
                            }
                          );     
                        }
                      }>Sign in with Google
                    </Button>
                  </FormGroup>
                </fieldset>
              </Form>
              ):(
                <div>
                  <h3>Welcome {newUser}!</h3>
                  <h5>You have successfully logged in.</h5>
                  <br/>
                  <Button
                    className="button-full"
                    onClick={() => router.push("/")}
                  >
                    Start Ordering!
                  </Button> 
                  <br/><br/>
                  <Button
                    className="button-full"
                    onClick={() => router.push("/account")}
                  >
                    View Account
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
}

export default Login;
