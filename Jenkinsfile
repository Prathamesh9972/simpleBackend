pipeline {
    agent { label 'agent_node' }

    environment {
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "964008494859"
        ECR_REPO_NAME = "node-web-server"
        ECR_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE = "${ECR_URL}/${ECR_REPO_NAME}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "Checking out source code..."
                git branch: 'main', url: 'https://github.com/Prathamesh9972/simpleBackend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Generate latest commit hash for tagging
                    IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = IMAGE_TAG

                    echo "✅ Building Docker image: ${IMAGE}:${env.IMAGE_TAG}"
                    docker.build("${IMAGE}:${env.IMAGE_TAG}")
                }
            }
        }

        stage('AWS Login to ECR') {
            steps {
                echo "Authenticating to AWS ECR..."

                withAWS(credentials: 'aws-ecr-creds', region: "${AWS_REGION}") {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_URL}
                    """
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                script {
                    echo "🚀 Tagging & pushing image to AWS ECR..."

                    sh """
                        docker tag ${IMAGE}:${env.IMAGE_TAG} ${IMAGE}:latest
                        docker push ${IMAGE}:${env.IMAGE_TAG}
                        docker push ${IMAGE}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Push completed successfully!"
            echo "✅ Image pushed to ECR: ${IMAGE}:${env.IMAGE_TAG}"
        }
        failure {
            echo "❌ Build failed, check Jenkins logs."
        }
    }
}
