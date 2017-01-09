package main

import(
    "encoding/json"
    "fmt"
)

type person struct{
    first string
    last string
    Age int
}

func main(){
    p1 := person{"Janes","Bond",20}
    fmt.Println(p1)
    bs,_ := json.Marshal(p1)
    fmt.Println(string(bs))
    fmt.Println(bs)
}

