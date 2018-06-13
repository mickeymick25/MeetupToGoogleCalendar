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

Comment lancer le script :
```
npm run devstart
```

### Prerequisites
il vous faut créer un ficher .env local. Dans le miens j'y ai mis ces informations :
```
NODE_ENV = 'development'
MEETUP_KEY = '*** Votre Clé Meetup ***'
MEETUP_TOPICS = 'expérience utilisateur, ux' // ou tout autre topic qui vous conviendrait
```
