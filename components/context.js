/* /context/AppContext.js */

import React from "react";
// create auth context with default value
// setUser:()=>{}
// set backup default for isAuthenticated if none is provided in Provider
 const AppContext = React.createContext(
    {isAuthenticated:true, 
        cart: {items:[], 
        total:0},
        addItem:()=>{},
        removeItem:()=>{},
        clearCart:()=>{},
        user:null,
        currentRestaurant:null 
        
    });



// const AppContext = React.createContext({ isAuthenticated: false });
export default AppContext;