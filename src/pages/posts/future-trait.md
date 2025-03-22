---
title: 'Implementing Future trait in Rust'
pubDate: 2025-03-19T00:00:00
description: 'This is the first post of my new Astro blog.'
author: 'Astro Learner'
image:
    url: '/future-traits/async-rust.svg'
    alt: 'The Astro logo on a dark background with a pink glow.'
tags: ["rust", "async", "traits"]
layout: ../../layouts/BlogLayout.astro
---

Asynchronous programming is one of the most important aspect of modern software development, enabling efficient handling of tasks concurrently. To support this, Rust also provides a way to write asynchronous code using the `async` and `await` keywords. 

In this post, we will learn about the `Future` trait, which is the foundation of asynchronous programming in Rust. We will also see how to implement this trait for a custom type and how does it work.

## What is a future? [^1]

[^1]: What is a future?

Before we dive into the `Future` trait, let's understand what a future is. A future is a value that might not have finished computing yet. Unlike blocking operations, futures are non-blocking, that means we can continue doing some other work while this future is being computed.

This is the core idea behind asynchronous programming, note that there is no parallelism involved in a pure asynchronous runtime without the involvement of multithreading. We are just increasing the efficiency of the program by not getting blocked by any particular operation.

This allows using the waiting time for other tasks, which helps to maximise the CPU throughput resulting in better performance.

## The **Future** trait

Rust provides a trait called `Future` to implement asynchronous values. This trait forms the foundation of Rust's async system, enabling non-blocking execution by allowing tasks to yield control until they are ready to make progress.

The `Future` trait looks like this:

```rust
pub trait Future {
    type Output;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
```

Here, `Output` is the actual type that the future will resolve to and `poll` method is used to check if the future has completed or not by the executor.

## Implementing the **Future** trait [^2]

[^2]: Implementation of the Future trait


Now, as we know what a future is and how is `Future` trait significant, let's see how to implement this trait for a custom type.

Firstly, we will import all the required types.
```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};
```

Let's declare a simple struct that holds a 32 bit signed integer now.

```rust
struct MyFuture {
    // some value
    value: i32,
}
```

Now, we will implement the `Future` trait for our `MyFuture` struct.

```rust
impl Future for MyFuture {
    // output variable
    type Output = i32;

    fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
        Poll::Ready(self.value)
    }
}
```

Future trait requires us to declare the `Output` type and implement the `poll` method. In the `poll` method, we are returning the value of the `value` field of our struct wrapped in `std::task::Poll`.

### What is Poll? [^3]

[^3]: What is Poll?

Poll is an enum that represents the result of a poll operation, which can be either `Ready` or `Pending`. If the future has completed, we return `Poll::Ready` with the value, otherwise we return `Poll::Pending` to let the executor know that the future is not ready yet.

<br>

Let's see a simple example of how to use our `MyFuture` struct.

```rust
#[tokio::main]
async fn main() {
    let h = MyFuture { value: 42 };
    let r = h.await; 
    println!("Fetched value from MyFuture is {}", r);
}
```

In this example, we are using the `tokio` runtime to run our future. We are creating an instance of `MyFuture` struct and then awaiting on it to get the value. Finally, we are printing the value.

Here is the output of the above code we get by running `cargo run`:
```sh
celestix@andromeda ~/future-trait$ cargo run   
   Compiling future-trait v0.1.0 (/home/celestix/future-trait)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.07s
     Running `target/debug/future-trait`
Fetched value from MyFuture is 42
```

Congratulations! You have successfully implemented the `Future` trait for a custom type in Rust. Now, let's move to the next step, implementing a fully functional implementation of `Future` trait by considering a real-world example.

<br>

## A real-world example [^4]

[^4]: Implementing Future trait for a real-world example

Consider that there are three racers competing against each other and each one of them have their own speed. Let's implement a `Racer` struct for that.

```rust
struct Racer<'a> {
    name: &'a str,
    slot_distance: u32,
    total_distance: u32,

    distance_covered: u32,
}
```

Here, `name` is the name of the racer, `slot_distance` is the distance covered by the racer in one slot, `total_distance` is the total distance to be covered by the racer and `distance_covered` is the distance covered by the racer till now.

