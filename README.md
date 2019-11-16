# 2DV515-a1-recommendation-system
My solution for Web intelligence (2DV515) assignment 1 at Linnaeus University.

The assignment description can be found here: [Assigmment 1](http://coursepress.lnu.se/kurs/web-intelligence/a1/)

## Requirements
### Grade E
- [ ] Build a recommendation system that can find similar users and find recommendations for
a user, using the movies large dataset (see [`/datasets/large`](https://github.com/AntonStrand/2DV515-a1-recommendation-system/tree/master/datasets/large))
- [x] You can verify that your application works by using the example dataset from the lecture (see [`/datasets/example`](https://github.com/AntonStrand/2DV515-a1-recommendation-system/tree/master/datasets/large))
- [x] Use Euclidean distance as similarity measure
- [x] Implement the system using a REST web service where:
    - [x] client sends a request to a server
    - [x] the server responds with json data
    - [x] the json data is decoded and presented in a client GUI

### Grade C-D
- [x] Implement the Pearson Correlation similarity measure
- [x] It shall be possible to select which measure to use from the client GUI

### Grade A-B
- [ ] Implement functionality for pre-generating an Item-Based Collaborative Filtering table by
transforming the original data set
- [ ] Use the pre-generated table to implement a second way of finding recommendations for
a user
- [ ] You shall only use Euclidean distance as similarity measure
- [ ] It shall be possible to select how to find recommendations from the client GUI
(Item-Based or User-Based)

## Get started 🚀
1. Select one of the provided datasets. (`./datasets/example`, `./datasets/large`)
2. Run `chmod 777 setup`.
3.  - Run **development** `./setup dev {PATH_TO_DATASET}`. Eg. `./setup dev ./datasets/example`.
    - Run **production** `./setup prod {PATH_TO_DATASET}`. Eg. `./setup prod ./datasets/example`. (_More secure settings_)
4. Sit back and relax.
5. 🎉 You can now visit the client at [localhost:3000](http://localhost:3000) 🎉

## Start Docker
If the project has been setup all you need to do is run `docker-compose up` to start the project again after exiting it.

## Exit Docker
1. Run `docker-compose stop`.
