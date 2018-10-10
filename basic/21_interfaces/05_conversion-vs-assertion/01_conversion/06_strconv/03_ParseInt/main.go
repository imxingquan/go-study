package main

import (
    "fmt"
    "strconv"
)

func main(){

    b, _ := strconv.ParseBool("true")
    f, _ := strconv.ParseFloat("3.1415",64)
    i, _ := strconv.ParseInt("-42",10,64)
    u, _ := strconv.ParseUint("42",10,64)

    fmt.Println(b,f,i,u)

}