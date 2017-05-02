---
title: Map Reduce
date: 2017-05-02 15:57:55
tags:
---


MapReduce is a great Algorithm, and it inspires distributed system.

It is a very simple algorithm. Map produces all items into a key value pair (k, v). And Reduce aggregate, summarize, filter or transform all (k, v) into required output. Pretty easy to understand, isn't it? This algorithm can be applied on a distributed system very naturally. But there are still some hidden details between Map to Reduce. (using Hadoop as an example)

### Map

* Map outputs are buffered in memory in a circular buffer. When the buffer reaches threshold, content are 'spilled' to disk.


Before map output serves as reduce input, hadoop **combiner** would shuffle all mapper outputs and sort(to do or not to do that) them. Then using **partitioner** to hash output via key into different reducers.

### Reduce

* map intermediate output would copy to reducer mechine.
* Every output are directly stored in reducer and if you need a combined output, you need combined all those outputs in a reducer or locally after fetched all data from reducers.

> Input, output all stored in Distributed File System.
> Intermediate results are stored on local FS of Mapper and Reducer worker

But for Hadoop, each workflow is a map-reduce process. If client would like to do complex operations, still need to perform multiple MapReduces.

### System Tradeoffs
Problem: Slow workers would slow down all the process.

* spawn backup copies of tasks -- those fast worker do the slow one.
* Instead of copy all the data to mappers or reducers, they keep the data but copy the code run on their environment.

### Optimization Tricks
For ideal scaling characteristics, people always assume double machines, half the running time. But it would go like that in reality. The main limitation of distributed system is **Synchronization**. Synchronization needs **communication**. So communication is main feature but also a drawback on distributed system.

* Make Mapper much larger than the number of nodes in the cluster, and Reducer number usually is smaller than Mapper number (Ouput needs to spread across R files)
* pre-aggrating values in mapper, reduce output size can save cost of disks and communication.
* Customed Combiner and partitioner
* Those codes should avoid much object creation, avoid buffering.

##### Local aggregation
Do pre-aggregation (usually in mapper). In-mapper combining fold the functionality of the combiner into mapper by preserving state across multiple map calls. This is so kind of doing combiner jobs, but it is faster than actual combiner. Because system does not need to write all intermediate key-value pairs to disks.

**Disadvantages** is quite obvious, if doing pre-aggregation, in mapper it need to create more temporary data (usually hashmap), and as hashmap growing, it might not fit in memory. Second, it would be some potential bugs and it need a well designed.

##### Pairs and Stripes
The PPT from course points out a example: if you want to count two words frequency, we can use pairs to map out `((first word, second word), 1)`, and do normal reduce. The advantage is it is very easy to implement, easy to understand, but lots of pairs.

Or we can use stripes to map out `(word, {"word A" : a, "word B" : b ...})`, and then aggregate at reducers. It reduces communication cost for less intermediate, but it is more difficult to implement, create a heavy object to serialize and de-serialize and it might not fit in memory.

Abstractly, if implementation use pairs in a scenario, then it can also apply with stripes.

##### Order Inversion
Computing relative frequencies requires marginal counts. But marginal counts cannot be computed until you see the total. So you can computed the total and emit the total, but you need to make sure the total show up first to reducers.(partitioner and sorting order customize)

For example we have:

<pre><code class="json">
(a, *)->32				 
(a, b1)->3				(a, b1) -> 3  / 32
(a, b2)->12		-----> (a, b2) -> 12 / 32 
(a, b3)->7				(a, b3) -> 7 / 32
(a, b4)->1						...
</code></pre>

##### Secondary Sorting
If not only want to sort the key during sorting period, but also want to sort value. Extract value in key part, and customize sorting methods for also sorting the key.

*reference*

*	Big Data Analysis