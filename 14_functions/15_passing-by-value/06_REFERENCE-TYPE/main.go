package main

import "fmt"

func main(){
    m := make([]string,2,25)
    fmt.Println(m)
    changeMe(m)
    fmt.Println(m)
}

func changeMe(z[]string){
    z[0] = "Todd"
    z[1] = "second"
    fmt.Println(z)
}