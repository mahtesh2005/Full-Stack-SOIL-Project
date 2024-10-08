const { gql } = require("apollo-server-express");
const db = require("../database");
 
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const REVIEW_ADDED = "REVIEW_ADDED";
const REVIEW_EDITED = 'REVIEW_EDITED';
const REVIEW_DELETED = 'REVIEW_DELETED';
 
const ORDER_ADDED = "REVIEW _ADDED"
 
 
const typeDefs = gql`
  type User {
    userID: Int,
    username: String,
    password_hash: String,
    email: String,
    isBlocked: Boolean
  }
 
  type Standard {
    itemID: Int!
    item_name: String!
    item_price: Float!
    category: String!
    item_image: String!
  }
 
  type Special {
    itemID: Int!
    item_name: String!
    original_price: Float!
    item_price: Float!
    category: String!
    item_image: String!
  }
 
  type Order {
    cartID: Int!
    userID: Int!
    itemID: Int!
    itemName: String!
    itemPrice: Float!
    itemQuantity: Int!
    totalPrice: Float!
  }
 
  input StandardInput {
    itemID: Int
    item_name: String
    item_price: Float
    category: String
    item_image: String
  }
 
  input SpecialInput {
    itemID: Int!
    item_name: String!
    original_price: Float!
    item_price: Float!
    category: String!
    item_image: String!
  }
 
  type Review {
    reviewID: Int,
    itemID: Int,
    username: String,
    description: String,
    stars: Int,
    isFlagged: Boolean,
    isDeleted: Boolean,
    item: Item
  }
 
  type Item {
    itemID: Int,
    item_name: String
  }
 
  input BlockUserInput {
    userID: Int!,
    isBlocked: Boolean!
  }
 
  type ProductRating {
    item: Item,
    averageRating: Float
  }
 
  type Query {
    users: [User]
    standardItems: [Standard!]!
    specialItems: [Special!]!
    reviewsByFlagged(isFlagged: Boolean, isDeleted: Boolean): [Review]
    reviews: [Review!]
    orders: [Order!]
    topRatedProducts: [ProductRating]
  }
 
  type Mutation {
    addStandardItem(input: StandardInput!): Standard!
    updateStandardItem(itemID: Int!, input: StandardInput!): Standard!
    deleteStandardItem(itemID: Int!): Boolean!
 
    addSpecialItem(input: SpecialInput!): Special!
    updateSpecialItem(itemID: Int!, input: SpecialInput!): Special!
    deleteSpecialItem(itemID: Int!): Boolean!
 
    blockUser(input: BlockUserInput): User
 
    add_Review(username: String!, itemID: Int!, description: String!, stars: Int!): Review!
    editReview(reviewID: Int!, description: String!, stars: Int!): Review!
    deleteReview(reviewID: Int!): Boolean!
    adminDeleteReview(reviewID: Int!): Boolean!
    flagReview(reviewID: Int!): Review
 
 
  }
 
 
  type Subscription {
    review_added: Review!
    review_edited: Review!
    review_deleted: Review!
    order_added: Order!
  }
`;
 
