package main

import (
    "fmt"
    "sync"
)

var wg sync.WaitGroup

//并行计算由go自行切换运行
func main(){
    wg.Add(2)
    go foo()
    go bar()
    wg.Wait()
}

func foo(){
    for i := 0; i < 45; i++ {
        fmt.Println("Foo:",i)
    }
    wg.Done()
}

func bar(){
    for i :=0 ; i< 45; i++{
        fmt.Println("Bar:",i)
    }
    wg.Done()
}

//output:
/*
Bar: 0
Bar: 1
Bar: 2
Bar: 3
Bar: 4
Bar: 5
Bar: 6
Bar: 7
Bar: 8
Bar: 9
Bar: 10
Bar: 11
Bar: 12
Bar: 13
Bar: 14
Bar: 15
Bar: 16
Bar: 17
Bar: 18
Bar: 19
Bar: 20
Bar: 21
Bar: 22
Bar: 23
Bar: 24
Bar: 25
Bar: 26
Bar: 27
Bar: 28
Bar: 29
Bar: 30
Bar: 31
Bar: 32
Bar: 33
Bar: 34
Bar: 35
Bar: 36
Foo: 0
Foo: 1
Foo: 2
Foo: 3
Foo: 4
Foo: 5
Foo: 6
Foo: 7
Foo: 8
Foo: 9
Foo: 10
Foo: 11
Foo: 12
Foo: 13
Foo: 14
Foo: 15
Foo: 16
Foo: 17
Foo: 18
Foo: 19
Foo: 20
Foo: 21
Foo: 22
Foo: 23
Foo: 24
Foo: 25
Foo: 26
Foo: 27
Foo: 28
Foo: 29
Foo: 30
Foo: 31
Foo: 32
Foo: 33
Foo: 34
Foo: 35
Foo: 36
Foo: 37
Foo: 38
Foo: 39
Foo: 40
Foo: 41
Foo: 42
Foo: 43
Foo: 44
Bar: 37
Bar: 38
Bar: 39
Bar: 40
Bar: 41
Bar: 42
Bar: 43
Bar: 44
*/