pipeline{
    agent {label 'agent_node'}

    environment {
        AWS_ACCOUNT_ID = "964008494859"
        AWS_REGION = "ap-south-1"
        ECR_REPO_NAME = "node-web-server"
        ECR_REPO_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages{
        stage('Checkout Code'){
            steps{
                git branch: 'main', url:'https://github.com/Prathamesh9972/simpleBackend.git'
                echo "Cloned Successfully"
            }
        }
        stage('Build Docker Image'){
            steps{
                script {
                    dockerImage = docker.build("${ECR_REPO_URL}:${IMAGE_TAG}")
                    echo "Docker Image Built Successfully"
                }
            }
        }
        stage('AWS Login to ECR'){
            steps{
            //IAM role created to push and pull images from ECR and it will get temp aws creds
                script {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    '''
                    echo "Logged in to AWS ECR Successfully"
                }
            }
        }

        stage('Push Docker Image to ECR'){
            steps{
                script {
                    sh '''
                        docker push ${ECR_REPO_URL}:${IMAGE_TAG}
                    '''
                    echo "Docker Image Pushed to ECR Successfully"
                }
            }
        }

        stage('Deploy Application'){
            steps{
                script {
                    echo "Deploying application with docker compose"
                    mkdir -p /home/jenkins/deploy
                    rsync -av --exclude='.git/' ./ /home/jenkins/deploy/
                    cd /home/jenkins/deploy/
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    docker compose pull
                    docker compose up -d
                    echo "Application Deployed Successfully"
                }
            }
        }

    }

    post{
        success{
            echo "Pipeline executed successfully!"
        }
        failure{
            echo "Pipeline failed. Please check the logs."
        }
    }
        
}