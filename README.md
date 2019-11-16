# 2DV515-a1-recommendation-system
My solution for Web intelligence (2DV515) assignment 1 at Linnaeus University.

The assignment description can be found here: [Assigmment 1](http://coursepress.lnu.se/kurs/web-intelligence/a1/)

## Requirements
### Grade E
- [x] Build a recommendation system that can find similar users and find recommendations for
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
Two datasets are provided. ([`./datasets/example`](https://github.com/AntonStrand/2DV515-a1-recommendation-system/tree/master/datasets/example), [`./datasets/large`](https://github.com/AntonStrand/2DV515-a1-recommendation-system/tree/master/datasets/large))

1. Run `npm install`
    > Default `./datasets/example` is used.
    > If you want to use `./datasets/large`; run `npm run install -- ./datasets/large`
2. Run `npm start`
3. 🎉  You can now visit the client at [localhost:3000](http://localhost:3000)  🎉

## Scripts
Start: `npm start`  
Stop: `npm stop`

## Exit
Press `ctrl + c` or run `npm stop`.
