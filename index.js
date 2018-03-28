const { GraphQLServer, PubSub } = require("graphql-yoga");
const fetch = require("node-fetch");

const typeDefs = `
  type Query {
    getNums: [Int!]!
  }

  type Mutation {
    addNum: Boolean
  }

  type Subscription {
    newNum: Int!
  }
`;

let score = 4;
const nums = [0, 1, 2, 3];
const pubsub = new PubSub();

const NEW_NUM = "NEW_NUM";

const resolvers = {
  Query: {
    getNums: () => nums
  },
  Mutation: {
    addNum: () => {
      nums.push(score);
      pubsub.publish(NEW_NUM, { newNum: score });
      score += 1;
      return nums;
    }
  },
  Subscription: {
    newNum: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_NUM);
      }
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
