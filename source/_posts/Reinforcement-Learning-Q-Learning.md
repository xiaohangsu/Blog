---
title: Reinforcement Learning - Q Learning
date: 2017-12-24 17:23:30
tags:
---

### Reinforcement Learning

Reinforcement Learning is a kind of AI learning model: Agent learned from reward gained after taking action on each state. With Bellman Equation and Markov Decision Process. But we are not only depending on the reward, instead of using value function to evaluate "value" of current state with respective actions to take next.

For example, Temporal Difference Methods show a glance of how to learn:
`V(St) <- V(St) + aplha * [Rt+1 + discount * V(St+1) - V(St)]`

`St` means current state t, `St+1` is `V()` is value function, `aplha` represents learning rate, `Rt+1` is the next Reward from state t+1. `discount` means we need to consider discount future state value for better estimate current `V(St)`.

Above is TD method to determine learning process and update `V(St)`. A larger discount factor means we take future more important, a smaller factor means we care less. Value function should tells how good or bad of current state(not just current reward!).

### Q Learning

With above, Q learning only consider one step forward: which is in Q Learning we only care about next state and current state.

So in previous discussion of the entire reinforcement learning, what we want is to build a Transition Matrix, or simply a table, a table rows and columns are every state and every action. And in each cell is the `V` - value.

So in CS-GY 5403 AI course, if we use the pacman, we should have a table with every state! It might be impossible because too many infomations in each state th make it unique: pellets positions, pacman position, ghost positions ... It might be a large cmbination of all these if ghost and pacman movement is totally random.

So here came in the approximate Q Learning. Instead using the whole state, we can extract some features out of state and make the rows shrink. But be aware, the features should be selected wisely :). I tried some of those but its performance still not good. In UC Berkley AI course, they used only four features to achieve a relative great performance!
	
1. Bias - always be 1.
2. near-ghosts - If is a ghost a step away from ghost, return 1, else return 0.
3. near-pellets - the real distance from nearest pellets, not manhanttan distance, not euclidean distance, but the real distance taking walls into account.
4. eat-food - If near-ghost is 0 and near-pellets is 1 step away from pacman, return 1, else return 0.

For each features we need to normalize in between 0 - 1.

OK. For now let's take a look how exactly the code and process.

First, we need to train:
<pre><code class="python">	def learning(self, state):
        init_state = state
        for episode in range(self.learning_time):
            action = self.choosePolicy(state, state.getLegalPacmanActions())

            successor = state.generatePacmanSuccessor(action)
            if successor is None:
                return False
            self.stepFromStart += 1

            reward = successor.getScore() - state.getScore() - self.stepFromStart
            self.updateWeight(reward, state, action, successor)
            if successor.isLose() or successor.isWin():
                if successor.isLose():
                    self.lose += 1
                if successor.isWin():
                    self.win += 1
                print self.lose, self.win
                state = init_state
                self.stepFromStart = 0
            else:
                state = successor
        return True

</code>
</pre>

For each episode (training slice) we first need to choose a action with `self.choosePolicy`, in which I use greedy policy: always return the action with the maximum `Q(state, action)` - value.

Then I need to get next state and reward.
In `self.updateWeight`
<pre><code class="python">    def updateWeight(self, reward, state, action, successor):
        successor_actions = successor.getLegalPacmanActions()
        features = featurelize(state, action)
        selfQ = self.Q(state, action)
        delta = reward - selfQ
        if not successor.isWin() and not successor.isLose():
            selfQSuccessor = self.Q(successor, self.choosePolicy(successor, successor_actions))
            delta += self.gamma * selfQSuccessor
        for feature in features:
            self.w[feature] = self.getW(feature) + self.alpha * delta * features[feature]
</code>
</pre>

It would get a `delta`, which is the same in TD method formula, then I update the weight.

After training for adequate episodes, we can just jump into execute a real pacman AI to play the game.

### Refinement
During the learning, `self.choosePolicy` can be some other policys

* Greedy
* e-Greedy - select greedy action 1-e%
* Stochastic Policy - probabilistically

Actually like Approximate Q Learning already was a refinement of it. And the features can be more precise if you know how to choose them :).

And in the example code I just use a weight vector, all update is on this vector. Neural Network would definitely better than a linear one.

etc,.

