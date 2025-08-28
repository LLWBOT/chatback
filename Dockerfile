# Use the official Node.js image as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (even if it's empty)
# This is a crucial step for caching and speeding up future builds
COPY package*.json ./

# Install application dependencies
# The --omit=dev flag ensures dev dependencies are not installed in the final image
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
