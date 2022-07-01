import {gql, useQuery} from '@apollo/client';
import { useContext, useState } from 'react';
import AppContext from './context';

const identifyRestaurant = (restaurant) => {
    const ctx = useContext(AppContext);
    const [restaurantID, setRestaurantID] = ctx.currentRestaurant.restaurantID;
    const [restaurantInfo, setRestaurantInfo] = ctx.currentRestaurant.restaurantInfo;
    const [banner, setBanner] = ctx.currentBanner;
    let theRestaurant;
    switch (restaurant) {
        case 'Chez%20Luca' :
            theRestaurant = 1;
            break;
        case 'Maison%20Aspen' :
            theRestaurant = 2;
            break;
        case 'Bistro%20Sookie' :
            theRestaurant = 3;
            break;
        case 'Cafe%20Mambo' :
            theRestaurant = 4;
            break;
        case 'Trattoria%20Simon' :
            theRestaurant = 5;
            break;
        case 'Sweet%20Woodruffs' :
            theRestaurant = 6;
            break;
        default :
            theRestaurant = 1;
            break;
    };

    const GET_RESTAURANT_DISHES = gql`
    query($id: ID!) {
        restaurant(id: $id) {
            id
            name
            description
            image {
              url
            }
            banner {
              url
            }
            address
            phone
            keywords
        }
    }
    `;
    const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
        variables: { id: theRestaurant},
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>ERROR here and now</p>;
    if (!data) return <p>Not found</p>;
    if (data) {
        let res = data.restaurant;
        return res;
    }

    let res = data.restaurant;

    setRestaurantID(res.id);
    setBanner(`http://localhost:1337` + res.banner.url);
    setRestaurantInfo({
        address: res.address,
        phone: res.phone             
    });

};

export default identifyRestaurant;