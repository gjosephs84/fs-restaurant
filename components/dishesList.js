import { gql, useQuery } from '@apollo/client';
import Dishes from "./dishes"
import { useContext, useState } from 'react';
import Router from "next/router";
import Link from 'next/link';


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

function DishesList(props) {
  // Get the context to update the restaurant ID
  const ctx = useContext(AppContext);
  const currentRest = ctx.currentRestaurant.restaurantID[0];
  // Grab the state variables from the context
  // const [restaurantID, setRestaurantID] = ctx.currentRestaurant;
   const { cart, addItem, removeItem } = useContext(AppContext);
  
 
   const [state, setState] = useState(cart)
  // Query to get restaurant data
  const GET_RESTAURANT_DISHES = gql`
  query($id: ID!) {
    restaurant(id: $id) {
      id
      name
      dishes {
        id
        name
        description
        price
        image {
          url
        }
        keywords
      }
    }
  }
`;
const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: currentRest},
  });

  if (loading) return <p>Loading Dishes...</p>;
  if (error) return <p>ERROR here and now</p>;
  if (!data) return <p>Not found</p>;

  let restaurant = data.restaurant;

// Take that query data and filter it!

  let searchQuery = restaurant.dishes.filter((dish) => {
    let foundDish = null;
    if ((dish.name.toLowerCase().includes(props.search))
    ||
    (dish.keywords.toLowerCase().includes(props.search))
    ) {
      foundDish = dish.name;
    };

    return foundDish;
  }) || [];

  let dishId = searchQuery[0] ? searchQuery[0].id : null;

  // Return some search results!

  if (searchQuery.length > 0) {
    const dishList = searchQuery.map((dish) => (
        <Col xs="6" sm="4" style={{ padding: 0 }} key={dish.id}>
        <Card style={{ margin: "0 10px" }}>
          <CardImg
            top={true}
           
            src={`http://localhost:1337${dish.image[0].url}`}
          />
          <CardBody>
            <div className="dish-header">
            {dish.name}
            <div className="align-right">${dish.price}</div>
            </div>
            <CardText>{dish.description}</CardText>
          </CardBody>
          <div className="card-footer">
            <Button color="info"
              outline
              onClick = {()=> addItem(dish)}
            >
              + Add To Cart
            </Button>
            
          </div>
        </Card>
      </Col>
    ))

    return (

      <Container>
        <Row xs='3'>
          {dishList}
        </Row>

      </Container>

    )
  } else {
    return <h1> No Dishes Found</h1>
  }
}
export default DishesList