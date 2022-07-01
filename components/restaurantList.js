import { gql, useQuery } from '@apollo/client';
import { useContext, useState } from 'react';
import Router from "next/router";


import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Row,
  Col
} from "reactstrap";

function RestaurantList(props) {
  // Get the context to update the restaurant ID
  const ctx = useContext(AppContext);
  // Grab the state variables from the context
  const [restaurantID, setRestaurantID] = ctx.currentRestaurant.restaurantID;
  const [restaurantInfo, setRestaurantInfo] = ctx.currentRestaurant.restaurantInfo;
  const [banner, setBanner] = ctx.currentBanner;
  const { cart } = useContext(AppContext);
  
 
  const [state, setState] = useState(cart)
  // Query to get restaurant data
  const GET_RESTAURANTS = gql`
    query {
      restaurants {
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
  const { loading, error, data } = useQuery(GET_RESTAURANTS)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;
  console.log(`Query Data: ${JSON.stringify(data.restaurants)}`)

// Take that query data and filter it!

  let searchQuery = data.restaurants.filter((res) => {
    let foundRestaurant = null;
    if (
      (res.name.toLowerCase().includes(props.search))
      ||
      (res.keywords.toLowerCase().includes(props.search))
    ) {
      foundRestaurant = res.name;
    }
    return foundRestaurant;
  }) || [];

  let restId = searchQuery[0] ? searchQuery[0].id : null;

  // Return some search results!

  if (searchQuery.length > 0) {
    const restList = searchQuery.map((res) => (
      <Col xs="6" sm="4" key={res.id}>
        <Card className="restaurant-card">
          <CardImg
            top={true}
            
            src={
              `http://localhost:1337` + res.image[0].url
            }
          />
          <CardBody>
            <CardText>{res.description}</CardText>
          </CardBody>
          <div className="card-footer">
            

            <Button className="button-full" color="info" onClick={() => {
              setRestaurantID(res.id);
              setBanner(`http://localhost:1337` + res.banner[0].url);
              setRestaurantInfo({
                  address: res.address,
                  phone: res.phone             
                });
              const url = "/restaurants/" + res.name;
              Router.push("restaurants/[restaurant]", url);
            }}>{res.name}</Button>

          </div>
        </Card>
      </Col>
    ))

    return (

      <Container>
        <Row xs='3'>
          {restList}
        </Row>
        {/* 
        <Row xs='3'>
          {renderDishes(restaurantID)}
        </Row>
        */}
      </Container>

    )
  } else {
    return <h1> No Restaurants Found</h1>
  }
}
export default RestaurantList