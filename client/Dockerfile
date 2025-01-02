# Stage 1: Builder
FROM node:20.14.0 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Add build argument for GitHub Token
ARG GITHUB_TOKEN

# Configure npm to use GitHub's npm registry with authentication
RUN echo "@mngaminhhh:registry=https://npm.pkg.github.com/" >> .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20.14.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from builder
COPY --from=builder /usr/src/app/package*.json ./

# Copy the built Next.js application
COPY --from=builder /usr/src/app/.next ./.next

# Copy the public assets
COPY --from=builder /usr/src/app/public ./public

# Add build argument for GitHub Token (if needed for production dependencies)
ARG GITHUB_TOKEN

# Configure npm to use GitHub's npm registry with authentication for production install
RUN echo "@mngaminhhh:registry=https://npm.pkg.github.com/" >> .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

# Install only production dependencies
RUN npm install --only=production

# Set environment to production
ENV NODE_ENV=production

# Expose the desired port
EXPOSE 3008

# Start the application
CMD ["npm", "start"]
