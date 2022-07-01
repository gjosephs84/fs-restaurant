import React, { useState, useContext } from "react";
import Cart from "../components/cart"
import {ApolloProvider,ApolloClient,HttpLink, InMemoryCache} from '@apollo/client';
import RestaurantList from '../components/restaurantList';
import { InputGroup, InputGroupAddon,Input} from "reactstrap";
import AppContext from "../components/context";


function Home() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    console.log(`URL: ${API_URL}`)
    const [query, setQuery] = useState("");
    const link = new HttpLink({ uri: `${API_URL}/graphql`})
    const cache = new InMemoryCache()
    const client = new ApolloClient({link,cache});
    const ctx = useContext(AppContext);
    console.log("Cart is: !!!!!!!!!!!!!!!!!!!")
    console.log(ctx.cart.items);

    // See if someone is logged in
    if (AppContext.user != null) {
        console.log("There's a person!");
        console.log(JSON.stringify(AppContext.user));
    } 
 
  /* 
  Here's the story of search:
    - No button to search. It's all live.
    - We are defining query, setQuery above here
    - Calling setQuery on change
    - Sending that to the RestaurantList component as the search prop

    Once we get to RestaurantList:
        - a let variable searchQuery is set to equal the retrieved restaurant
            data filtered by that which includes the value of the search prop
            referenced aboved.
        - or searchQuery can be an empty array.
        
        Once searchQuery is populated beyond the empty array (results found):
            - the constant restList becomes a map of the searchQuery array
            - resList generates columns with cards
            - Each card consists of a restaurant gleaned from the search results
    
    To componentize search in search.js, I need to ...
        - Start by writing everything to work in [restaurant].js
        - Look for places I can used a common passed variable
        - Refactor, refactor, refactor
  */
    return (
       <>
          <div className="search-box">
            <div className="search">
                <h2> What are you CRAVE-ing?</h2>
                    <InputGroup >
                    <InputGroupAddon addonType="append"> Search </InputGroupAddon>
                    <Input
                        onChange={(e) =>
                        setQuery(e.target.value.toLocaleLowerCase())
                        }
                        value={query}
                        placeholder="Find local restaurants by name, ingredients, cuisine, or keyword ..."
                    />
                    </InputGroup><br></br>
                </div>
            </div>
            <div className="restaurant-results">
            <RestaurantList search={query} />
            {(ctx.cart.items.length !== 0) && 
            <Cart> </Cart>
            }
            </div>
            </>
    );
  }
  export default Home;
  