package main

import (
    "encoding/json"
    "fmt"
)

type person struct{
    First string
    Last string
    Age int `json:"wisdom score"`
}

func main(){
    var p1 person

    //Age 不能 Unmarshal 应该使用 wisdom score
    bs := []byte(`{"First":"李","Last":"大头","Age":20}`)

    json.Unmarshal(bs,&p1)

    fmt.Println(p1.First)
    fmt.Println(p1.Last)
    fmt.Println(p1.Age)

    fmt.Printf("%T \n",p1)
}