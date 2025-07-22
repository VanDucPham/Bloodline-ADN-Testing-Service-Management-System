#!/bin/bash

# Deploy Scripts for Bloodline ADN Testing Service Frontend
# Usage: ./deploy-scripts.sh [platform]

set -e

PLATFORM=${1:-"vercel"}
PROJECT_DIR="my-react-app"

echo "🚀 Starting deployment to $PLATFORM..."

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Error: Project directory '$PROJECT_DIR' not found!"
    exit 1
fi

cd $PROJECT_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build project
echo "🔨 Building project..."
npm run build

case $PLATFORM in
    "vercel")
        echo "🌐 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📥 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    
    "netlify")
        echo "🌐 Deploying to Netlify..."
        if [ ! -f "netlify.toml" ]; then
            echo "❌ Error: netlify.toml not found!"
            exit 1
        fi
        echo "📁 Build completed. Upload 'dist' folder to Netlify manually or use Netlify CLI"
        echo "💡 Tip: Install Netlify CLI with 'npm install -g netlify-cli'"
        ;;
    
    "github-pages")
        echo "🌐 Deploying to GitHub Pages..."
        if ! command -v gh-pages &> /dev/null; then
            echo "📥 Installing gh-pages..."
            npm install --save-dev gh-pages
        fi
        npm run deploy
        ;;
    
    "aws-s3")
        echo "☁️ Deploying to AWS S3..."
        if ! command -v aws &> /dev/null; then
            echo "❌ Error: AWS CLI not installed!"
            echo "💡 Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
            exit 1
        fi
        
        BUCKET_NAME=${2:-"your-bucket-name"}
        if [ "$BUCKET_NAME" = "your-bucket-name" ]; then
            echo "❌ Error: Please provide S3 bucket name as second argument"
            echo "Usage: ./deploy-scripts.sh aws-s3 your-bucket-name"
            exit 1
        fi
        
        echo "📤 Uploading to S3 bucket: $BUCKET_NAME"
        aws s3 sync dist/ s3://$BUCKET_NAME --delete
        echo "✅ Upload completed!"
        ;;
    
    "docker")
        echo "🐳 Building Docker image..."
        if [ ! -f "Dockerfile" ]; then
            echo "📝 Creating Dockerfile..."
            cat > Dockerfile << EOF
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
        fi
        
        if [ ! -f "nginx.conf" ]; then
            echo "📝 Creating nginx.conf..."
            cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files \$uri \$uri/ /index.html;
        }
        
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF
        fi
        
        docker build -t bloodline-adn-frontend .
        echo "✅ Docker image built successfully!"
        echo "🚀 Run with: docker run -p 80:80 bloodline-adn-frontend"
        ;;
    
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Available platforms: vercel, netlify, github-pages, aws-s3, docker"
        exit 1
        ;;
esac

echo "✅ Deployment completed successfully!" 