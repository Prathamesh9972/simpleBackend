pipeline {
    agent { label 'agent_node' }

    environment {
        AWS_ACCOUNT_ID = "964008494859"
        AWS_REGION = "ap-south-1"
        ECR_REPO_NAME = "node-web-server"
        ECR_REPO_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {

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
                }
            }
        }

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
    }

    post {
        success {
            echo "Pipeline build and deployment completed successfully"
        }
        failure {
            echo "Pipeline failed, check logs"
        }
    }
}
