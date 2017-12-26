---
title: AI - Searches I
date: 2017-12-24 22:19:07
tags:
---

Tandon CS-GY 5403
> AI is just about all search.

## Tree Search
Tree search is an offline simluated exploration of state space by offline, simulated exploration of state space by generating successors of already-explored states.

A state is a configuration of an environment/agent. For example, in pacman a state represent python code `state`, it contains all informations: Pacman location, ghosts location, pellets left and their locations, time left, steps taken etc,.


### Uninformed Search
Uninformed search is only used the information availale from current state.

Before we dive into different uninformed searches, we have several definitions:
Complete means this algorithm always find a solution.
Time means algorithms O bound of time.
Space means algorithm space complexity.
Optimal means it can find the best solution.

* Breadth-first search - BFS
	* Complete: Yes
	* Time O(b^d)
	* Space O(b^d + 1) keeping every node in a queue.
	* Optimal : Yes
* Uniform cost search - Expand the least-cost unexpanded node if there is a expanding cost. Otherwist it just BFS
	* Complete and Optimal
* Depth-first search
	* Expand deepest unexpanded node, using a LIFO queue
	* Complete: No - If it is infinite depths, or it did not record visited node, there might be a loop.
	* Time O(b^m)
	* Space O(bm) linear space is DFS advantage.
	* Optimal : No - It would find an answer if modified but no a best answer.
* Depth-limited search
	* Deep-first search with limit depth l
* Iterative deepening search
	* Do depth-limited search at increasing depths
	* Complete : Yes
	* Optimal : Yes

### Informed Search
Imagine now we have a evalution function to estimate of cost from n to goal `f(n) = h(n)`

* Greedy best-first search
	* expands the nodes appears to be cloest to goal
	* Complete: No, it can get stuck in a loop
	* Time O(b^m)
	* Space O(bm)
	* Optimal: No

* A-star search
	* refined from greedy best-first search
	* Evaluation function changed into `f(n) = g(n) + h(n)`, g(n) is the cost so far to reach n, h(n) is estimated cost from n to goal, and f(n) is estimated total cost of path through n to goal.
	* Complete: Yes
	* Optimal: Yes

In a real implementation of A-star, we need a good evalution function and data structure like priority queue. Alough a good evaluation function is hard to find, but remember following rules:

1. Admissible heuristics: A heuristic h(n) is admissible if for every node n, h(n) smaller than h'(n), where h'(n) is the true cost to reach the goal state from n. It means an admissiable heuristics should not never overestimates the cost to reach the goal.
2. Dominance: if h2(n) no smaller than h1(n) and both are admissible, then h2 is better than h1. It means a tighter heuristics function of true cost is better.

A-star algorithm shows up very well in playing pacman. But in super-mario it would be problem when running into a wall.

### Local Search
In many optimization problems, the path to the goal might be irrelevant, but what we needed to find might the goal state. So in local search we can just keep current state. Space is out of discussion.

* Hill-climbing
	* Pretty much like a greedy algorithm, always find its neighbor with highest value, then set it as next current state.
	* It can get stuck into local maxima/minima.
* Simulated annealing
	* Do bad moves with decreasing probability, refined from Hill-climbing. It means agent can still take chances with "bad action", which might jump out local minima/maxima.

It is proved that if T decreases slowly enough, then simulated annealing search will find a global optimum with probaility approaching 1. (It is not guarantee)
