
import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import StoreContextProvider, { StoreContext } from '../Components/StoreContext';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios
const mock = new MockAdapter(axios);

// Mock item data
const mockItem = {
  itemID: '123',
  itemName: 'Test Fruit',
  itemPrice: 10,
  itemQuantity: 1,
  totalPrice: 10
};

test('addToCart adds an item to the cart and updates state', async () => {
  localStorage.setItem('userID', 'testUser');

  mock.onGet('http://localhost:4000/api/standards/fruits').reply(200, [mockItem]);
  mock.onPost('http://localhost:4000/api/shops/add').reply(200, mockItem);

  let contextValue;
  await act(async () => {
    render(
      <StoreContextProvider>
        <StoreContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </StoreContext.Consumer>
      </StoreContextProvider>
    );
  });

  await act(async () => {
    await contextValue.addToCart('123', 'testUser');
  });

  await waitFor(() => {
    expect(contextValue.cartItems).toHaveProperty('123');
    expect(contextValue.cartItems['123'].itemName).toBe('Test Fruit');
    expect(contextValue.cartItems['123'].itemQuantity).toBe(1);
  });
});


// Test 2: Test for removeFromCart function
test('removeFromCart removes an item from the cart or decreases its quantity', async () => {
    localStorage.setItem('userID', 'testUser');
  
    const initialCartState = {
      '123': { ...mockItem, itemQuantity: 2, totalPrice: 20 }
    };
  
    let contextValue;
    render(
      <StoreContextProvider>
        <StoreContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </StoreContext.Consumer>
      </StoreContextProvider>
    );
  
    await act(async () => {
      contextValue.setCartItems(initialCartState);
    });
  
    mock.onPost('http://localhost:4000/api/shops/remove').reply(200);
  
    await act(async () => {
      await contextValue.removeFromCart('123');
    });
  
    expect(contextValue.cartItems['123'].itemQuantity).toBe(1);
    expect(contextValue.cartItems['123'].totalPrice).toBe(10);
  
    await act(async () => {
      await contextValue.removeFromCart('123');
    });
  
    expect(contextValue.cartItems).not.toHaveProperty('123');
  });
  

// Test 3: Test for getTotalCartAmount function
test('getTotalCartAmount calculates the total cost of items in the cart', () => {
    const cartState = {
      '123': { ...mockItem, itemQuantity: 2, totalPrice: 20 },
      '456': { itemID: '456', itemName: 'Test Vegetable', itemPrice: 5, itemQuantity: 3, totalPrice: 15 }
    };
  
    let contextValue;
    render(
      <StoreContextProvider>
        <StoreContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </StoreContext.Consumer>
      </StoreContextProvider>
    );
  
    act(() => {
      contextValue.setCartItems(cartState);
    });
  
    const totalAmount = contextValue.getTotalCartAmount();
    expect(totalAmount).toBe(35); // 20 (Test Fruit) + 15 (Test Vegetable)
  });
  
