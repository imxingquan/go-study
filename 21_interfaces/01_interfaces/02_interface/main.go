package main

import "fmt"

type square struct{
    side float64
}

func (z square) area() float64{
    return z.side * z.side
}

//接口也是一种有代表性的类型
type shape interface{
    area() float64
}

func info(z shape){
    fmt.Println(z)
    fmt.Println(z.area())
}

func main(){
    s := square{10}
    fmt.Printf("%T\n",s)
    info(s)
}
