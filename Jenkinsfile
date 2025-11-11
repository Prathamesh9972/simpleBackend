pipeline {
    agent { label 'agent_node' }

    environment {
        AWS_REGION     = "ap-south-1"
        AWS_ACCOUNT_ID = "964008494859"
        ECR_REPO_NAME  = "node-web-server"
        ECR_URL        = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE          = "${ECR_URL}/${ECR_REPO_NAME}"
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

        stage('Declarative: Post Actions'){
            steps{
                success {
                    echo "The Pipelin has build and deployed successfully!"
                }
                failure {
                    echo "The Pipeline has failed. Please check the logs."
            }
        }
    }
}
