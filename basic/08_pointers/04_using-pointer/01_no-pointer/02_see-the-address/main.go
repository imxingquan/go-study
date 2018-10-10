package main

import "fmt"

func zero(z int){
    fmt.Printf("%p\n",&z)
    fmt.Println(&z)
    z = 0
}

func main(){
    x := 5
    fmt.Printf("%p\n",&x)
    fmt.Println(&x)
    zero(x)
    fmt.Println(x)
}

// 变量x 和 z的地址是不一样的。
/*
0xc04203a1c0
0xc04203a1c0
0xc04203a1c8
0xc04203a1c8
5
*/