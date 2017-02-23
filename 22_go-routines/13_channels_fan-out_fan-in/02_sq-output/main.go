package main

import (
    "fmt"
    "sync"
)

func main(){
    in := gen(2,3,100,23,2,32,3,2,3,2,2,3,2,31,231,23231)

    c1 := sq(in)
    c2 := sq(in)

    for n := range merge(c1,c2){
        fmt.Println(n)
    }

   
}

func gen(nums ...int)chan int{
    fmt.Printf("TYPE OF NUMS %T\n",nums)

    out := make(chan int)
    go func(){
        for _,n:= range nums{
            out <- n
        }
        close(out)
    }()
    return out
}

func sq(in chan int)chan int{
    out := make(chan int)
    go func(){
        for n := range in{
            out <- n * n
        }
        close(out)
    }()
    return out
}

func merge(cs ...chan int)chan int{
    fmt.Printf("TYPE OF CS: %T\n",cs)

    out := make(chan int)
    var wg sync.WaitGroup
    wg.Add(len(cs))
    for _,c := range cs{
        go func(ch chan int){
            for n:= range ch{
                out <-n
            }
            wg.Done()
        }(c)
    }

    go func(){
        wg.Wait()
        close(out)
    }()

    return out;

}