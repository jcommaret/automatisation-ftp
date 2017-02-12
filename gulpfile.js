'use strict';
/** Les packets que vous allez utiliser **/
var gulp = require('gulp');
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );

/** Configuration de votre environnement pour le deploiement**/
var user = FTP_USER;
var password = FTP_PWD;
var host = 'your.server.ip.address';
var port = 21;
var localFilesGlob = ['./**/*'];
var remoteFolder = '/public_html/'

/** Fonction qui permet de recupérer les variables et de créer la connexion FTP **/
function getFtpConnection() {
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 5,
        log: gutil.log
    });
}

/**
 * Tache de deploiement.
 * Copie les fichier locaux pour les mettre sur le serveur.
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */
gulp.task('ftp-deploy', function() {
    var conn = getFtpConnection();
    return gulp.src(localFilesGlob, { base: '.', buffer: false })
        .pipe( conn.newer( remoteFolder ) ) // only upload newer files
        .pipe( conn.dest( remoteFolder ) )
    ;
});
/**
 * Tache d'uplate en temps réel des fichiers sur le serveur.
 * Regarde les changements locaux sur le serveur et  copies les nouveaux fichier sur le serveur. 
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
 */
gulp.task('ftp-deploy-watch', function() {
    var conn = getFtpConnection();
    gulp.watch(localFilesGlob)
    .on('change', function(event) {
      console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);
      return gulp.src( [event.path], { base: '.', buffer: false } )
        .pipe( conn.newer( remoteFolder ) ) // only upload newer files
        .pipe( conn.dest( remoteFolder ) )
      ;
    });
});
