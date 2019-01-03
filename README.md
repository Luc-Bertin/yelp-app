# REQUÊTES MONGODB
---
## COLLECTION BUSINESS :


```
db.getCollection('businesses').findOne({})
```
### * Trouver tous les Businesses pour une ville == VARIALBE, 
 par ordre alphabétique (au départ, et on aimerait un truc NOT CASE SENSITIVE, c'est mieux) 
```
variable_city = 'Scottsdale'
//from Mongo 3.4 !!!
add_fields = { $addFields : { "insensitive" : { "$toLower": "$business_name" } } } // to have it lowered for sort
match = { $match : { 'city' : variable_city }}
sort =  { $sort :  { 'insensitive': 1 } }
project2 = { $project : { business_name:1 } }
db.getCollection('businesses').aggregate([add_fields, match, sort, project2])
```

### * si on veut sort par moyenne d'avis => voir section correspondante dans ce fichier


### * Afficher tous les noms des categories (pour faire une liste de catégories à sélectionner par exemple) :
```
db.getCollection("businesses").distinct('categories')
```
### * Afficher tous les différentes villes  (pour une liste de villes à sélectionner par exemple) :
```
db.getCollection("businesses").distinct('city')
```

## PETIT EXPLICATIF DU BESOIN DE METTRE UNE LISTE EN SORTIE DANS LE CAS D'UNE RECHERCHE PAR LE USER ##

Il y a plus d'ID que de business_name, y aurait-il des business same for same city? OUI : LOGIQUE : le nom peut être le même (exemple MacDonald's) voici les commandes qui le montrent
```
db.getCollection("businesses").distinct('business_name').length
db.getCollection("businesses").find().count()
// <=> SELECT DISTINCT (business_name+city), count them all
```

On voit bien qu'il est impossible d'obtenir un restaurant basé sur uniquement son nom et son lieu car la commande suivante groupe par lieux/noms
```
group = { $group : { _id: {city: "$city", name:"$business_name" }, 
                    count : { $sum :1} }}
match = { $match : { count: { $gt:1 } } }             
project = { $project : { _id: 0, city : "$_id.city", name: "$_id.name", count:1 }}        
db.getCollection("businesses").aggregate([group, match, project])
```
Il est donc mieux de dresser une liste avec selection du "MacDonald's" sur d'autres informations qui les différencie

## FIN DU PETIT EXPLICATIF ----------

### * Businesses ayant QUE des NOTES >= VARIABLE ( <=> AUCUNE note dessous de 4.0)
```
variable = 4.0 
filter = { "reviews.stars" : {$not : {$lt: variable}}}
projection = { "business_name":1, "reviews.stars":1 }
db.getCollection('businesses').find(filter, projection)
```

### * Calcul de la moyenne totale des avis/notes pour les businesses
```
unwind = { $unwind : "$reviews" };
group = { $group : { _id :"$_id", 
                    moyenne_reviews : { $avg: "$reviews.stars" },
                    name : { $first: '$business_name' }, //to keep those columns
                    city : { $first: '$city' }
                    }};
sort = { $sort : { moyenne_reviews: -1 }}
db.getCollection('businesses').aggregate([unwind, group, sort])
```

### * Business ayant en MOYENNE des NOTES >= VARIABLE
```
variable_note_mini = 4.0
unwind = { $unwind : "$reviews" };
group = { $group : { _id :"$_id", 
                    moyenne_reviews : { $avg: "$reviews.stars" },
                    name : { $first: '$business_name' }, //to keep those columns
                    city : { $first: '$city' }
                    }};
sort = { $sort : { moyenne_reviews: -1 }}
match = { $match : { moyenne_reviews : { $gte : variable_note_mini} }}
db.getCollection('businesses').aggregate([unwind, group, sort, match])
```

### * Business ayant en MOYENNE des NOTES >= VARIABLE1 et une VILLE selectionnée: VARIABLE2
--> A demander à Théo, la commande suivante est logiquement la meme que celle precedente mais avec 
--> un critère supplémentaire, il faut voir s'il est possible de faire des if (isset (variable)) then XXXX
```
variable_note_mini = 4.0
variable_city = 'Phoenix';
unwind = { $unwind : "$reviews" };
group = { $group : { _id :"$_id", 
                    moyenne_reviews : { $avg: "$reviews.stars" },
                    name : { $first: '$business_name' }, //to keep those columns
                    city : { $first: '$city' }
                    }};
                    
match = { $match : { moyenne_reviews : { $gte : variable_note_mini}, city : variable_city } }
sort = { $sort : { moyenne_reviews: -1 }}
db.getCollection('businesses').aggregate([unwind, group, sort, match])
```

