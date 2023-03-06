const { GraphQLError } = require("graphql");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).select('-__v -password').populate('books');
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    }
  },

  Mutation: {
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new GraphQLError("No profile with this email found!", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new GraphQLError("Incorrect password!", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );

        return updatedUser
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    },
  },
};

module.exports = resolvers;