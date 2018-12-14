package main

import (
    "fmt"
    "runtime"
    "sync"
    "time"
)

var wg sync.WaitGroup
//go 自定调用初始化
func init(){
    fmt.Println("go init()")
    runtime.GOMAXPROCS(runtime.NumCPU())
}

func main(){
    wg.Add(2)
    go foo()
    go bar()
    wg.Wait()
}

func foo(){
    for i := 0; i < 45; i++ {
        fmt.Println("Foo:",i)
        time.Sleep(3 * time.Millisecond)
    }
    wg.Done()
}

func bar(){
    for i := 0; i < 45; i++ {
        fmt.Println("Bar:",i)
        time.Sleep(3 * time.Millisecond)
    }
    wg.Done()
}