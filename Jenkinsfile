pipeline {
    agent any
    stages {
        stage('DSU Bitbucket') {
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL} due commit ${env.GIT_COMMIT}"
                sh("git config remote.origin.url ssh://git@52.166.71.39:7999/ciam/schemavalidator.git")
            }
        }
        stage('Build Docker image') {
            steps {   
                sh("docker build -t schemavalidator:${env.GIT_COMMIT} .")
            }
        }
        stage('Deliver for development') {            
            stages {
                stage('Create Docker tag') {
                    steps {
                        sh("docker tag schemavalidator:${env.GIT_COMMIT} ciamproofacr.azurecr.io/schemavalidator:dev${env.GIT_COMMIT}")
                    }
                }
                stage('Push Docker image into ACR') {
                    steps {
                        sh("az acr login --name ciamproofacr")
                        sh("docker login ciamproofacr.azurecr.io -u CIAMProofACR -p P2orn0wCYpWtY=ZmKEeXANzIFk68of3X")
                        sh("docker push ciamproofacr.azurecr.io/schemavalidator:dev${env.GIT_COMMIT}")
                    }
                }
                stage('Update AKS') {
                    steps {           
                        sh ("kubectl set image deploy/schemavalidator schemavalidator=ciamproofacr.azurecr.io/schemavalidator:dev${env.GIT_COMMIT} --namespace=development")
                    }
                }
                stage('Delete local images for development') {
                    steps {   
                        sh("docker rmi schemavalidator:${env.GIT_COMMIT}")
                        sh("docker rmi ciamproofacr.azurecr.io/schemavalidator:dev${env.GIT_COMMIT}")
                    }
                }
            }
        }
        stage('Deliver for production') {
            when {
                branch 'master'
            }
            stages {
                stage('Create Docker tag') {
                    steps {
                        sh("docker tag schemavalidator:${env.GIT_COMMIT} ciamproofacr.azurecr.io/schemavalidator:pro${env.GIT_COMMIT}")
                    }
                }
                stage('Push Docker image into ACR') {
                    steps {
                        sh("az acr login --name ciamproofacr")
                        sh("docker login ciamproofacr.azurecr.io -u CIAMProofACR -p P2orn0wCYpWtY=ZmKEeXANzIFk68of3X")
                        sh("docker push ciamproofacr.azurecr.io/schemavalidator:pro${env.GIT_COMMIT}")
                    }
                }
                stage('Update AKS') {
                    steps {           
                        sh ("kubectl set image deploy/schemavalidator schemavalidator=ciamproofacr.azurecr.io/schemavalidator:pro${env.GIT_COMMIT} --namespace=production")
                    }
                }
                stage('Delete local images for production') {
                    steps {   
                        sh("docker rmi schemavalidator:${env.GIT_COMMIT}")
                        sh("docker rmi ciamproofacr.azurecr.io/schemavalidator:pro${env.GIT_COMMIT}")
                    }
                }
            }
        }        
    }
}