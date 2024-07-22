# Step 1: Use an official Node base image
FROM node:20-bullseye-slim

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN yarn

# Step 5: Copy the rest of your application
COPY . .

# Optional: Build your React application for production
RUN yarn build

# Step 7: Expose the application's port
EXPOSE 3000

# Step 8: Specify the command to run your application
CMD ["yarn", "start"]