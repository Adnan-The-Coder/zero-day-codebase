FROM node:22.17.0-bullseye

# Install pnpm globally
RUN npm install -g pnpm@10.13.1

# Set working dir
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build step
RUN pnpm run build

# Default CMD for debugging (not needed in CI)
CMD ["pnpm", "start"]
