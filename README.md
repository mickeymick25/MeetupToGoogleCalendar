# Meetup Tribe Automation
The idea aim to automate meetup flow into a tribe shared google calendar regarding tribe topics.

## Getting Started
Not being a developer but UX you could see some code breaks or bad practices...
Please, do not hesitate to correct.

*Que fait ce script ?*
Il va chercher les meetups qui correspondent aux topics qui intéressent la tribu à savoir :  "expérience utilisateur, ux », les transforme en événements compatibles "google calendar" et les injecte dans un calendrier partagé, nommé "Tribu Ux - COM".

*Comment cela fonctionne ?*
Pour le moment, le script doit être lancé à la main, localement, tous les jours pour alimenter le calendrier partagé. Cette solution semble peu satisfaisante dans le temps. Il sera bon d'automatiser cette partie, possiblement avec un CRON;
sauf si vous avez mieux, je suis preneur...

*Comment lancer le script :*
```
npm run devstart
```

### Prerequisites
il vous faut créer un ficher .env local. Dans le miens j'y ai mis ces informations :
```
NODE_ENV = 'development'
MEETUP_KEY = '*** Votre Clé Meetup ***'
MEETUP_TOPICS = 'expérience utilisateur, ux' // ou tout autre topic qui vous conviendrait
GOOGLE_CALENDAR = '*** URL du calendrier Google ***' // Par default vous pouvez utiliser 'Primary'
```

### Prerequisites Google
Il vous faut créer des credentials pour l'API de Google et générer un fichier client_secret.json.
Pour cela le mieux est encore de suivre les instructions Step 1 ici :
https://developers.google.com/calendar/quickstart/nodejs#prerequisites

Une fois cela fait, executez le script un première fois:
```
npm run devstart
```
* L'application vous demandera de visiter une URL.
* Copiez-la, collez-la dans votre navigateur.
* Sélectionnez le compte Google a associé à l'application
* Autorisez l'application à accéder à votre compte
* Un code est généré automatiquement. Copiez-le
* Collez-le dans votre terminal.
* Le script s'executera de nouveau en ayant créer un fichier credentials.json
