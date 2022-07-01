/*

[restaurant] page. Here we show individual restaurants and their dishes, which are searchable.

*/

import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, gql, useQuery } from '@apollo/client';
import { useContext, useState } from 'react';
import {useRouter} from 'next/router';
import Router from 'next/router';
import { InputGroup, InputGroupAddon,Input} from "reactstrap";
import DishesList from '../../components/dishesList';
import Cart from '../../components/cart';
import identifyRestaurant from '../../components/identifyRestaurant';
import AppContext from '../../components/context';
import Button from 'reactstrap/lib/Button';

// Bringing in the router
    // Then, when calling router.query.restaurant, the route specified
    // in the url will be shown.
    // This is why this file is in [], where the text in [] becomes the
    // variable after router.query
    

export default function Restaurant() {
  const router = useRouter()
  const ctx = useContext(AppContext);
  
  
  // If the context has been wiped, handle it gracefully

  
  
  if (ctx.currentRestaurant.restaurantInfo[0] == null) {
    
    return (
      <div>
        <h3>Uh oh ... Something went wrong ...</h3>
        <br/>
        <Button onClick={() => {
          Router.push('/');
        }}>
          Go Home
        </Button>
      </div>
    )
  }
  
  const theUrl = window.location.href;
  const restName = theUrl.substring(theUrl.lastIndexOf('/') + 1);
  console.log(restName);
    

    // Let's try to extract restaurant info
    const {address, phone} = ctx.currentRestaurant.restaurantInfo[0];
    console.log(address);
    console.log(phone);
    const bgbanner = ctx.currentBanner[0];
    // Apollo stuff
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    console.log(`URL: ${API_URL}`)
    const [query, setQuery] = useState("");
    const link = new HttpLink({ uri: `${API_URL}/graphql`})
    const cache = new InMemoryCache()
    const client = new ApolloClient({link,cache});
    
    return (
    
    <>
      <div className="search-box" style={{backgroundImage: `url("${bgbanner}")`}}>
        <div className="restaurant-info">
        {address}<br/>
        {phone}
        </div>
        <div className="search">  
          <h1>Welcome to {router.query.restaurant}</h1>
          <InputGroup>
                    <InputGroupAddon addonType="append"> Search </InputGroupAddon>
                    <Input
                        onChange={(e) =>
                        setQuery(e.target.value.toLocaleLowerCase())
                        }
                        value={query}
                        placeholder={`Find dishes from ${router.query.restaurant} by name, ingredient, or keyword ...`}
                    />
                    </InputGroup><br></br>
        </div>
      </div>
      <div className="restaurant-results">
        <DishesList search={query} />
        {(ctx.cart.items.length !== 0) && 
            <Cart> </Cart>
            }
      </div>
      </>
    
    )
  }