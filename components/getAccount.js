import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, gql, useQuery } from '@apollo/client';
import { useStripe } from '@stripe/react-stripe-js';
import { useContext } from 'react';
import AppContext from './context';

const GetAccount = () => {
    
    
    // Get the context to determine the user id
    const ctx = useContext(AppContext);
    console.log(JSON.stringify(ctx.user[0].id));
    const userID = ctx.user[0].id;
    // Set up the GraphQL query
    const GET_USER_ORDERS = gql`
    query($id: ID!) {
        user(id: $id) {
        username
        orders {
            dishes
            amount
        }
        }
    }
    `;

    // Let's get that order info!!!!
    const { loading, error, data } = useQuery(GET_USER_ORDERS, {
        variables: { id: userID}
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>ERROR here</p>;
    if (!data) return <p>Not found</p>;

    let user = data.user;

    return (
        
        <div>
        <h1>Welcome {user.username}</h1>
        <h3>Your order history is as follows:</h3>
        
        {
            user.orders.map((order, index) => {
                return (
                    <div className="order-history" key={index}>
                        <h2 className="order-number">Order {index +1}</h2>
                    {
                    order.dishes.map((dish, index) => {
                        return (
                            <div className="order-details"key={index}>
                                <h4 className="dish-name">{dish.name}</h4>
                                <div className="align-right">${dish.price}</div>
                                <div className="dish-description">{dish.description}</div>
                            </div>
                        )
                    })
                    }
                    </div>
                )
            })
        }
        
        
        </div>
       
    );

};

export default GetAccount;