const resolvers = {
  Query: {
    users: async () => {
      return await db.user.findAll();
    },
    standardItems: async () => {
      return await db.standard.findAll();
    },
    specialItems: async () => {
      return await db.special.findAll();
    },
    orders: async () => {
      return await db.order.findAll();
    },
    reviews: async () => {
      return await db.review.findAll();
    },
    reviewsByFlagged: async (_, { isFlagged }) => {
      const whereClause = {
        isFlagged: isFlagged !== undefined ? isFlagged : false,
        isDeleted: false
      };
      const reviews = await db.review.findAll({ where: whereClause });
      return Promise.all(reviews.map(async (review) => {
        const item = await getItem(review.itemID);
        return {
          ...review.dataValues,
          item,
        };
      }));
    },
    topRatedProducts: async () => {
      const reviews = await db.review.findAll();
      const productRatings = {};
    
      for (const review of reviews) {
        if (!productRatings[review.itemID]) {
          productRatings[review.itemID] = {
            itemID: review.itemID,
            totalStars: 0,
            reviewCount: 0,
          };
        }
        productRatings[review.itemID].totalStars += review.stars;
        productRatings[review.itemID].reviewCount += 1;
      }
    
      const products = await Promise.all(Object.values(productRatings).map(async (product) => {
        const item = await getItem(product.itemID);
        
        // Calculate Bayesian average
        const BayesianAverage = (product.totalStars + 1) / (product.reviewCount + 2);
    
        // Ensuring BayesianAverage is a valid number
        return {
          item,
          averageRating: Number.isFinite(BayesianAverage) ? BayesianAverage : 0,
        };
      }));
    
      return products;
    },
  },
 
  Mutation: {
    addStandardItem: async (_, { input }) => {
      try {
        return await db.standard.create(input);
      } catch (error) {
        console.error("Error adding standard item:", error.message);
        throw new Error("Failed to add standard item");
      }
    },
    addSpecialItem: async (_, { input }) => {
      try {
        return await db.special.create(input);
      } catch (error) {
        console.error("Error adding special item:", error.message);
        throw new Error("Failed to add special item");
      }
    },
    updateStandardItem: async (_, { itemID, input }) => {
      try {
        const item = await db.standard.findOne({ where: { itemID } });
        if (!item) {
          throw new Error("Item not found");
        }
        await item.update(input);
        return item;
      } catch (error) {
        console.error("Error updating standard item:", error.message);
        throw new Error("Failed to update standard item");
      }
    },
    updateSpecialItem: async (_, { itemID, input }) => {
      try {
        const item = await db.special.findOne({ where: { itemID } });
        if (!item) {
          throw new Error("Item not found");
        }
        await item.update(input);
        return item;
      } catch (error) {
        console.error("Error updating special item:", error.message);
        throw new Error("Failed to update special item");
      }
    },
    deleteStandardItem: async (_, { itemID }) => {
      try {
        const result = await db.standard.destroy({ where: { itemID } });
        return result === 1;
      } catch (error) {
        console.error("Error deleting standard item:", error.message);
        throw new Error("Failed to delete standard item");
      }
    },
 
    deleteSpecialItem: async (_, { itemID }) => {
      try {
        const result = await db.special.destroy({ where: { itemID } });
        return result === 1;
      } catch (error) {
        console.error("Error deleting special item:", error.message);
        throw new Error("Failed to delete special item");
      }
    },
    blockUser: async (_, { input }) => {
      const { userID, isBlocked } = input;
 
      // Update the user's blocked status in the database
      const user = await db.user.findByPk(userID);
      if (user) {
        user.isBlocked = isBlocked;
        await user.save();
        return user;
      } else {
        throw new Error("User not found");
      }
    },
    flagReview: async (_, { reviewID }) => {
      try {
        const review = await db.review.findByPk(reviewID);
        if (!review) {
          throw new Error("Review not found");
        }
        review.isFlagged = true;
        await review.save();
        return review;
      } catch (error) {
        console.error("Error flagging review:", error.message);
        throw new Error("Failed to flag review");
      }
    },
    add_Review: async (_, {username, itemID, description, stars }) => {
      const review = await db.review.create({
        username,
        itemID,
        description,
        stars,
      });
      pubsub.publish(REVIEW_ADDED, { review_added: review });
      return review;
    },
    editReview: async (_, { reviewID, description, stars }) => {
      const review = await db.review.findByPk(reviewID);
      if (!review) throw new Error('Review not found');
      review.description = description;
      review.stars = stars;
      await review.save();
      pubsub.publish(REVIEW_EDITED, { review_edited: review });
      return review;
    },
    deleteReview: async (_, { reviewID }) => {
      try {
        const review = await db.review.findByPk(reviewID);
        if (!review) {
          throw new Error("Review not found");
        }
        await review.destroy();
        pubsub.publish(REVIEW_DELETED, { review_deleted: review });
        return true;
      } catch (error) {
        console.error("Error deleting review:", error.message);
        throw new Error("Failed to delete review");
      }
    },
    
    adminDeleteReview: async (_, { reviewID }) => {
      try {
        const review = await db.review.findByPk(reviewID);
        if (!review) {
          throw new Error("Review not found");
        }
        review.isDeleted = true;
        await review.save();
        pubsub.publish(REVIEW_DELETED, { review_deleted: review });
        return true;
      } catch (error) {
        console.error("Error deleting review:", error.message);
        throw new Error("Failed to delete review");
      }
    },
  },
  Subscription: {
    review_added: {
      subscribe: () => pubsub.asyncIterator(REVIEW_ADDED),
    },
    review_edited: {
      subscribe: () => pubsub.asyncIterator(REVIEW_EDITED),
    },
    review_deleted: {
      subscribe: () => pubsub.asyncIterator(REVIEW_DELETED),
    },
    order_added: {
      subscribe: () => pubsub.asyncIterator(ORDER_ADDED),
    },
  }
};
async function getItem(itemID) {
  let item = await db.standard.findOne({ where: { itemID } });
  if (!item) {
    item = await db.special.findOne({ where: { itemID } });
  }
  return item;
}
 
 
module.exports = {
  typeDefs,
  resolvers
};
 