Now, let's implement some methods for the `Racer` struct and declare a main function to make three racers compete against each other.

```rust

impl <'a>Racer<'a> {
    fn new(name: &'a str, slot_distance: u32, total_distance: u32) -> Self {
        Racer{
            name,
            slot_distance,
            total_distance,
            distance_covered: 0,
        }
    }
    fn race(&mut self) {
        loop {
            self.distance_covered += self.slot_distance;
            if self.distance_covered >= self.total_distance {
                println!("{} has finished", self.name);
                break;
            }
            println!("{} has covered {} distance", self.name, self.distance_covered);
        }
    }
}


fn main() {
    let mut racer1 = Racer::new("Racer 1", 40, 100);
    let mut racer2 = Racer::new("Racer 2", 20, 100);
    let mut racer3 = Racer::new("Racer 3", 30, 100);
    racer1.race();
    racer2.race();
    racer3.race();
}

```

In the `race` method, we are incrementing the `distance_covered` by `slot_distance` and checking if the racer has finished the race or not. If the racer has finished, we print a message and break the loop, otherwise we print the distance covered by the racer.

Compile and run the above code using `cargo run` and you will see the output like this:
```sh
celestix@andromeda ~/future-trait$ cargo run
   Compiling future-trait v0.1.0 (/home/celestix/future-trait)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.07s
     Running `target/debug/future-trait`
Racer 1 has covered 40 distance
Racer 1 has covered 80 distance
Racer 1 has finished
Racer 2 has covered 20 distance
Racer 2 has covered 40 distance
Racer 2 has covered 60 distance
Racer 2 has covered 80 distance
Racer 2 has finished
Racer 3 has covered 30 distance
Racer 3 has covered 60 distance
Racer 3 has covered 90 distance
Racer 3 has finished
```

The issue with above code is that it is blocking the main thread and not allowing other racers to run concurrently unless the last racer completes the race and hence the wrong results as Racer 3 was clearly faster than Racer 2. But since Racer 2 was blocking the main thread until its completion, Racer 3 was not able to run. 

<br>

Let's implement an asynchronous version of the same code using the `Future` trait now.

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

struct Racer<'a> {
    name: &'a str,
    slot_distance: u32,
    total_distance: u32,

    distance_covered: u32,
}

impl<'a> Racer<'a> {
    fn new(name: &'a str, slot_distance: u32, total_distance: u32) -> Self {
        Racer {
            name,
            slot_distance,
            total_distance,
            distance_covered: 0,
        }
    }
}
```

<br>
Let's define the `Future` trait implementation for the `Racer` struct now. For that, again we need to define the poll method and the Output type.
Since our executor calls the poll method until the future is ready, we can implement our race logic in it.

```rust
impl<'a> Future for Racer<'a> {
    type Output = ();

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        // increment the distance covered per slot
        self.distance_covered += self.slot_distance;
        // check if the racer has finished
        if self.distance_covered >= self.total_distance {
            println!("{} has finished", self.name);
            // return ready if the racer has finished
            // this will notify the executor that the future has completed
            return Poll::Ready(());
        }
        println!(
            "{} has covered {} distance",
            self.name, self.distance_covered
        );
        // call waker to notify the executor that the future needs to be polled again
        cx.waker().wake_by_ref();
        // return pending if the racer has not finished
        // this will notify the executor that the future is not ready yet
        Poll::Pending
    }
}
```

We are returning `Poll::Ready` if the racer has finished so that the executor knows that the future has completed. Otherwise, we are returning `Poll::Pending` to let the executor know that the future is not ready yet and it needs to be polled again. Also, we are calling the `wake_by_ref` method on the `Waker` to notify the executor that the future needs to be polled again.

<br>

Now, let's create three racers and make them compete against each other asynchronously. We will use the `tokio` runtime to run our futures concurrently
but on a single thread so that we can compare our results fairly.

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    let racer1 = Racer::new("Racer 1", 40, 100);
    let racer2 = Racer::new("Racer 2", 20, 100);
    let racer3 = Racer::new("Racer 3", 30, 100);
    let join1 = tokio::spawn(racer1);
    let join2 = tokio::spawn(racer2);
    let join3 = tokio::spawn(racer3);
    // join all the three async tasks to wait for them to complete
    join1.await.unwrap();
    join2.await.unwrap();
    join3.await.unwrap();
}
```

