pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Version Check') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t neyesem-api .'
            }
        }

        stage('Docker Compose Up') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }
}