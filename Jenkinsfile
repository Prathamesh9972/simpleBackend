pipeline {
    agent { label 'agent_node' }

    environment {
        AWS_REGION     = "ap-south-1"
        AWS_ACCOUNT_ID = "964008494859"
        ECR_REPO_NAME  = "node-web-server"
        ECR_URL        = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE          = "${ECR_URL}/${ECR_REPO_NAME}"
    }

    stages {

<<<<<<< HEAD
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Prathamesh9972/simpleBackend.git'
                echo "Code cloned successfully"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${ECR_REPO_URL}:${IMAGE_TAG}")
                    echo "Docker image built successfully"
=======
        // Stage 1: Checkout code from GitHub
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Prathamesh9972/simpleBackend.git'
            }
        }

        // Stage 2: Build Docker image
        stage('Build Docker Image') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "Building Docker image: ${IMAGE}:${env.IMAGE_TAG}"
                    docker.build("${IMAGE}:${env.IMAGE_TAG}")
>>>>>>> parent of 79b02e8 (changes in jenkinsfile for deployment)
                }
            }
        }

<<<<<<< HEAD
        stage('AWS Login to ECR') {
            steps {
                script {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} \
                        | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    '''
                    echo "Logged in to AWS ECR successfully"
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                script {
                    sh "docker push ${ECR_REPO_URL}:${IMAGE_TAG}"
                    echo "Docker image pushed to ECR successfully"
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    echo "Deploying application using docker compose"
                    mkdir -p /home/jenkins/deploy
                    rsync -av --exclude='.git/' ./ /home/jenkins/deploy/
                    cd /home/jenkins/deploy/
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    docker compose pull
                    docker compose up -d
                    echo "Application deployed successfully"
                }
            }
        }
=======
        // Stage 3: AWS Login to ECR
        stage('AWS Login to ECR') {
            steps {
                sh """
                    echo "Logging in to AWS ECR..."
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_URL}
                """
            }
        }

        // Stage 4: Push Docker image to ECR
        stage('Push Docker Image to ECR') {
            steps {
                sh """
                    echo "Pushing Docker image to ECR..."
                    docker tag ${IMAGE}:${env.IMAGE_TAG} ${IMAGE}:latest
                    docker push ${IMAGE}:${env.IMAGE_TAG}
                    docker push ${IMAGE}:latest
                """
            }
        }

        // Stage 5: Deploy application using Docker Compose
        stage('Deploy Application') {
            steps {
                sh """
                    echo "Deploying application with Docker Compose..."
                    mkdir -p /home/ubuntu/deploy
                    rsync -av --exclude='.git' ./ /home/ubuntu/deploy/
                    cd /home/ubuntu/deploy
                    # Login to ECR before pulling
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_URL}
                    docker-compose pull
                    docker-compose up -d
                """
            }
        }
>>>>>>> parent of 79b02e8 (changes in jenkinsfile for deployment)
    }

    post {
        success {
<<<<<<< HEAD
            echo "Pipeline build and deployment completed successfully"
        }
        failure {
            echo "Pipeline failed, check logs"
=======
            echo "Application deployed successfully: ${IMAGE}:${env.IMAGE_TAG}"
        }
        failure {
            echo "Build or deployment failed — check logs"
>>>>>>> parent of 79b02e8 (changes in jenkinsfile for deployment)
        }
    }
}
