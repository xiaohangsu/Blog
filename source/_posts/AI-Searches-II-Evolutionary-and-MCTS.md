---
title: AI Searches II - Evolutionary and MCTS
date: 2017-12-24 23:02:35
tags:
---

### Evolutionary Algorithm

Evolutionary algorithm is inspired by Darwinian natural evolution. The algorithm is extremely domain-general and widely used in many fields.
The enssential part of it is:

1. Fitness evaluation 
2. Selection - Fitness affects how many offspring an individual has
3. Variation - produce offspring (mutation and/or crossover)
4. Population - initial population should be diverse enough.

<pre>
BEGIN
	INITIALISE population with random candidate solutions; EVALUATE each candidate;
	REPEAT UNTIL ( TERMINATION CONDITION is satisfied ) DO
		1 SELECT parents;
		2 RECOMBINE pairs of parents;
		3 MUTATE the resulting offspring;
		4 EVALUATE new candidates;
		5 SELECT individuals for the next generation;
	OD
END
</pre>

There are two varibles **x, y**. Total population is **x + y**. For each generation, remove the worst **y** individuals and replaced with mutated copies of the **x**.
Stochastic hillclimber = evoluation strategy with x = y = 1.

OneMax is an example which representation of binary string. The fitness function is the number of ones in a binary string. Mutation we used flip a random bit in each generation.

If we start for 5 binary strings with length 5 [00000], [01001], [00100], [11101], [11111].
First generation might be 11001, 10010, 01010, 00100, we select 11001 and 10010.
Next generation might be 11101, 11001, 10010, 00010. So next generation we select 11101, 11001.
At generation 3 we have 11111, 11101, 11101, 11001, 11000. So we have a full 11111 with 1 in all bits now.

Another variation we did not cover is crossover. For example, in generation 2 we use 11101 and 11001. Crossover might be select three bits from one and two bits form another one, so their offsprings would be 11101 and 11001.

### MCTS

MCTS is a statistical tree search method with rollouts rather than heuristic evoluation. It would be an unbalanced trees. To do better illustration I use MCTS pacman agent I wrote.

There are actually three(if separate tree policy then four) steps for MCTS:

* Tree Policy, from here you should expand unexpand neighbors started from current state first. If all nodes already expanded, then you can just use selection policy (cover later).

<pre>
function TreePolicy(v)
	while v is nonterminal do
		if v is not fully expanded then
			return Expand(v)
		else
			v ← Select(v, Cp) return v
			
function Expand(v)
	choose a ⍷ untried actions from A(s(v))
	add a new child v' to v
		with s(v`) = f(s(v), a)
		with a(v`) = a
	return v`
	# s(node) is the state of node v
	# a(node) is all available actions at node
	# f(state, action) is the transition function
	
function Select(v, c)
	# v' is children of v
	# Q is reward
	# N is visited count
	return argmax v'
		Q(v') / N(v') + c * sqrt(2 * ln(N(v) / N(v'))
	# c is represent a balance between exploitaion and exploration
</pre>


* Simulation (Rollout or Default policy), in my pacman agent what I do is random take action and step down five state and return the reward.

<pre>

function DefaultPolicy(s)
	while s in non-terminal do
		choose a ⍷ A(s) uniformly at random
		s ← f(s, a)
	return reward for state s
</pre>

* Backpropagation, is to update the tree node with visited count and reward.

<pre>
function Backup(v, r)
	while v is not null do
		N(v) ← N(v) + 1
		Q(v) ← Q(v) + r
		v ← parent of v
# v is the new node added to the tree
# r is the reward from rollout
# N(v) the number of times node v is visited
# Q(v) is the accumulated reward
# the backpropagation starts from the new added node to the root node
</pre>

Some policys of actions selections like:

* Max Child: Select the root child with the highest reward
* Robust Child: Select the most visited root child.
* Max Robust Child: Select the root child with the highest visit count and the highest reward.
* Secure Child: Select the child which maximize lower confidence bounds.

