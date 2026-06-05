pipeline {
    agent any

    stages {
        stage('Docker Version Check') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
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
                    sh 'docker compose up -d'
                }
            }
        }
    }
}