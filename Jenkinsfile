pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                dir('SudeKocak/Sudebackend') {
                    sh 'docker build -t neyesem-api .'
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                dir('SudeKocak/Sudebackend') {
                    sh 'docker compose up -d --build'
                }
            }
        }
    }
}