### * Meilleurs Businesses ayant eu la meilleure moyenne de votes 'VARIABLE', VARIABLE étant soit (FUNNY / COOL / ou USEFUL) 
--> Note: c'est donc par ordre décroissant de votes dans une catégorie, 
--> Pour Théo : Si tu veux juste avoir les 10 premiers tu peux couper le JSON en sortie ou on peut tjrs rajouter une commande
```
VARIABLE_LIST_POSSIBILITIES = ["votes_funny", "votes_useful", "votes_cool"] // variable ne peut que faire parti de la liste de choix prédéfinie
var variable = VARIABLE_LIST_POSSIBILITIES[0], doc = {}
unwind = { $unwind : "$reviews" };
//on pourrait dans le group juste calculer pour la variable d'intérêt, à voir le temps de calcul
//mais ça ne devrait pas changer beaucoup de choses car c'est dénormalisé et imbriqué (et on unwind 'reviews' dans tous les cas)
group = { $group : {
                    _id : "$_id",
                    total_votes_funny : {$avg : "$reviews.votes_funny"}, 
                    total_votes_useful : {$avg : "$reviews.votes_useful"},
                    total_votes_cool : {$avg : "$reviews.votes_cool"},
                    business_name : { $first : '$business_name'}, //to keep some infos whilst grouping
                    city : { $first : '$city' }
                    }
         }
doc["total_"+variable] = -1
sort = { $sort : doc }
db.getCollection('businesses').aggregate([unwind, group, sort])
```

### *  POUR LES CHECKINS MAINTENANT :

### *obtenir les checkins d'un restaurant sommés pour chaque jour de la semaine une fois avoir sélectionné dans la liste et obtenu son id
--> exemple avec "_id" : "--5jkZ3-nUPZxUvtcbr8Uw"

```
var variable_id = '_yfprBETaYgySkKyl8ZWMQ'
match = { $match : {_id : variable_id} }
unwind = { $unwind : "$checkins" }
group = { $group : {_id: "$checkins.day", 
                    count_checkins_day : { $sum : "$checkins.number_checkins"},
                    business_name : { $first : '$business_name'}
                    }
         }
add_fields = { $addFields : { Day: "$_id"}}
project = { $project : { _id:0 } } 
add_fields2 = { $addFields : { _id : variable_id} } 
group2 = { $group : { _id: "$_id",
                    checkins : { $push: { day : "$Day", count : "$count_checkins_day" } }
                    }
         }
db.getCollection('businesses').aggregate([match, unwind, group, add_fields, project, add_fields2, group2])
```


### * obtenir les restaurants ayant eu le plus de checkins pour un jour donné

### * les premières lignes donnent un tri par jour les plus enregistrés (indépedemment du jour sélectionné, pour tous les businesses)
### *  on filtre ensuite par la variable 
```
unwind = { $unwind : "$checkins" }
group = { $group : {_id: { id_business : "$_id", day_checkins : "$checkins.day"},
                    count_checkins_day : { $sum : "$checkins.number_checkins"},
                    business_name : { $first : '$business_name'},
                    day : { $first : "$checkins.day" },
                    id_business : { $first : "$_id" }
                    }
         }
project = { $project : { _id:0 } } 
add_fields = { $addFields : { _id: "$id_business"}}
project2 = { $project : { id_business:0 } } 
sort = { $sort : {count_checkins_day : -1}}
```
### * (Theo : juste pour que tu vois le résultat sans utiliser de variable)
db.getCollection('businesses').aggregate([unwind, group, project, add_fields, project2, sort])
### * avec VARIABLE dans la liste ["Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday","Sunday"] 
```
VARIABLE_LIST_DAYS_POSSIBILITIES = ["Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday","Sunday"] // variable ne peut que faire parti de la liste de choix prédéfinie
var variable_which_day = VARIABLE_LIST_DAYS_POSSIBILITIES[0]
match = { $match : { day : variable_which_day} }
//we could use a cumsum too
db.getCollection('businesses').aggregate([unwind, group, project, add_fields, project2, sort, match])
```
### * encore une fois on peut toujours s'arrêter à 10 business, j'ai juste laissé la liste entière au cas où

### *  Checkins a chaque heure, pour chaque jour, pour tous les restaurants cumulés (pourrait être une requête de Data Scientist)
```
unwind = { $unwind : "$checkins" }
group = { $group : {_id : { hour : "$checkins.hour", day : "$checkins.day"}, //independently of business _ids
                    count : {$sum: "$checkins.number_checkins"}, 
                    hour : {$first : "$checkins.hour" },
                    day : {$first : "$checkins.day" }
                }
         }
project = { $project : {_id:0}}
sort = { $sort : { day:1, hour:1}} // par ordre alphabétique sur les jours de la semaine, et de 00:00 à 23:00 sur les heures
db.getCollection('businesses').aggregate([unwind, group, project, sort])
```

## COLLECTION USERS :
```
db.getCollection('users').find({_id : "--5hzxWLz5ozIg6OMo6tpQ"})
db.getCollection('users').find()
```

```
match = { $match :{} }
unwind = { $unwind : {} }
group = { $group : {}}
sort = { $sort : {}}
project = { $project : {}}


match = { $match :{} }
unwind = { $unwind : {} }
group = { $group : {}}
sort = { $sort : {}}
project = { $project : {}}


match = { $match :{} }
unwind = { $unwind : {} }
group = { $group : {}}
sort = { $sort : {}}
project = { $project : {}}
```
