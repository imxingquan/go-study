//iota 常量计数器 在遇见const后被重置为0

package main

import "fmt"

const(
    a = iota  //0
    b
    c 
)

const(
    d = iota //0
    e
    f
)

func main(){
    fmt.Println(a)
     fmt.Println(b)
      fmt.Println(c)
       fmt.Println(d)
        fmt.Println(e)
         fmt.Println(f)
}