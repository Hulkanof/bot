# Service d’administration de ChatBot

_date limite: 29/05/2023 20h00_

## API REST NodeJS pour administrer les bots

### Fonctionnalités

- Permet la creation de bot avec un cerveau standart (fichier **standard.rive** de [rivescript](https://www.rivescript.com/try))
- Changer le cerveau d'un bot
- Son nouveau cervau permet de garder en memoires des info perso
- Selection d'un fichier de parametre de connexion Discord ou Mastodon
- Supprimer l'acces a un service (Discord, Mastodon, Slack)
- Voir l'etat d'un bot (au moins les interface actives)

##### BONUS

- Changement d'un cerveau lorsque le bot est en conversation
- profile de l'utilisateur stocke sur MongoDB
- Instance Slack possible
- Chaque instance partage ces donnees collectees
- l'admin peut voir les conversations en cours sur un chat bot
- Je peux recouper des informations d’un utilisateur recueillies par différents ChatBot.

### API REST

_[best practices OPENPAI](https://oai.github.io/Documentation/best-practices.html) | [best practices 2](https://www.pythoniste.fr/python/fastapi/les-bonnes-pratiques-pour-construire-un-api-rest/) | [best practices 3](https://teknospire.com/best-practices-to-open-api-design/)_

## Interface Web

- Login pour acceder a l'interface
- L'utilisateur peut utiliser un bot
- L'administateur peut acceder a l'interface d'administration