Let's compile and check the results now:

```sh
celestix@andromeda ~/future-trait$ cargo run
   Compiling future-trait v0.1.0 (/home/celestix/future-trait)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.07s
     Running `target/debug/future-trait`
Racer 1 has covered 40 distance
Racer 2 has covered 20 distance
Racer 3 has covered 30 distance
Racer 1 has covered 80 distance
Racer 2 has covered 40 distance
Racer 3 has covered 60 distance
Racer 1 has finished
Racer 2 has covered 60 distance
Racer 3 has covered 90 distance
Racer 2 has covered 80 distance
Racer 3 has finished
Racer 2 has finished
```

and now as we can see, all the racers are running asynchronously without blocking each other and hence the correct results are obtained.

<br>

Going a step further, let's try to create a bit more complex implemention of the `Future` trait where our struct's poll function calls another future's poll function to support nested async operations.

## A bit complex example [^5]

[^5]: Implementing Future trait for a bit complex example

```rust
struct WebFetcher<'a> {
    url: &'a str,

    // Send is required to make the future sendable across threads
    _fut: Option<Pin<Box<dyn Future<Output = reqwest::Response> + Send>>>,
}

impl<'a> WebFetcher<'a> {
    fn new(url: &'a str) -> Self {
        WebFetcher { url, _fut: None }
    }
}
```

Here, we have create a struct `WebFetcher` which will fetch the response from the given URL. We have an optional field `_fut` holding the future that will fetch the response from the given URL.

<br>

Let's implement the `Future` trait for the `WebFetcher` struct now.

```rust
impl Future for WebFetcher<'_> {
    type Output = reqwest::Response;

    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        // if the future is not created yet, create it
        if self._fut.is_none() {
            // convert the url to String to make it sendable across threads
            let url = self.url.to_string();
            self._fut = Some(Box::pin(async {
                // fetch the response from the given URL
                // using reqwest crate and return it
                return reqwest::get(url).await.unwrap();
            }))
        }
        let fut = self._fut.as_mut().unwrap();
        fut.as_mut().poll(cx)
    }
}
```

You must have noticed that we are creating a future and storing it as `_fut`. This is necessary to ensure that the future is not created again and again on each poll. 

Let's create a main function to fetch the response from the given URL using our `WebFetcher` struct.

```rust
#[tokio::main]
async fn main() {
    let resp = WebFetcher::new("https://www.rust-lang.org").await;
    println!("Fetched value from WebFetcher is {:#?}", resp);
}
```

Compile and run the above code using `cargo run` and you will see the output like this:

```sh
celestix@andromeda ~/future-trait$ cargo run
   Compiling future-trait v0.1.0 (/home/celestix/future-trait)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.07s
     Running `target/debug/future-trait`
Fetched value from WebFetcher is Response {
    url: "https://www.rust-lang.org/",
    status: 200,
    headers: {
        "content-type": "text/html; charset=utf-8",
        "content-length": "19898",
        "connection": "keep-alive",
        "via": "1.1 vegur, 1.1 cloudfront.net (CloudFront)",
        "server": "Rocket",
        "x-frame-options": "SAMEORIGIN",
        "permissions-policy": "interest-cohort=()",
        "x-content-type-options": "nosniff",
        "x-xss-protection": "1; mode=block",
        "strict-transport-security": "max-age=63072000",
        "referrer-policy": "no-referrer, strict-origin-when-cross-origin",
        "date": "Sat, 22 Mar 2025 21:23:18 GMT",
        "x-cache": "Miss from cloudfront",
        "x-amz-cf-pop": "CCU50-C1",
    },
}
```

Hooraay! Our `WebFetcher` struct is working perfectly!!!

<br>

And that's it! You have successfully implemented the `Future` trait for a custom type in Rust. You have also seen how to use the `Future` trait to implement asynchronous operations and how to run multiple futures concurrently using the `tokio` runtime. I hope this post helped you grasp the fundamentals of the `Future` trait and its implementation.

