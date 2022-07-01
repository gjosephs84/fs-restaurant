/* /components/Layout.js */

import React, { useState, useContext } from "react";
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import Head from "next/head";
import Link from "next/link";
import { Container, Nav, NavItem } from "reactstrap";
import AppContext from "./context";


const Layout = (props) => {
const title = "CRAVE - Local Food on Order";
const {user} = useContext(AppContext);
const [userState, setUserState] = user;

// Apollo stuff
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
console.log(`URL: ${API_URL}`)
const [query, setQuery] = useState("");
const link = new HttpLink({ uri: `${API_URL}/graphql`})
const cache = new InMemoryCache()
const client = new ApolloClient({link,cache});
  return (
    <ApolloProvider client={client}>
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
        <script src="https://js.stripe.com/v3" />
      </Head>
      <header>
        <style jsx>
          {`
            a {
              color: white;
            }
            h5 {
              color: white;
              padding-top: 11px;
            }
          `}
        </style>
        <Nav className="navbar navbar-dark bg-dark">
          <NavItem>
            <Link href="/">
              <a className="navbar-brand">Home</a>
            </Link>
          </NavItem>
          <NavItem className="ml-auto">
            {user[0].username ? (
              <Link href="/account">
                <a>
              Welcome {user[0].username} {`(view account)`}
              </a>
              </Link>
            ) : (
              <Link href="/register">
                <a className="nav-link"> Sign up</a>
              </Link>
            )}
          </NavItem>
          <NavItem>
            {user[0].username ? (
              <Link href="/">
                <a
                  className="nav-link"
                  onClick={() => {
                    logout();
                    setUserState({username:null});
                  }}
                >
                  Logout
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="nav-link">Sign in</a>
              </Link>
            )}
          </NavItem>
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
    </ApolloProvider>
  );
};

export default Layout;