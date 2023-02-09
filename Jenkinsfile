pipeline {
  agent any
  stages {
    stage('TestPostman') {
      when {
        branch 'master'
      }
      steps {
        script {
          cleanWs(patterns: [[pattern: 'newman/newman-run-report-*', type: 'INCLUDE']])

          /* 
          TODO: get collections, then mount host collections 
          folder ~/collections, onto /etc/newman on the docker image, 
          so that newman has access to collections
          */
          //def result = sh script: "docker run -v ~/collections:/etc/newman -t postman/newman:alpine dutchie.postman_collection.json --environment='dev.json.postman_environment' --reporters junit --reporter-junit-export='newman-run-report.xml'"
          nodejs('11.1') {
            sh script: "npm install -g newman"
            def result = sh script: "newman run postman/dutchie.postman_collection.json -r html,cli,junit", returnStatus: true
            if(result != 0){
              error("Newman postman test failed:" + env.BUILD_URL)
            }else{
              junit 'newman/newman-run-report-*.xml'
              publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: '', reportFiles: 'newman/newman-run-report-*.html', reportName: 'HTML Report', reportTitles: ''])
            }
          }
        }
      }
    }

    stage('Upload') {
      when {
        branch 'master'
      }
      steps {
        ftpPublisher alwaysPublishFromMaster: true, 
        continueOnError: false, 
        failOnError: false, 
        publishers: [
            [configName: 'CRIMSOMPEPPER', transfers: [
                [asciiMode: false, 
                cleanRemote: false, 
                excludes: '', 
                flatten: false, 
                makeEmptyDirs: false, 
                noDefaultExcludes: false, 
                patternSeparator: '[, ]+', 
                remoteDirectory: "menus", 
                remoteDirectorySDF: false, 
                removePrefix: '', 
                sourceFiles: ['**.html','**.jpg','**.ico','**.js']
            ], usePromotionTimestamp: false, 
            useWorkspaceInPromotion: false,
            verbose: true]
          ]
        ]
      }
    }
  }
}