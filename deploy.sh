#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables from .env.production if it exists
if [ -f .env.production ]; then
  echo -e "${YELLOW}Loading environment variables from .env.production...${NC}"
  export $(grep -v '^#' .env.production | xargs)
fi

echo -e "${GREEN}Starting deployment of CodeCast...${NC}"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}
npm ci

# Build the application
echo -e "${YELLOW}Building the application...${NC}
npm run build

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is not installed. Please install Docker to continue.${NC}"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}docker-compose is not installed. Please install Docker Compose to continue.${NC}"
    exit 1
fi

# Stop and remove existing containers if they exist
echo -e "${YELLOW}Stopping and removing existing containers...${NC}
docker-compose down || true

# Build and start the containers
echo -e "${YELLOW}Building and starting containers...${NC}
docker-compose up -d --build

echo -e "${GREEN}Deployment completed successfully!${NC}
echo -e "${GREEN}The application should now be running at http://localhost${NC}"

echo -e "\n${YELLOW}To view logs, run:${NC} docker-compose logs -f"
echo -e "${YELLOW}To stop the application, run:${NC} docker-compose down"

# Make the script executable
chmod +x deploy.sh
