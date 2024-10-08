
import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { ResponsivePie } from '@nivo/pie'; // Importing the ResponsivePie chart component from Nivo.
import { getOrders } from '../components/Data/repository'; // Importing a custom function to get orders data.
import client from '../apollo/client'; // Importing the Apollo client instance.
import './MyResponsivePie.css'; // Importing the CSS file for styling the pie chart.

// Defining the GraphQL query to fetch the top ordered items.
const TOP_ORDERED_ITEMS_QUERY = gql`
  query GetTopOrderedItems {
    orders {
      itemName
      itemQuantity
    }
  }
`;

// Functional component to display the responsive pie chart.
const MyResponsivePie = () => {
  // Using the useQuery hook to execute the GraphQL query and handle its state.
  const { loading, error, data, refetch } = useQuery(TOP_ORDERED_ITEMS_QUERY);
  const [chartData, setChartData] = useState([]); // Initializing state to hold the chart data.

  // useEffect hook to update the chart data when the query data changes.
  useEffect(() => {
    if (data) {
      updateChartData(data.orders); // Updating the chart data with the fetched orders.
    }
  }, [data]);

  // useEffect hook to fetch orders data on component mount.
  useEffect(() => {
    async function fetchOrders() {
      try {
        const ordersData = await getOrders(); // Fetching orders data using the custom function.
        updateChartData(ordersData); // Updating the chart data with the fetched orders.
      } catch (error) {
        console.error('Error fetching orders:', error); // Logging any errors that occur during the fetch.
      }
    }

    fetchOrders(); // Calling the fetchOrders function.
  }, []);

  // useEffect hook to refetch the query data when the component re-renders.
  useEffect(() => {
    refetch(); // Refetching the query data.
  }, [refetch]);

  // Function to update the chart data based on the orders data.
  const updateChartData = (orders) => {
    const orderQuantities = orders.reduce((acc, order) => {
      const existingOrder = acc.find((item) => item.id === order.itemName); // Checking if the order item already exists in the accumulated data.
      if (existingOrder) {
        existingOrder.value += order.itemQuantity; // Incrementing the quantity if the item exists.
      } else {
        acc.push({ id: order.itemName, value: order.itemQuantity }); // Adding a new item to the accumulated data if it doesn't exist.
      }
      return acc;
    }, []);
    setChartData(orderQuantities); // Setting the chart data state with the accumulated data.
  };

  // Conditional rendering based on the loading and error states.
  if (loading) return <p>Loading...</p>; // Displaying a loading message if the query is still loading.
  if (error) return <p>Error: {error.message}</p>; // Displaying an error message if there is an error with the query.


  return (
    <div className="PieChart">
      <h2>Top Ordered Items</h2>
      <div className="chart-container">
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#ffffff"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          defs={[
            { id: 'dots', type: 'patternDots', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', size: 4, padding: 1, stagger: true },
            { id: 'lines', type: 'patternLines', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', rotation: -45, lineWidth: 6, spacing: 10 },
          ]}
          fill={[
            { match: { id: 'ruby' }, id: 'dots' },
            { match: { id: 'c' }, id: 'dots' },
            { match: { id: 'go' }, id: 'dots' },
            { match: { id: 'python' }, id: 'dots' },
            { match: { id: 'scala' }, id: 'lines' },
            { match: { id: 'lisp' }, id: 'lines' },
            { match: { id: 'elixir' }, id: 'lines' },
            { match: { id: 'javascript' }, id: 'lines' },
          ]}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [{ on: 'hover', style: { itemTextColor: '#fff' } }],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default MyResponsivePie;
