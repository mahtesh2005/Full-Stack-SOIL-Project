import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { ResponsiveBar } from '@nivo/bar';

const TOP_RATED_PRODUCTS_QUERY = gql`
  query GetTopRatedProducts {
    topRatedProducts {
      item {
        itemID
        item_name
      }
      averageRating
    }
  }
`;

const TopRatedProductsChart = ({ reviews }) => {
  const {data, refetch } = useQuery(TOP_RATED_PRODUCTS_QUERY);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data) {
      const transformedData = data.topRatedProducts.map(product => ({
        itemName: product.item.item_name,
        averageRating: calculateAverageRating(product.item.itemID, reviews),
      }));
      setChartData(transformedData);
    }
  }, [data, reviews]);

  useEffect(() => {
    refetch();
  }, [reviews, refetch]);

  const calculateAverageRating = (itemID, reviews) => {
    const relevantReviews = reviews.filter(review => review.itemID === itemID);
    const totalStars = relevantReviews.reduce((total, review) => total + review.stars, 0);
    const averageRating = totalStars / relevantReviews.length;
    return isNaN(averageRating) ? 0 : averageRating;
  };

  return (
    <div className="BarChart">
      <h2>Top Rated Products</h2>
      <div className="chart-container">
        <ResponsiveBar
          data={chartData}
          keys={['averageRating']}
          indexBy="itemName"
          margin={{ top: 50, right: 170, bottom: 50, left: 100 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Product Name',
            legendPosition: 'middle',
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Average Rating',
            legendPosition: 'middle',
            legendOffset: -60,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 160,
              translateY: 0,
              itemsSpacing: 30,
              itemWidth: 150,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
};

export default TopRatedProductsChart;
