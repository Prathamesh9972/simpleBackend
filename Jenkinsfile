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
                // Public GitHub repo → no credentials needed
                git branch: 'main', url: 'https://github.com/Prathamesh9972/simpleBackend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "✅ Building Docker image: ${IMAGE}:${env.IMAGE_TAG}"
                    docker.build("${IMAGE}:${env.IMAGE_TAG}")
                }
            }
        }

        stage('AWS Login to ECR') {
            steps {
                // Use Jenkins AWS credentials correctly
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-ecr-creds'
                ]]) {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_URL}
                    """
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                sh """
                    docker tag ${IMAGE}:${env.IMAGE_TAG} ${IMAGE}:latest
                    docker push ${IMAGE}:${env.IMAGE_TAG}
                    docker push ${IMAGE}:latest
                """
            }
        }
    }

    post {
        success {
            echo "✅ Image pushed to ECR: ${IMAGE}:${env.IMAGE_TAG}"
        }
        failure {
            echo "❌ Build failed — check logs"
        }
    }
}
